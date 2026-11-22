// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-ae086e5373";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-BOmv3Vbf.js","./assets/acinim-D8KJV1aw.js","./assets/aciolcer-B_MAz94d.js","./assets/annotate-L-DOwXJt.js","./assets/ar-9MmmS5pp.js","./assets/atolye-D09WYLLy.js","./assets/base-Dg_9IlmF.js","./assets/bend-yu2np6Cd.js","./assets/bukumlist-26VAMG-4.js","./assets/calc-DBGRQeiM.js","./assets/compare-DeUn8WBG.js","./assets/cost-B29uRi3_.js","./assets/depo-DZll6JOY.js","./assets/dxf-Cv1cBHb-.js","./assets/en-BtAdFja3.js","./assets/esm-COHi8_cr.js","./assets/esm-JwXGwPoo.js","./assets/esm-KeWTwcbA.js","./assets/esm-o5kvmJ-0.js","./assets/excel-BJiw5HKL.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-DpBb6V8U.js","./assets/geom-Bto3DNMP.js","./assets/goruntu-IzC98TsU.js","./assets/home-CmrIQGOH.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BOXEFCHo.css","./assets/index-DRLJ_n7v.js","./assets/index.es-jpdQXhHA.js","./assets/isler-D5qTjjQW.js","./assets/jsQR-3f3QAeau.js","./assets/jspdf.es.min-BzNLCiUU.js","./assets/jszip.min-C2y56AlE.js","./assets/kamera_kontrol-CUAZDhLr.js","./assets/kart-CMTV4Wvc.js","./assets/kontrol-Bu6FhXgP.js","./assets/kontrol-CYP0JZ7V.js","./assets/labels-D407Wftj.js","./assets/libarchive-DMb2DkTG.js","./assets/liste-D15NkrZT.js","./assets/loader-CvcNITmE.js","./assets/maliyet-C1WVOSYn.js","./assets/markalama-IMPmkS9J.js","./assets/measure-CWknVino.js","./assets/montaj-BMM4Se9m.js","./assets/native-CnBvOF4x.js","./assets/nest-XbiC2pg1.js","./assets/paket-DWCqeyfx.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-CEol_AIH.js","./assets/prices-ui-BdWX8J7f.js","./assets/project-BmHH07x8.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-DJbs-kFG.js","./assets/ru-QkSM0htl.js","./assets/sablon-CUZLHvG5.js","./assets/siparis-DdQUm57T.js","./assets/tani-CHiX3mWu.js","./assets/tani-DTJqc8q8.js","./assets/tani_karsilastir-Ci2Rt5OC.js","./assets/teklif-cBVBfyNS.js","./assets/teslim-Bsh57qzc.js","./assets/three.module-DdJfuIKW.js","./assets/tools-CFQJgxgJ.js","./assets/unfold-DBsWpySp.js","./assets/view3d-BS1Vk9dS.js","./assets/viewdxf-D2lkZDLQ.js","./assets/viewer3d-l0EMLIZ7.js","./assets/viewpdf-BZDPen9Q.js","./assets/web-CYgV4f7M.js","./assets/web-D8d5nRXO.js","./assets/web-DojYt-1h.js","./assets/web-jzkJVvBa.js","./assets/widget-XxuzfRTU.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-BgbKijFs.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
