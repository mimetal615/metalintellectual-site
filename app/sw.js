// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-e1dc9cf171";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-CTpz9xeY.js","./assets/acinim-BeUXR_3X.js","./assets/aciolcer-fDTce8tQ.js","./assets/annotate-DEKULGnW.js","./assets/ar-CvUg3RC-.js","./assets/atolye-Dd6ElwsV.js","./assets/base-CE-s-UXw.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-ByDgaEWC.js","./assets/calc-DBGRQeiM.js","./assets/compare-B0jPsv51.js","./assets/cost-DaDPt4et.js","./assets/depo-D7JYslyg.js","./assets/dxf-CQ43SjbG.js","./assets/en-Dh-SjnJi.js","./assets/esm-CkDm1rmC.js","./assets/esm-D4C-mddn.js","./assets/esm-DevZ8Ghf.js","./assets/esm-M9X8Xzaa.js","./assets/excel-BAU3CSFl.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-D33UWLkZ.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-BYAflYTi.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-B_ARQjau.css","./assets/index-DkNm-8vT.js","./assets/index.es-DT9hWy07.js","./assets/isler-C10YKCgr.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-BlSctcxy.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-DHHWT7Pe.js","./assets/kart-BoiGSYJD.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-CpEtF94J.js","./assets/labels-BcWsT5oI.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-B7aEvFYZ.js","./assets/loader-CvcNITmE.js","./assets/maliyet-B2MnVFLG.js","./assets/markalama-DQprWVyl.js","./assets/measure-CWknVino.js","./assets/montaj-dbxHHhOX.js","./assets/native-BUJ_QSf8.js","./assets/nest-DEtjzwjZ.js","./assets/paket-CG4aReP6.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-BtgM-BPI.js","./assets/prices-ui-icCZXrWI.js","./assets/project-DqThrD__.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-ZJL833WT.js","./assets/ru-D4G8NFyT.js","./assets/sablon-B8IXT7Xh.js","./assets/siparis-_igwZjcg.js","./assets/tani-BaRbXHU7.js","./assets/tani-DvDDXJxl.js","./assets/tani_karsilastir-BMDjZE6q.js","./assets/teklif-CyV6e_b5.js","./assets/teslim-BSYB2wyb.js","./assets/three.module-DdJfuIKW.js","./assets/tools-BBv2Sjf_.js","./assets/unfold-DBsWpySp.js","./assets/varyok-Bm--IzYs.js","./assets/view3d-DEuVebh4.js","./assets/viewdxf-CyYd0em_.js","./assets/viewer3d-OfMBL60h.js","./assets/viewpdf-G1EDDeC9.js","./assets/web-C5Mhn0CX.js","./assets/web-DROhw0CW.js","./assets/web-NBQupHwJ.js","./assets/web-lnjmNzY-.js","./assets/widget-wRT6mz71.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-CVXk2Wpf.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
