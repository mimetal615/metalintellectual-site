// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-84e601b0cc";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-CmECA44w.js","./assets/acinim-BvVCd129.js","./assets/annotate-CYIYR4sO.js","./assets/ar-CtMBmeMd.js","./assets/base-DgllJ3cX.js","./assets/bend-DH5GkQwx.js","./assets/bukumlist-7uDUmCfr.js","./assets/calc-DBGRQeiM.js","./assets/compare-BFxfCQml.js","./assets/depo-Bzurhjjl.js","./assets/dxf-ClpK_1O8.js","./assets/en-v9FKc0nE.js","./assets/esm-BZsev-hJ.js","./assets/esm-CjiJcI0g.js","./assets/esm-D7grwggR.js","./assets/esm-Up6ehxhn.js","./assets/excel-BspXrFSu.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-D9kKzhen.js","./assets/geom-Bscsapw2.js","./assets/home-DwnitMQs.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-Bn_1yopf.css","./assets/index-CqojdDgf.js","./assets/index.es-DIFczkzt.js","./assets/isler-GVu0oH3r.js","./assets/jspdf.es.min-BbyzmQ5g.js","./assets/jszip.min-C2y56AlE.js","./assets/kontrol-Dxs8ZL6i.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-DJH5ZDqC.js","./assets/measure-bu_d9hAD.js","./assets/montaj-DBQZZclu.js","./assets/native-CMLoUs3c.js","./assets/paket-D1Q-72iy.js","./assets/pdf-BFRrXs96.js","./assets/pdfout-C9t-NiCm.js","./assets/prices-ui-DxrJt_u8.js","./assets/project-D2pH08LR.js","./assets/purify.es-BwoZCkIS.js","./assets/ru-y0U3q8pi.js","./assets/teklif-BLw6aQI5.js","./assets/tools-DztDFN1Z.js","./assets/view3d-Cktpy6iT.js","./assets/viewdxf-DoovjkYt.js","./assets/viewer3d-DEeFXAcw.js","./assets/viewpdf-CFdHuvKo.js","./assets/web-7vFCIteo.js","./assets/web-BFhoOhKz.js","./assets/web-BWpBIkTW.js","./assets/web-FKT4f0Yq.js","./assets/widget-C0rDgkty.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-BMvXGSOZ.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
