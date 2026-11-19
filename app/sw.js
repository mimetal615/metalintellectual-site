// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-113b76a78c";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-sdgh9owG.js","./assets/acinim-CCYmHBLW.js","./assets/annotate-BS2ozE1e.js","./assets/ar-okd_sL5L.js","./assets/base-DHU857Dc.js","./assets/bend-DH5GkQwx.js","./assets/calc-colOoQ_K.js","./assets/compare-DLfGDwCa.js","./assets/depo-Cd7V8OZt.js","./assets/dxf-CnqXlS8y.js","./assets/en-gf62CJvb.js","./assets/esm-25z66qPc.js","./assets/esm-CrVBtT2Z.js","./assets/esm-DJc2IZN2.js","./assets/esm-Dmt-7GDt.js","./assets/excel-B73EPKWo.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-BUUnXlBD.js","./assets/geom-Bscsapw2.js","./assets/home-D6ajRiiS.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BTq3eWvB.css","./assets/index-CML21c9V.js","./assets/index.es-A5BipVLC.js","./assets/isler-l3va-fBg.js","./assets/jspdf.es.min-lbE2xW9m.js","./assets/jszip.min-C2y56AlE.js","./assets/kontrol-BJIKbSkd.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-B_UKPiCc.js","./assets/measure-bu_d9hAD.js","./assets/montaj-DQFF622Q.js","./assets/native-D0s8AbJy.js","./assets/pdf-BFRrXs96.js","./assets/pdfout-C1PewqTp.js","./assets/prices-ui-BqqMCdyh.js","./assets/project-Czy4ZRgV.js","./assets/purify.es-BwoZCkIS.js","./assets/ru-Eu5ZhSFg.js","./assets/tools-DZAGfoSZ.js","./assets/view3d-CCBuaWyb.js","./assets/viewdxf-nNwwKCS_.js","./assets/viewer3d-DVQnEZJR.js","./assets/viewpdf-C-JpK7ZD.js","./assets/web-Bp9B4TXC.js","./assets/web-CdKr28v7.js","./assets/web-CnznXLIW.js","./assets/web-OGWWSwGY.js","./assets/widget-Ckl_7gRM.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-DDkXFWyC.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
