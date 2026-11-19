// Büyük STEP montajını parça parça okumak için bölücü (işçi içinde, importScripts ile).
// STEP metnini tarar; her katı (MANIFOLD_SOLID_BREP …) için yalnız gereken varlıklardan küçük bir STEP üretir
// ve montaj yerleşimlerini (NAUO + dönüşümlü ilişkiler, MAPPED_ITEM) dünya matrislerine çevirir.
// Böylece OpenCascade bütün dosyayı aynı anda belleğe almaz; aynı parça bir kez ağlanır, kopyaları matrisle çoğaltılır.
/* global self */
(function () {
  const SOLIDS = new Set(["MANIFOLD_SOLID_BREP", "BREP_WITH_VOIDS", "FACETED_BREP", "SHELL_BASED_SURFACE_MODEL"]);
  const REPS = new Set(["ADVANCED_BREP_SHAPE_REPRESENTATION", "SHAPE_REPRESENTATION", "MANIFOLD_SURFACE_SHAPE_REPRESENTATION", "FACETED_BREP_SHAPE_REPRESENTATION", "GEOMETRICALLY_BOUNDED_SURFACE_SHAPE_REPRESENTATION"]);

  function index(text) {
    const d = text.indexOf("DATA;");
    if (d < 0) throw new Error("STEP DATA bölümü yok");
    const ids = [], st = [], en = [], tp = [];
    let i = d + 5, n = text.length;
    while (i < n) {
      // sonraki '#' (varlık başı) veya ENDSEC
      while (i < n && text.charCodeAt(i) !== 35) { if (text.startsWith("ENDSEC", i)) { i = n; break; } i++; }
      if (i >= n) break;
      const s = i;
      let j = i + 1, id = 0;
      while (j < n) { const c = text.charCodeAt(j); if (c < 48 || c > 57) break; id = id * 10 + (c - 48); j++; }
      // '=' ara
      while (j < n && text.charCodeAt(j) !== 61) j++;
      j++;
      // tip adı
      while (j < n && (text.charCodeAt(j) === 32 || text.charCodeAt(j) === 10 || text.charCodeAt(j) === 13)) j++;
      let tname = "";
      if (text.charCodeAt(j) === 40) tname = "(";
      else { let k = j; while (k < n) { const c = text.charCodeAt(k); if (!((c >= 65 && c <= 90) || (c >= 48 && c <= 57) || c === 95)) break; k++; } tname = text.slice(j, k); }
      // ifade sonu: tırnak dışındaki ';'
      let q = false;
      while (j < n) {
        const c = text.charCodeAt(j);
        if (c === 39) q = !q;
        else if (c === 59 && !q) break;
        j++;
      }
      ids.push(id); st.push(s); en.push(j + 1); tp.push(tname);
      i = j + 1;
    }
    const pos = new Map();
    for (let k = 0; k < ids.length; k++) pos.set(ids[k], k);
    return { text, ids, st, en, tp, pos, header: text.slice(0, d) };
  }
  const body = (ix, k) => ix.text.slice(ix.st[k], ix.en[k]);
  const refsOf = (s) => { const out = []; const re = /#(\d+)/g; let m; re.lastIndex = s.indexOf("=") + 1; while ((m = re.exec(s))) out.push(+m[1]); return out; };
  const args = (s) => { // en dıştaki parantezin argümanları (basit; iç içe parantez korunur)
    const a = s.indexOf("("), out = []; let dep = 0, q = false, cur = "";
    for (let i = a + 1; i < s.length; i++) {
      const c = s[i];
      if (c === "'") q = !q;
      if (!q && c === "(") dep++;
      if (!q && c === ")") { if (dep === 0) { out.push(cur.trim()); break; } dep--; }
      if (!q && c === "," && dep === 0) { out.push(cur.trim()); cur = ""; continue; }
      cur += c;
    }
    return out;
  };
  const ref = (a) => { const m = /^#(\d+)$/.exec(a); return m ? +m[1] : null; };
  const str = (a) => (a && a[0] === "'" ? a.slice(1, -1).replace(/''/g, "'") : "");
  const decodeName = (s) => s.replace(/\\X2\\([0-9A-F]+)\\X0\\/g, (_, hex) => hex.match(/.{4}/g).map((h) => String.fromCharCode(parseInt(h, 16))).join("")).replace(/\\X\\([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

  // ---- matris (4x4, sütun ana sırası değil: satır dizisi [r00,r01,r02,tx, r10..., r20...]) ----
  const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];
  const mul = (A, B) => { const o = new Array(12); for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) o[r * 4 + c] = A[r * 4] * B[c] + A[r * 4 + 1] * B[4 + c] + A[r * 4 + 2] * B[8 + c]; o[r * 4 + 3] = A[r * 4] * B[3] + A[r * 4 + 1] * B[7] + A[r * 4 + 2] * B[11] + A[r * 4 + 3]; } return o; };
  const inv = (A) => { const o = new Array(12); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 4 + c] = A[c * 4 + r]; for (let r = 0; r < 3; r++) o[r * 4 + 3] = -(o[r * 4] * A[3] + o[r * 4 + 1] * A[7] + o[r * 4 + 2] * A[11]); return o; };
  const nrm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  function numList(s) { return s.replace(/[()]/g, "").split(",").map((x) => parseFloat(x)); }
  function placement(ix, id, unit) {
    const k = ix.pos.get(id); if (k == null) return I;
    const s = body(ix, k), a = args(s);
    if (ix.tp[k] !== "AXIS2_PLACEMENT_3D") return I;
    const pt = (rid) => { const kk = ix.pos.get(rid); return numList(args(body(ix, kk))[1]).map((x) => x * unit); };
    const dir = (rid) => { const kk = ix.pos.get(rid); return nrm(numList(args(body(ix, kk))[1])); };
    const o = pt(ref(a[1]));
    const z = a[2] !== "$" ? dir(ref(a[2])) : [0, 0, 1];
    let x = a[3] !== "$" ? dir(ref(a[3])) : (Math.abs(z[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]);
    const d = x[0] * z[0] + x[1] * z[1] + x[2] * z[2];
    x = nrm([x[0] - d * z[0], x[1] - d * z[1], x[2] - d * z[2]]);
    const y = cross(z, x);
    return [x[0], y[0], z[0], o[0], x[1], y[1], z[1], o[1], x[2], y[2], z[2], o[2]];
  }

  function closure(ix, rootIds) {
    const seen = new Set(), stack = [...rootIds];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      const k = ix.pos.get(id); if (k == null) continue;
      seen.add(id);
      for (const r of refsOf(body(ix, k))) if (!seen.has(r)) stack.push(r);
    }
    return [...seen].sort((a, b) => a - b);
  }

  // Ana fonksiyon: { parts:[{key, name, step, insts:[matrix]}], unit }
  self.miSplitStep = function (text) {
    const ix = index(text);
    const n = ix.ids.length;
    // birim: SI_UNIT(.MILLI.,.METRE.) yoksa metre/inç olabilir → OpenCascade mm'ye çevirir; biz de konumları çeviririz
    let unit = 1;
    if (!/SI_UNIT\s*\(\s*\.MILLI\.\s*,\s*\.METRE\.\s*\)/.test(text)) {
      if (/SI_UNIT\s*\(\s*\$\s*,\s*\.METRE\.\s*\)/.test(text)) unit = 1000;
      else if (/INCH/i.test(text)) unit = 25.4;
    }
    const byType = (t) => { const o = []; for (let k = 0; k < n; k++) if (ix.tp[k] === t) o.push(k); return o; };
    // temsil → içindeki katılar ve MAPPED_ITEM'lar
    const repItems = new Map();
    const repsK = [];
    for (let k = 0; k < n; k++) if (REPS.has(ix.tp[k])) repsK.push(k);
    for (const k of repsK) {
      const a = args(body(ix, k));
      repItems.set(ix.ids[k], (a[1] || "").replace(/[()]/g, "").split(",").map((x) => ref(x.trim())).filter((x) => x != null));
    }
    // birleşim kümesi: dönüşümsüz SRR ile bağlı temsiller aynı çerçeve
    const parent = new Map();
    const find = (x) => { while (parent.has(x) && parent.get(x) !== x) { const p = parent.get(x); parent.set(x, parent.get(p) ?? p); x = p; } return x; };
    const union = (a, b) => { a = find(a); b = find(b); if (a !== b) parent.set(a, b); };
    const edges = []; // {parentRep, childRep, T}
    // ürün adları: temsil → PRODUCT adı
    const pdOfPds = new Map(), repOfPd = new Map(), nameOfPd = new Map();
    for (const k of byType("PRODUCT_DEFINITION_SHAPE")) { const a = args(body(ix, k)); pdOfPds.set(ix.ids[k], ref(a[2])); }
    const prodName = new Map();
    for (const k of byType("PRODUCT")) { const a = args(body(ix, k)); prodName.set(ix.ids[k], decodeName(str(a[1]) || str(a[0]))); }
    const pdfProd = new Map();
    for (const t of ["PRODUCT_DEFINITION_FORMATION", "PRODUCT_DEFINITION_FORMATION_WITH_SPECIFIED_SOURCE"]) for (const k of byType(t)) { const a = args(body(ix, k)); pdfProd.set(ix.ids[k], ref(a[2])); }
    for (const k of byType("PRODUCT_DEFINITION")) { const a = args(body(ix, k)); nameOfPd.set(ix.ids[k], prodName.get(pdfProd.get(ref(a[2]))) || ""); }
    for (const k of byType("SHAPE_DEFINITION_REPRESENTATION")) { const a = args(body(ix, k)); const pd = pdOfPds.get(ref(a[0])); if (pd != null) repOfPd.set(pd, ref(a[1])); }
    const nameOfRep = new Map();
    for (const [pd, rep] of repOfPd) nameOfRep.set(rep, nameOfPd.get(pd));
    // NAUO: ilişki → üst PD
    const nauoParent = new Map();
    for (const k of byType("NEXT_ASSEMBLY_USAGE_OCCURRENCE")) { const a = args(body(ix, k)); nauoParent.set(ix.ids[k], { parent: ref(a[3]), child: ref(a[4]) }); }
    const relParentRep = new Map();
    for (const k of byType("CONTEXT_DEPENDENT_SHAPE_REPRESENTATION")) {
      const a = args(body(ix, k)); const rel = ref(a[0]), pds = ref(a[1]);
      const pd = pdOfPds.get(pds); const na = nauoParent.get(pd);
      if (na) relParentRep.set(rel, repOfPd.get(na.parent));
    }
    // ilişkiler (düz ya da karmaşık varlık)
    for (let k = 0; k < n; k++) {
      const s = body(ix, k);
      if (ix.tp[k] === "SHAPE_REPRESENTATION_RELATIONSHIP" || (ix.tp[k] === "(" && s.includes("REPRESENTATION_RELATIONSHIP("))) {
        const rr = /REPRESENTATION_RELATIONSHIP\s*\(([^)]*)\)/.exec(s);
        if (!rr) continue;
        const a = rr[1].split(",").map((x) => x.trim());
        const r1 = ref(a[2]), r2 = ref(a[3]);
        const tr = /REPRESENTATION_RELATIONSHIP_WITH_TRANSFORMATION\s*\(\s*#(\d+)\s*\)/.exec(s);
        if (!tr) { if (r1 != null && r2 != null) union(r1, r2); continue; }
        const idt = ix.pos.get(+tr[1]);
        const ia = args(body(ix, idt));
        const P1 = placement(ix, ref(ia[2]), unit), P2 = placement(ix, ref(ia[3]), unit);
        let T = mul(P2, inv(P1)), child = r1, par = r2;
        const pr = relParentRep.get(ix.ids[k]);
        if (pr != null && find(pr) === find(r1) && find(pr) !== find(r2)) { child = r2; par = r1; T = inv(T); }
        edges.push({ par, child, T });
      }
    }
    // MAPPED_ITEM
    const mapped = new Map(); // mapped item id → {rep, T}
    for (const k of byType("MAPPED_ITEM")) {
      const a = args(body(ix, k));
      const rm = ix.pos.get(ref(a[1])); if (rm == null) continue;
      const ra = args(body(ix, rm));
      const origin = placement(ix, ref(ra[0]), unit), target = placement(ix, ref(a[2]), unit);
      mapped.set(ix.ids[k], { rep: ref(ra[1]), T: mul(target, inv(origin)) });
    }
    // grup kenarları
    const kids = new Map();
    const addKid = (p, c, T) => { p = find(p); c = find(c); if (p === c) return; if (!kids.has(p)) kids.set(p, []); kids.get(p).push({ c, T }); };
    for (const e of edges) addKid(e.par, e.child, e.T);
    for (const [rep, items] of repItems) for (const it of items) { const m = mapped.get(it); if (m) addKid(rep, m.rep, m.T); }
    const hasParent = new Set();
    for (const [, ks] of kids) for (const x of ks) hasParent.add(x.c);
    // grup → katılar, ad
    const groupSolids = new Map(), groupName = new Map();
    for (const [rep, items] of repItems) {
      const g = find(rep);
      for (const it of items) { const kk = ix.pos.get(it); if (kk != null && SOLIDS.has(ix.tp[kk])) { if (!groupSolids.has(g)) groupSolids.set(g, new Set()); groupSolids.get(g).add(it); } }
      if (nameOfRep.get(rep)) groupName.set(g, nameOfRep.get(rep));
    }
    // katı → bağlam (temsilin bağlamı)
    const solidCtx = new Map();
    for (const k of repsK) { const a = args(body(ix, k)); const ctx = ref(a[2]); for (const it of repItems.get(ix.ids[k])) if (!solidCtx.has(it)) solidCtx.set(it, ctx); }
    // kökler
    const groups = new Set([...repItems.keys()].map(find));
    const roots = [...groups].filter((g) => !hasParent.has(g));
    const insts = new Map(); // solidId → {name, mats[]}
    let guard = 0;
    const walk = (g, M, depth) => {
      if (depth > 40 || ++guard > 2e6) return;
      for (const sid of groupSolids.get(g) || []) {
        if (!insts.has(sid)) { const kk = ix.pos.get(sid); insts.set(sid, { name: groupName.get(g) || decodeName(str(args(body(ix, kk))[0])) || "Parça", mats: [] }); }
        insts.get(sid).mats.push(M);
      }
      for (const { c, T } of kids.get(g) || []) walk(c, mul(M, T), depth + 1);
    };
    for (const r of roots) walk(r, I, 0);
    // tek tek STEP
    const head = ix.header.replace(/FILE_SCHEMA\s*\(\s*\(\s*'[^']*'/, (m) => m);
    const parts = [];
    let next = 0; for (const id of ix.ids) if (id > next) next = id;
    for (const [sid, inst] of insts) {
      const ctx = solidCtx.get(sid);
      const ids = closure(ix, [sid, ctx].filter((x) => x != null));
      const rid = next + 1;
      const lines = ids.map((id) => body(ix, ix.pos.get(id)));
      lines.push(`#${rid}=ADVANCED_BREP_SHAPE_REPRESENTATION('',(#${sid}),#${ctx});`);
      // OpenCascade'in kök bulması için ürün yapısı
      const b = rid + 1;
      lines.push(`#${b}=APPLICATION_CONTEXT('mi');`, `#${b + 1}=PRODUCT_CONTEXT('',#${b},'mechanical');`, `#${b + 2}=PRODUCT('p','p','',(#${b + 1}));`,
        `#${b + 3}=PRODUCT_DEFINITION_FORMATION('','',#${b + 2});`, `#${b + 4}=PRODUCT_DEFINITION_CONTEXT('part definition',#${b},'design');`,
        `#${b + 5}=PRODUCT_DEFINITION('','',#${b + 3},#${b + 4});`, `#${b + 6}=PRODUCT_DEFINITION_SHAPE('','',#${b + 5});`, `#${b + 7}=SHAPE_DEFINITION_REPRESENTATION(#${b + 6},#${rid});`);
      parts.push({ key: sid, name: inst.name, step: head + "DATA;\n" + lines.join("\n") + "\nENDSEC;\nEND-ISO-10303-21;\n", insts: inst.mats });
    }
    return { parts, unit, solids: insts.size, roots: roots.length };
  };
})();
