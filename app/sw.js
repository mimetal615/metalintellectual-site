// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-04e4349ab8";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-CGnDdwME.js","./assets/acinim-BeNlNMyw.js","./assets/aciolcer-C_WAYljx.js","./assets/annotate-5LbnV8-M.js","./assets/ar-DsZ8dwI5.js","./assets/atolye-COra9PFf.js","./assets/base-C3btI_DC.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-C-VwfOjD.js","./assets/calc-DBGRQeiM.js","./assets/compare-CBZPpt0r.js","./assets/cost-BVcwhQTL.js","./assets/depo-BsmQyB3V.js","./assets/dxf-CWLxhee-.js","./assets/en-BpduISaq.js","./assets/esm-DArRiSj2.js","./assets/esm-DRF-gpUD.js","./assets/esm-IFT8jem6.js","./assets/esm-Sqe1J95l.js","./assets/excel-DPZPKmb2.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-CG2K6saR.js","./assets/geom-Bto3DNMP.js","./assets/home-CO27Lsj3.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-C8hu97J_.js","./assets/index-D5my9c9I.css","./assets/index.es-CCMB3zK8.js","./assets/isler-A5lFBHz-.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-CZ6ZtzwO.js","./assets/jszip.min-C2y56AlE.js","./assets/kart-C4B2YOKn.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-Ne4EZRTL.js","./assets/labels-D-fviPOr.js","./assets/libarchive-DMb2DkTG.js","./assets/loader-CvcNITmE.js","./assets/maliyet-BjB9Umo_.js","./assets/markalama-2KHpD8Cm.js","./assets/measure-CWknVino.js","./assets/montaj-CnWMX0pM.js","./assets/native-Cpfav_W0.js","./assets/nest-D0FIbtM3.js","./assets/paket-CDwuqoJS.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-B4Y42mDb.js","./assets/prices-ui-Cd7Nxrg7.js","./assets/project-5lplanAD.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-Dl_ATS81.js","./assets/ru-CDUZxL3C.js","./assets/sablon-CBI_2Sel.js","./assets/siparis-DX5o40sx.js","./assets/tani-C5kxzlc_.js","./assets/tani-CoYevMkp.js","./assets/tani_karsilastir-DOu-7rb6.js","./assets/teklif-BUKal7Y9.js","./assets/teslim-BeFkVGhv.js","./assets/three.module-DdJfuIKW.js","./assets/tools-f1aTjRA6.js","./assets/unfold-DBsWpySp.js","./assets/view3d-Bs_BHCJO.js","./assets/viewdxf-woLTUInI.js","./assets/viewer3d-CsfW7Y8s.js","./assets/viewpdf-vx7vsYrX.js","./assets/web-BHOjLu31.js","./assets/web-B_RFMx2B.js","./assets/web-CQQQfn7J.js","./assets/web-kZBGoFl4.js","./assets/widget-C7XprSfR.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-odPTWB4q.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
