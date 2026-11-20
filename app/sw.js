// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-cac0ab3da6";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-D3Jk2Icy.js","./assets/acinim-BdeOno-w.js","./assets/aciolcer-D73op_VQ.js","./assets/annotate-4v1kgAbG.js","./assets/ar-CLIHBs_X.js","./assets/atolye-EDPX0lwY.js","./assets/base-Ql_UOQxV.js","./assets/bend-DH5GkQwx.js","./assets/bukumlist-D0JGHH_a.js","./assets/calc-DBGRQeiM.js","./assets/compare-D47oV34-.js","./assets/cost-BeRnciIv.js","./assets/depo-AqjfVqcG.js","./assets/dxf-BLPA5-cu.js","./assets/en-_aPXE42s.js","./assets/esm-BOssBERt.js","./assets/esm-CReY95E7.js","./assets/esm-DV3lqmex.js","./assets/esm-mQSwVK6T.js","./assets/excel-C-PuNnAr.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-Bwo5ZQeR.js","./assets/geom-Bscsapw2.js","./assets/home-BvtoW99c.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-BrSH_pVT.js","./assets/index-BunwVrus.css","./assets/index.es-CPU7vE-9.js","./assets/isler-CD9gg8LD.js","./assets/jspdf.es.min-abEn9vao.js","./assets/jszip.min-C2y56AlE.js","./assets/kontrol-BYX6hZsE.js","./assets/labels-Bjprqhb3.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-uaTq0gRn.js","./assets/markalama-D0DQsuCl.js","./assets/measure-bu_d9hAD.js","./assets/montaj-TzgFBhU0.js","./assets/native-DOVgSXlm.js","./assets/nest-CiSvz9uQ.js","./assets/paket-D8YvJx3m.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-tj8XsPM3.js","./assets/prices-ui-JOL5EMZ_.js","./assets/project-CNtwikda.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-CYO0gln2.js","./assets/ru-BvW1DROV.js","./assets/sablon-r2T9hGky.js","./assets/siparis-BlVAJXR6.js","./assets/teklif-Dz1G0aGG.js","./assets/teslim-B9IF2pOE.js","./assets/tools-Bx7nxNnP.js","./assets/view3d-DAPQm3KH.js","./assets/viewdxf-BUqd29ZP.js","./assets/viewer3d-CkryufZG.js","./assets/viewpdf-_JkMMt2_.js","./assets/web-7CkI4Ml3.js","./assets/web-DBQO8EGc.js","./assets/web-Dg-AA4Gc.js","./assets/web-DuuCNnwc.js","./assets/widget-CzFhZjdR.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-DO6k_zVM.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
