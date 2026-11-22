// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-1d8c54bb0d";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-CnhSWZSy.js","./assets/acinim-D_B_QtKK.js","./assets/aciolcer-yxB6TSFv.js","./assets/annotate-BxH1txbV.js","./assets/ar-9MmmS5pp.js","./assets/atolye-oJIFWHYx.js","./assets/base-B-3lmZUv.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-Cq28Quj5.js","./assets/calc-DBGRQeiM.js","./assets/compare-BEUqIhvj.js","./assets/cost-DddWI6KB.js","./assets/depo-D5aa7Hx8.js","./assets/dxf-DSx56_Nf.js","./assets/en-BtAdFja3.js","./assets/esm-BHGMxr3c.js","./assets/esm-CAQx9XUn.js","./assets/esm-DR2_nNhE.js","./assets/esm-DVJ50wQ0.js","./assets/excel-CVju1Wp7.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-3wqopQbm.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-CRBtRGkh.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BOXEFCHo.css","./assets/index-Cf3GSbEM.js","./assets/index.es-YZ4D6oxW.js","./assets/isler-DoWTrrb-.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-BbES5Q_t.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-Cwe_vJ3D.js","./assets/kart-Bs7iMH0r.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-ClemFKyr.js","./assets/labels-DqxoNaK9.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-D15NkrZT.js","./assets/loader-CvcNITmE.js","./assets/maliyet-rl8IaIDv.js","./assets/markalama-CIs8yrJU.js","./assets/measure-CWknVino.js","./assets/montaj-J-mRQy57.js","./assets/native-BdiZdAcu.js","./assets/nest-BiPeKmPj.js","./assets/paket-C_HRkPR1.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-BqYhJFix.js","./assets/prices-ui-DF9X-Grh.js","./assets/project-Bsx9G3vR.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-BGytrqgz.js","./assets/ru-QkSM0htl.js","./assets/sablon-_LVZIix6.js","./assets/siparis-3ZkswBjm.js","./assets/tani-BGIgtfBf.js","./assets/tani-CAdev3Tq.js","./assets/tani_karsilastir-CcVjioG2.js","./assets/teklif-D2A_UgBa.js","./assets/teslim-DoJZWDS5.js","./assets/three.module-DdJfuIKW.js","./assets/tools-_e0Ms_HY.js","./assets/unfold-DjOq-9rk.js","./assets/view3d-fuI9KrpK.js","./assets/viewdxf-DFdeYlLK.js","./assets/viewer3d-B9Bhx4Sg.js","./assets/viewpdf-D1aqypKn.js","./assets/web-B0j5a7uF.js","./assets/web-BYacQ4Un.js","./assets/web-DUhqjaME.js","./assets/web-mF6z4dcc.js","./assets/widget-BqxuOdHj.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-D4jm1zT4.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
