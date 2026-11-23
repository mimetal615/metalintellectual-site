// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-b61dd35ae2";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant--rEfDCoj.js","./assets/acinim-Duwrib-Y.js","./assets/aciolcer-DUVBmpft.js","./assets/annotate-B5CG3QZ5.js","./assets/ar-APpNa8NN.js","./assets/aruco-B-CLQdHV.js","./assets/atolye-B8NWXEEK.js","./assets/base-Dy6dRmLc.js","./assets/bend-yu2np6Cd.js","./assets/browser-DqB70OW0.js","./assets/bukumlist-BxXlbwP1.js","./assets/calc-DBGRQeiM.js","./assets/compare-CoGyNlrt.js","./assets/cost-Ceiv6DDJ.js","./assets/depo-BZkk0w6-.js","./assets/dxf-UbuCe-52.js","./assets/en-BNG6xaPk.js","./assets/esm-BGNO3BVm.js","./assets/esm-Dk8-jskK.js","./assets/esm-IED2Z8ER.js","./assets/esm-f23pIyQ-.js","./assets/excel-BwxbjyYT.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-beG_HGoY.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-CVwRgTrr.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-CpDOzJff.css","./assets/index-MuJ0jLpO.js","./assets/index.es-xf1x_P17.js","./assets/isler-Cbrm-obq.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-o-m0NBmx.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-BsaLLP4R.js","./assets/kart-pii6F-Ad.js","./assets/kartli-Bn1MlRun.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-DZQH32_0.js","./assets/labels-DbFggasp.js","./assets/libarchive-DMb2DkTG.js","./assets/lisans-vJqIG7_R.js","./assets/liste-DoEp_2I2.js","./assets/loader-CvcNITmE.js","./assets/maliyet-DWTs4y5d.js","./assets/markalama-yjZ3tfKz.js","./assets/measure-CWknVino.js","./assets/montaj-DfkPdL5n.js","./assets/native-CL3lU4N7.js","./assets/nest-CyJGqEa9.js","./assets/paket-BJwwTKo3.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-AirH-xRb.js","./assets/prices-ui-BrZvzjyv.js","./assets/project-DpJvCjPy.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-ByXsfGoB.js","./assets/ru-B34GjIjh.js","./assets/sablon-Dy5G0s_d.js","./assets/siparis-CkIef50C.js","./assets/tani-CrApFu47.js","./assets/tani-Iv4CZIai.js","./assets/tani_karsilastir-Bwm9IYuI.js","./assets/teklif-aTXIjbKB.js","./assets/teslim-BZGGzZe9.js","./assets/three.module-DdJfuIKW.js","./assets/tools-BAuHkNKW.js","./assets/unfold-DjOq-9rk.js","./assets/view3d-C6rk5j_X.js","./assets/viewdxf-VZCeC5UY.js","./assets/viewer3d-DylhT-QR.js","./assets/viewpdf-1A9H-7Yy.js","./assets/web-BEdDRex4.js","./assets/web-CCTHtwCe.js","./assets/web-CuHjUpGp.js","./assets/web-giknmat0.js","./assets/widget-Cw8xfNsv.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-DQiKjeI9.js","./img/kilavuz/1.jpg","./img/kilavuz/2.jpg","./img/kilavuz/3.jpg","./img/kilavuz/4.jpg","./img/kilavuz/5.jpg","./img/kilavuz/6.jpg","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
