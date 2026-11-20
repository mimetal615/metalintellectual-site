// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-7a5346ce57";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-89ApG6lp.js","./assets/acinim-BORijHP-.js","./assets/aciolcer-Cm9Ra0G4.js","./assets/annotate-BNDqyMZB.js","./assets/ar-DbpC0_Yz.js","./assets/atolye-CJoGjoJZ.js","./assets/base-BPLoue0b.js","./assets/bend-DH5GkQwx.js","./assets/bukumlist-i4Paysz8.js","./assets/calc-DBGRQeiM.js","./assets/compare-BT2jfbtB.js","./assets/cost-B01lfCMP.js","./assets/depo-CE04ZKjj.js","./assets/dxf-BbVyjtDf.js","./assets/en-Co1DpI80.js","./assets/esm-Bb2E3jWV.js","./assets/esm-BpFJTIoa.js","./assets/esm-C99hH9lT.js","./assets/esm-De50d0ra.js","./assets/excel-C8AnSPJN.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-o1aiUkVB.js","./assets/geom-Bscsapw2.js","./assets/home-DAhRvZ_t.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-CRsGhEgj.css","./assets/index-UFalzSPc.js","./assets/index.es-fpXKZdQj.js","./assets/isler-CmLbY1-4.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-D8l4pAqy.js","./assets/jszip.min-C2y56AlE.js","./assets/kart-BNQPwkWY.js","./assets/kontrol-TvJ-gju8.js","./assets/labels-BYJhnac4.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-DFoSInRx.js","./assets/markalama-9zgYj0L3.js","./assets/measure-bu_d9hAD.js","./assets/montaj-BRf2xQk2.js","./assets/native-CmyjZU5g.js","./assets/nest-B38_RvBB.js","./assets/paket-4C4JNawG.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-DwvAaZry.js","./assets/prices-ui-DXAmNaiY.js","./assets/project-DpMgJKaf.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-rMBM214l.js","./assets/ru-BLY_AH83.js","./assets/sablon-E7enNqGV.js","./assets/siparis-B_9C7NHX.js","./assets/tani-CIKTqBxs.js","./assets/tani-CStYp_y1.js","./assets/teklif-C73x9bjb.js","./assets/teslim-C-wJ4ITW.js","./assets/tools-DX9cy7-u.js","./assets/unfold-C3uJA5KQ.js","./assets/view3d-DFRGXc58.js","./assets/viewdxf-B5QeGAQF.js","./assets/viewer3d-DR5y9tqT.js","./assets/viewpdf-t3KuzWYe.js","./assets/web-BOFdEELY.js","./assets/web-C80rR8cx.js","./assets/web-D78hm9zq.js","./assets/web-mG7qpC4d.js","./assets/widget-CYFk1nTf.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-CpngUITK.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(V);
    const hit = await c.match(r, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const resp = await fetch(r);
      if (resp.ok && resp.type === "basic") c.put(r, resp.clone());
      return resp;
    } catch (err) {
      if (r.mode === "navigate") { const idx = await c.match("./index.html"); if (idx) return idx; }
      throw err;
    }
  })());
});
