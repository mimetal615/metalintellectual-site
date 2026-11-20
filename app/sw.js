// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-b645f5d7b6";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-CVDI1cpK.js","./assets/acinim-BqOxgH6D.js","./assets/aciolcer-B5btAEfq.js","./assets/annotate-BkU6b07Y.js","./assets/ar-BGpsIoMd.js","./assets/atolye-BCWlUJ2t.js","./assets/base-BcP3KBx8.js","./assets/bend-DH5GkQwx.js","./assets/bukumlist-DSxfHT4Q.js","./assets/calc-DBGRQeiM.js","./assets/compare-BIJLLsVp.js","./assets/cost-CxzpbIK1.js","./assets/depo-DqChUCUW.js","./assets/dxf-daU5_Bbr.js","./assets/en-aFcZuRCa.js","./assets/esm-BLyZOeLf.js","./assets/esm-C9bv5lWe.js","./assets/esm-CEKAfa7r.js","./assets/esm-DPEkKO0S.js","./assets/excel-BUgjZzsH.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-grssM7jj.js","./assets/geom-Bscsapw2.js","./assets/home-C99FHe1v.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-CA635cP2.css","./assets/index-EnoL34_c.js","./assets/index.es-frs-P9YK.js","./assets/isler-DWRUCkrv.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-DhP9oRQw.js","./assets/jszip.min-C2y56AlE.js","./assets/kart-Y20Fj-gg.js","./assets/kontrol-B3COej1S.js","./assets/labels-BbSKLkYP.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-BmzqDbe2.js","./assets/markalama-BrQRikxm.js","./assets/measure-bu_d9hAD.js","./assets/montaj-BbXQbwBU.js","./assets/native-DTwjGngX.js","./assets/nest-MoREw3Ef.js","./assets/paket-poKh8c0e.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-QPAU1bOE.js","./assets/prices-ui-q_mMyKrm.js","./assets/project-CzmBQspI.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-D09Ouwfh.js","./assets/ru-CRW-O_mQ.js","./assets/sablon-DAIIDMQJ.js","./assets/siparis-DmpYLbz9.js","./assets/tani-DFNWcdM2.js","./assets/tani-GAaRtSx9.js","./assets/teklif-By32bpFf.js","./assets/teslim-CfvJCUJd.js","./assets/tools-CRAhey7N.js","./assets/unfold-C3uJA5KQ.js","./assets/view3d-BdBGExF8.js","./assets/viewdxf-DXq9v75P.js","./assets/viewer3d-CP1EIv8T.js","./assets/viewpdf-Dfz-N9bd.js","./assets/web-BdF_nc4D.js","./assets/web-CagQCoo6.js","./assets/web-DH3bUvKs.js","./assets/web-HnjZ4CJ0.js","./assets/widget-j-TMGbw6.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-wL34Ql8R.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
