// OpenCascade (occt-import-js) arka plan işçisi: STEP/IGES/BREP -> üçgen ağ + B-rep yüz aralıkları.
importScripts("occt-import-js.js", "split.js");
let occtP = null;
function occt() {
  if (!occtP) occtP = occtimportjs({ locateFile: (p) => p });
  return occtP;
}
self.onmessage = async (ev) => {
  const { id, kind, buffer, fine } = ev.data;
  try {
    const o = await occt();
    const data = new Uint8Array(buffer);
    const params = fine
      ? { linearUnit: "millimeter", linearDeflectionType: "bounding_box_ratio", linearDeflection: 0.0006, angularDeflection: 0.25 }
      : { linearUnit: "millimeter", linearDeflectionType: "bounding_box_ratio", linearDeflection: 0.0015, angularDeflection: 0.4 };
    const BIG = 8e6; // bundan büyük STEP: parça parça oku (bellek)
    const isStep = kind !== "iges" && kind !== "brep";
    if (isStep && data.length > BIG) return splitRead(o, id, data, params);
    let r;
    try {
      if (kind === "iges") r = o.ReadIgesFile(data, params);
      else if (kind === "brep") r = o.ReadBrepFile(data, params);
      else r = o.ReadStepFile(data, params);
    } catch (e) { r = null; }
    if (isStep && (!r || !r.success || !r.meshes.length || r.meshes.every((m) => !m.index.array.length))) return splitRead(o, id, data, params);
    if (!r || !r.success) throw new Error("Dosya okunamadı (bozuk veya desteklenmeyen STEP).");
    const transfer = [];
    const meshes = r.meshes.map((m) => {
      const pos = new Float32Array(m.attributes.position.array);
      const nor = m.attributes.normal ? new Float32Array(m.attributes.normal.array) : null;
      const idx = new Uint32Array(m.index.array);
      transfer.push(pos.buffer, idx.buffer);
      if (nor) transfer.push(nor.buffer);
      return { name: m.name || "", color: m.color || null, faces: m.brep_faces.map((f) => [f.first, f.last]), pos, nor, idx };
    });
    self.postMessage({ id, ok: true, root: r.root, meshes }, transfer);
  } catch (e) {
    self.postMessage({ id, ok: false, error: String((e && e.message) || e) });
  }
};

// Büyük montaj: her tekil katı ayrı küçük STEP olarak ağlanır, kopyalar matrisle çoğaltılır.
function splitRead(o, id, data, params) {
  self.postMessage({ id, progress: "Montaj yapısı çözülüyor…" });
  let text = new TextDecoder("latin1").decode(data);
  const sp = self.miSplitStep(text);
  text = null;
  if (!sp.parts.length) throw new Error("Dosyada katı parça bulunamadı.");
  const enc = new TextEncoder();
  const meshes = [], transfer = [];
  const total = sp.parts.reduce((a, p) => a + p.insts.length, 0);
  let done = 0, failed = 0;
  sp.parts.forEach((p, i) => {
    if (i % 5 === 0) self.postMessage({ id, progress: `Parça ${i + 1}/${sp.parts.length} ağlanıyor (${total} adet)` });
    let r = null;
    try { r = o.ReadStepFile(enc.encode(p.step), params); } catch (e) { r = null; }
    p.step = null;
    if (!r || !r.success || !r.meshes.length) { failed++; return; }
    for (const m of r.meshes) {
      const P = m.attributes.position.array, N = m.attributes.normal ? m.attributes.normal.array : null, idxA = m.index.array;
      const faces = m.brep_faces.map((f) => [f.first, f.last]);
      for (const M of p.insts) {
        const pos = new Float32Array(P.length), nor = N ? new Float32Array(N.length) : null;
        for (let k = 0; k < P.length; k += 3) {
          const x = P[k], y = P[k + 1], z = P[k + 2];
          pos[k] = M[0] * x + M[1] * y + M[2] * z + M[3]; pos[k + 1] = M[4] * x + M[5] * y + M[6] * z + M[7]; pos[k + 2] = M[8] * x + M[9] * y + M[10] * z + M[11];
          if (nor) { const a = N[k], b = N[k + 1], c = N[k + 2]; nor[k] = M[0] * a + M[1] * b + M[2] * c; nor[k + 1] = M[4] * a + M[5] * b + M[6] * c; nor[k + 2] = M[8] * a + M[9] * b + M[10] * c; }
        }
        const idx = new Uint32Array(idxA);
        transfer.push(pos.buffer, idx.buffer); if (nor) transfer.push(nor.buffer);
        meshes.push({ name: p.name, color: m.color || null, faces, pos, nor, idx });
        done++;
      }
    }
  });
  const root = { name: "", meshes: meshes.map((_, i) => i), children: [] };
  self.postMessage({ id, ok: true, root, meshes, split: { unique: sp.parts.length, total: done, failed } }, transfer);
}
