// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-aaffd02cd9";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-B4BLwlxI.js","./assets/acinim-Da4qatgm.js","./assets/aciolcer-DkG64t8V.js","./assets/annotate-D6ipJkou.js","./assets/ar-CvUg3RC-.js","./assets/atolye-q7qURchx.js","./assets/base-6KWYyciv.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-BMpMX9nb.js","./assets/calc-DBGRQeiM.js","./assets/compare-DHMQD_Ch.js","./assets/cost-DykJN8it.js","./assets/depo--heOTC9y.js","./assets/dxf-DQuByBXO.js","./assets/en-Dh-SjnJi.js","./assets/esm-BAieCZrf.js","./assets/esm-BfXW5taD.js","./assets/esm-DTiuAvBH.js","./assets/esm-n5PMwnDJ.js","./assets/excel-Byz5mfVA.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-CgG71_d8.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-DMB69Rxb.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-B_ARQjau.css","./assets/index-DAoWyThl.js","./assets/index.es-CMEYHHpr.js","./assets/isler--PnYPlPN.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-D7U3AUcH.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-DuOzdSwj.js","./assets/kart-nEOzbWbk.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-Cbgcf43X.js","./assets/labels-Bc6k0Qd9.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-B7aEvFYZ.js","./assets/loader-CvcNITmE.js","./assets/maliyet-ZYOi9IPk.js","./assets/markalama-DbOgvBP_.js","./assets/measure-CWknVino.js","./assets/montaj-DLb5hAV1.js","./assets/native-DjbqPMMl.js","./assets/nest-CvBoUmPK.js","./assets/paket-BkDNe9vi.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-BrTFbXAe.js","./assets/prices-ui-DU9eCUWJ.js","./assets/project-CF4ZCsHn.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-Ba0NPj3W.js","./assets/ru-D4G8NFyT.js","./assets/sablon-BvT1GAbC.js","./assets/siparis-DW-oFrPC.js","./assets/tani-BSpPwFAP.js","./assets/tani-hDCm0C86.js","./assets/tani_karsilastir-DaENSDHX.js","./assets/teklif-DvnodATc.js","./assets/teslim-BdkDRu_E.js","./assets/three.module-DdJfuIKW.js","./assets/tools-Diip8mgC.js","./assets/unfold-DBsWpySp.js","./assets/varyok-BQ5-GDUA.js","./assets/view3d-MkKXd51e.js","./assets/viewdxf-CjBy301s.js","./assets/viewer3d-CSExwoQx.js","./assets/viewpdf-BdJSSnK_.js","./assets/web-BNNXJ_5x.js","./assets/web-DUtRwIgl.js","./assets/web-DtiqCeXv.js","./assets/web-S11Fnxqh.js","./assets/widget-BZpdd6D4.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-5DFPdMWB.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
