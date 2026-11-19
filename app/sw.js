// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-cccb436466";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-zMrP-Eq3.js","./assets/acinim-BPjz8Gsf.js","./assets/annotate-D6Y9KEU6.js","./assets/ar-Cvsor62d.js","./assets/base-PjS618dL.js","./assets/bend-DH5GkQwx.js","./assets/calc-colOoQ_K.js","./assets/compare-B3qJHDy_.js","./assets/depo-BXIj-b-6.js","./assets/dxf-BRfNTgZo.js","./assets/en-DN8jWb9E.js","./assets/esm-AJsou2dt.js","./assets/esm-BvpAWzmt.js","./assets/esm-D81bs4_7.js","./assets/esm-DWrAWE4e.js","./assets/excel-Bo6i845C.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-TSdJYZRa.js","./assets/geom-Bscsapw2.js","./assets/home-Bw0Qs-SS.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BTq3eWvB.css","./assets/index-CZFMLMM5.js","./assets/index.es-BAihMc-E.js","./assets/isler-B3mK8X2i.js","./assets/jspdf.es.min-CgaS0f25.js","./assets/jszip.min-C2y56AlE.js","./assets/kontrol-Cx4jciPm.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-CkqA9bua.js","./assets/measure-bu_d9hAD.js","./assets/montaj-VkHK37mq.js","./assets/native-tMF0u1MM.js","./assets/paket-Bg7guphZ.js","./assets/pdf-BFRrXs96.js","./assets/pdfout-vG7plms0.js","./assets/prices-ui-DGYrmvIa.js","./assets/project-D4So2YUg.js","./assets/purify.es-BwoZCkIS.js","./assets/ru-DuJdI2pT.js","./assets/teklif-C_9exA4D.js","./assets/tools-BF30KPPG.js","./assets/view3d-C1q1Fcdx.js","./assets/viewdxf-Ltz0GTHT.js","./assets/viewer3d-vUqgd7PS.js","./assets/viewpdf-DWunoKau.js","./assets/web-ByaalTHd.js","./assets/web-CwZzyzjk.js","./assets/web-Do2gy7n1.js","./assets/web-kYxiR37_.js","./assets/widget-BwIzb_4x.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-DtZbDFLh.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
