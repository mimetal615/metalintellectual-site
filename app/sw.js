// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-b1ae408c11";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-vrhsejOc.js","./assets/acinim-C6VD7Bfg.js","./assets/aciolcer-CcC0vK9m.js","./assets/annotate-C415VmZK.js","./assets/ar-DDBJwOos.js","./assets/atolye-Btcdy9XQ.js","./assets/base-CW9GH5aW.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-D2-yHUmf.js","./assets/calc-DBGRQeiM.js","./assets/compare-BCYTJ_pP.js","./assets/cost-CK8HnoIr.js","./assets/depo-DFSSZ7O1.js","./assets/dxf-D5AsFMDu.js","./assets/en-BTHIQp4B.js","./assets/esm-CrQoAC4K.js","./assets/esm-DBIyQOJK.js","./assets/esm-Dgay3asL.js","./assets/esm-qnMDJkCB.js","./assets/excel-D0NkugHY.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-CmeaqBsf.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-BM3-JG52.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BOXEFCHo.css","./assets/index-BowARF4E.js","./assets/index.es-D55c-Vwm.js","./assets/isler-Btn6sBYQ.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-FCrBC3h5.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-B39BkWu5.js","./assets/kart-C9oTAY3q.js","./assets/kontrol-CYP0JZ7V.js","./assets/kontrol-CvZYGA91.js","./assets/labels-D02g9Vb2.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-D15NkrZT.js","./assets/loader-CvcNITmE.js","./assets/maliyet-f5d22qYa.js","./assets/markalama-w20vX0es.js","./assets/measure-CWknVino.js","./assets/montaj-D2dwy_x5.js","./assets/native-D7V3P6p1.js","./assets/nest-8OOTo_gG.js","./assets/paket-C-oSSLAU.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-Cy4Bpo98.js","./assets/prices-ui-DYXjUN5u.js","./assets/project--oZxyq7b.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-D9yRfMq5.js","./assets/ru-D42KvcyZ.js","./assets/sablon-B0vwZfNg.js","./assets/siparis-ruvDPDJ2.js","./assets/tani-BisrhJL6.js","./assets/tani-C-X4wHX_.js","./assets/tani_karsilastir-BELbR6HH.js","./assets/teklif-CLcPg-TM.js","./assets/teslim-sCU-Vrhb.js","./assets/three.module-DdJfuIKW.js","./assets/tools-zvt2PSJ0.js","./assets/unfold-DBsWpySp.js","./assets/view3d-CubcV-Iq.js","./assets/viewdxf-BL9IYixn.js","./assets/viewer3d-CXigJ4v1.js","./assets/viewpdf-wl-ndLTr.js","./assets/web-6oIA2VPX.js","./assets/web-BMfw_fe9.js","./assets/web-En6eFWce.js","./assets/web-roGA0hlh.js","./assets/widget-Csg-5bJm.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-BRaPwP5W.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
