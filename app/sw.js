// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-a020566ab1";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-DXD-_wMg.js","./assets/acinim-CBhkYbkI.js","./assets/aciolcer-DiZ_Pkwt.js","./assets/annotate-DnTC5boB.js","./assets/ar-Ds6ep6Qc.js","./assets/aruco-B-CLQdHV.js","./assets/atolye-CWLC8Y2o.js","./assets/base-CUpRD-Pv.js","./assets/bend-yu2np6Cd.js","./assets/browser-DqB70OW0.js","./assets/bukumlist-CZaXoqn4.js","./assets/calc-DBGRQeiM.js","./assets/compare-DvjEP15O.js","./assets/cost-Bb86a2SV.js","./assets/depo-Cs9BUod3.js","./assets/dxf-YDWAL7nN.js","./assets/en-B7VRepam.js","./assets/esm-BPUHV_mf.js","./assets/esm-CJYDI3aI.js","./assets/esm-D6-J5eLh.js","./assets/esm-eaBx5sYL.js","./assets/excel-CDK2GAR7.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-DcElVVh_.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-B7f6FLHW.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-CsE4hG8x.js","./assets/index-DUVHd43k.css","./assets/index.es-B6hJx8JI.js","./assets/isler-BWbkB10T.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-BmO187mq.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-CaTMUqxZ.js","./assets/kart-18TGz2Ct.js","./assets/kartli-BvgJ2DQO.js","./assets/kontrol-BjKJwZlg.js","./assets/kontrol-CYP0JZ7V.js","./assets/labels-BauicyFk.js","./assets/libarchive-DMb2DkTG.js","./assets/lisans-CoijjPSY.js","./assets/liste-DOoHkgVN.js","./assets/loader-CvcNITmE.js","./assets/maliyet-D7Z5nBYa.js","./assets/markalama-CwV4ytB_.js","./assets/measure-CWknVino.js","./assets/montaj-D2cH1ryN.js","./assets/native-Bl7KEZNm.js","./assets/nest-SxSkkTLQ.js","./assets/paket-s_neT7Iz.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-CDSin2mt.js","./assets/prices-ui-Dt4NS6B7.js","./assets/project-BfVIjR9K.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-CjFyMYzX.js","./assets/ru-DUeau9x8.js","./assets/sablon-HlgCTe64.js","./assets/siparis-CfQbQOZC.js","./assets/tani-CDHlOyi2.js","./assets/tani-zr9O1Txh.js","./assets/tani_karsilastir-D4gLHhlJ.js","./assets/teklif-BKMQk0XK.js","./assets/teslim-BUksXQ1n.js","./assets/three.module-DdJfuIKW.js","./assets/tools-C6fg6od8.js","./assets/unfold-DjOq-9rk.js","./assets/view3d-C_0qYWsJ.js","./assets/viewdxf-o8UFO3NN.js","./assets/viewer3d-DWhUYV29.js","./assets/viewpdf-Dq0IbqB8.js","./assets/web-BIfA-HAY.js","./assets/web-BO9dEI4N.js","./assets/web-DJuXztiL.js","./assets/web-DP512suz.js","./assets/widget-BXfWTGcH.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-wN_YECs5.js","./img/kilavuz/1.jpg","./img/kilavuz/2.jpg","./img/kilavuz/3.jpg","./img/kilavuz/4.jpg","./img/kilavuz/5.jpg","./img/kilavuz/6.jpg","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
