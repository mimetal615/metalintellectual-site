// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-2e7b8494ba";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-CSr6j6vm.js","./assets/acinim-CW6SvGQ9.js","./assets/aciolcer-DLzd1GYE.js","./assets/annotate-DFW6fJJz.js","./assets/ar-CRETnocW.js","./assets/atolye-CWCcBsL0.js","./assets/base-C9gZCrR7.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-DANGAN5g.js","./assets/calc-DBGRQeiM.js","./assets/compare-B_aWjvd5.js","./assets/cost-f7B9b7pq.js","./assets/depo-BpLGAl1L.js","./assets/dxf-BXa1Ss1i.js","./assets/en-BfEgeIUw.js","./assets/esm-BI689azm.js","./assets/esm-C_NTlo5G.js","./assets/esm-CiE6q_os.js","./assets/esm-DnqGWkzm.js","./assets/excel-XMCvazty.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-DIyjZkLW.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-B7bIt2S1.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-Cuw4Jos5.css","./assets/index-DElt1V8x.js","./assets/index.es-BwXpeHZi.js","./assets/isler-DsaS9b__.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-BShqaFPF.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-mMOnOZOx.js","./assets/kart-DmxgbFOw.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-Cj9NaNEq.js","./assets/labels-D3SiyZGt.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-B7aEvFYZ.js","./assets/loader-CvcNITmE.js","./assets/maliyet-Cepav6-4.js","./assets/markalama-CxOGsYoh.js","./assets/measure-CWknVino.js","./assets/montaj-C2RP69sL.js","./assets/native-Dzvq7Yx3.js","./assets/nest-BfrgiAGM.js","./assets/paket-DGl9KuOd.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-CcE9a7xG.js","./assets/prices-ui-v9eIpC2p.js","./assets/project-BaObR8SP.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-DvNvYXgY.js","./assets/ru-M4qHaHHe.js","./assets/sablon-4H9Yt0FT.js","./assets/siparis-YNB1ScZk.js","./assets/tani-C-0-skXf.js","./assets/tani-D3V6hgql.js","./assets/tani_karsilastir-DOOAftuY.js","./assets/teklif-BjvjvZQ3.js","./assets/teslim-BhHDIz34.js","./assets/three.module-DdJfuIKW.js","./assets/tools-DOFzU6r4.js","./assets/unfold-DBsWpySp.js","./assets/view3d-EZQu9GbI.js","./assets/viewdxf-BwUpQs1e.js","./assets/viewer3d-EwxKkXHa.js","./assets/viewpdf-6r3QEfPY.js","./assets/web-B-pg8weN.js","./assets/web-BTM0tG8H.js","./assets/web-C3UIxEFa.js","./assets/web-DKnVdZME.js","./assets/widget-C4q1pTvw.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-BUJMTZHJ.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
