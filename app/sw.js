// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-3ebdd1765b";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-sHUWib03.js","./assets/acinim-DZhoY_kY.js","./assets/aciolcer-D_zrysaK.js","./assets/annotate-kNtg8NIs.js","./assets/ar-DDBJwOos.js","./assets/atolye-B4Yv9lNo.js","./assets/base-DRuhbQsE.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-DndAF8oW.js","./assets/calc-DBGRQeiM.js","./assets/compare-Bq-s5Ice.js","./assets/cost-9tJtJJc1.js","./assets/depo-DUtXtVgR.js","./assets/dxf-DNPTK2AC.js","./assets/en-BTHIQp4B.js","./assets/esm-B7g0x2kg.js","./assets/esm-C8QARFK3.js","./assets/esm-CMcu-4Y-.js","./assets/esm-PZt-dC4k.js","./assets/excel-CpHW7xms.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-DMAn4P34.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-CMwIaChy.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BOXEFCHo.css","./assets/index-CzDqiljE.js","./assets/index.es-DliPyjgT.js","./assets/isler-DbXkiFQi.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-CgAzeVcq.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-BxYlae8a.js","./assets/kart-D6Lw9ntW.js","./assets/kontrol-CS8Ls8Ot.js","./assets/kontrol-CYP0JZ7V.js","./assets/labels-B8lR_CgU.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-D15NkrZT.js","./assets/loader-CvcNITmE.js","./assets/maliyet-_5FY4nss.js","./assets/markalama-BpXABUOC.js","./assets/measure-CWknVino.js","./assets/montaj-BrfLsz6y.js","./assets/native-DcZgBQ0E.js","./assets/nest-BLLW5Y41.js","./assets/paket-D2DTyQ8u.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-w-xW6Vec.js","./assets/prices-ui-Bgb43D5t.js","./assets/project-Cl42eeRi.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-BSz50yX1.js","./assets/ru-D42KvcyZ.js","./assets/sablon-Blr30WMi.js","./assets/siparis-CiPnMH2p.js","./assets/tani-Br9Z6OlG.js","./assets/tani-C8yBYkP_.js","./assets/tani_karsilastir-BKvfaxgP.js","./assets/teklif-CfVOtY0V.js","./assets/teslim-C3XhRBuh.js","./assets/three.module-DdJfuIKW.js","./assets/tools-Ds_gK7hF.js","./assets/unfold-DBsWpySp.js","./assets/view3d-BTmO51k7.js","./assets/viewdxf-B1AWVoU-.js","./assets/viewer3d-C6A5qsvr.js","./assets/viewpdf-hWy5CKKY.js","./assets/web-BIcbBbBt.js","./assets/web-C0LPqkoL.js","./assets/web-CPXJ5via.js","./assets/web-DOhgZmRo.js","./assets/widget-tr6HocIS.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-xOLF27pf.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
