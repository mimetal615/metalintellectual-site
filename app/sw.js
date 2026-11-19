// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-95c78b4b55";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-DjO3RMZA.js","./assets/acinim-DPeGO1JL.js","./assets/aciolcer-CtnW946o.js","./assets/annotate-DlDGwWgV.js","./assets/ar-VO8O00iB.js","./assets/base-BbErefjR.js","./assets/bend-DH5GkQwx.js","./assets/bukumlist-ROPUqbVg.js","./assets/calc-DBGRQeiM.js","./assets/compare-BlOVJKHW.js","./assets/cost-CPks5Xm0.js","./assets/depo-Dgh9fOVQ.js","./assets/dxf-BotmQQOv.js","./assets/en-CVZCbZjp.js","./assets/esm-BZxZHx-m.js","./assets/esm-C9NrsbMg.js","./assets/esm-CcAp0Td6.js","./assets/esm-DzM_Jypo.js","./assets/excel-Tz_sAh7Z.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-B5RUzFBN.js","./assets/geom-Bscsapw2.js","./assets/home-DzPPdGin.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-Bn_1yopf.css","./assets/index-D8on9lC2.js","./assets/index.es-6YmTHN9l.js","./assets/isler-DWujTqdj.js","./assets/jspdf.es.min-DyDngSX6.js","./assets/jszip.min-C2y56AlE.js","./assets/kontrol-TvMGTbks.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-BLWPrLET.js","./assets/measure-bu_d9hAD.js","./assets/montaj-CdCbgalu.js","./assets/native-DgowX4ew.js","./assets/paket-2APirRGX.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-CVrMbpKW.js","./assets/prices-ui-B-GIHxyo.js","./assets/project-DBArR8_W.js","./assets/purify.es-BwoZCkIS.js","./assets/ru-D91Br2G8.js","./assets/sablon-B9NtpMoH.js","./assets/teklif-DvIML6gL.js","./assets/tools-C7BVGkdJ.js","./assets/view3d-COFQCpmK.js","./assets/viewdxf-BzSge9YG.js","./assets/viewer3d-DETv4aPx.js","./assets/viewpdf-C6JPggV5.js","./assets/web-BYqekM8h.js","./assets/web-BvaZdp8V.js","./assets/web-Cph4Z0xv.js","./assets/web-DqgM1ViX.js","./assets/widget-BS3c9uC_.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-D9U9NA-4.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
