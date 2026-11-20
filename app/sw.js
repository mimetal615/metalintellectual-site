// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-d2d09ef18a";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-C6pp5cdf.js","./assets/acinim-DzYyi95p.js","./assets/aciolcer-Ce5Eq8fj.js","./assets/annotate-DHESyE1H.js","./assets/ar-C55-tmNB.js","./assets/atolye-C6lLyINC.js","./assets/base-Bt0XHEVX.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-DCBnDSNc.js","./assets/calc-DBGRQeiM.js","./assets/compare-BMsbOP47.js","./assets/cost-C2-7bPBg.js","./assets/depo-CfnbMlEH.js","./assets/dxf-BfGee5Td.js","./assets/en-B-q0OBtH.js","./assets/esm-CKJWRwQY.js","./assets/esm-Dbm9CPSR.js","./assets/esm-a6hHOZ35.js","./assets/esm-wJRlLyp_.js","./assets/excel-Cui_j7Km.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-CLu7464Z.js","./assets/geom-Bto3DNMP.js","./assets/home-BWzrS3Ur.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-CLBJjh3j.css","./assets/index-OPGm2C_Z.js","./assets/index.es-CoxOdao6.js","./assets/isler-C06mI1Mf.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-BNjm9gPc.js","./assets/jszip.min-C2y56AlE.js","./assets/kart-DJpqxECh.js","./assets/kontrol-CYP0JZ7V.js","./assets/labels-CbDllLRG.js","./assets/libarchive-DMb2DkTG.js","./assets/loader-CvcNITmE.js","./assets/maliyet-DWezV4RK.js","./assets/markalama-BYrKu3gw.js","./assets/measure-CWknVino.js","./assets/montaj-CMxrGyal.js","./assets/native-BLAVYZy_.js","./assets/nest-BT8aYdPV.js","./assets/paket-BwD92mIL.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-CUOVSix_.js","./assets/prices-ui-Vs8I9Pgw.js","./assets/project-BJPYehG4.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-DZzHMaKj.js","./assets/ru-rVWdZb2O.js","./assets/sablon-CdBzwvgI.js","./assets/siparis-3EulpV28.js","./assets/tani-CJ7zpJo8.js","./assets/tani-CWr8FWOL.js","./assets/tani_karsilastir-BEdwJw0h.js","./assets/teklif-CUz_i6nc.js","./assets/teslim-DyNrui3o.js","./assets/three.module-DdJfuIKW.js","./assets/tools-D1fRAoic.js","./assets/unfold-DBsWpySp.js","./assets/view3d-kzZcd5Fe.js","./assets/viewdxf-COX674tf.js","./assets/viewer3d-BFn5fNJZ.js","./assets/viewpdf-D3bnw5mc.js","./assets/web-BQBB3o4I.js","./assets/web-BijPw2lx.js","./assets/web-DHOxXQBX.js","./assets/web-NhEG80aI.js","./assets/widget-UkEF9lnK.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-Cevr9hjY.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
