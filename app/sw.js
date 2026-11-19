// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mi-18e40702b9";
const FILES = ["./","./assets/_commonjs-dynamic-modules-TDtrdbi3.js","./assets/_commonjsHelpers-Cpj98o6Y.js","./assets/abkant-9T0lDCRZ.js","./assets/acinim-D_zJ0lye.js","./assets/aciolcer-DoHo_Bd1.js","./assets/annotate-DGgMoT0a.js","./assets/ar-CLIHBs_X.js","./assets/atolye-D6uuY8fj.js","./assets/base-DqodsOEr.js","./assets/bend-DH5GkQwx.js","./assets/bukumlist-vnxSOsS8.js","./assets/calc-DBGRQeiM.js","./assets/compare-Fr_ZN3jY.js","./assets/cost-BKyavakG.js","./assets/depo-APFdwIA7.js","./assets/dxf-Bzez7b4g.js","./assets/en-_aPXE42s.js","./assets/esm-BtOgwjVW.js","./assets/esm-CGTKSMrA.js","./assets/esm-afFdvvd5.js","./assets/esm-d9CYgDcP.js","./assets/excel-BYIkjsQw.js","./assets/exceljs.min-CGAG2Ebc.js","./assets/fotokontrol-CyyGfWN0.js","./assets/geom-Bscsapw2.js","./assets/home-C4tSWooj.js","./assets/html2canvas.esm-BfxBtG_O.js","./assets/index-B_n-Mnf8.css","./assets/index-pULLYmw6.js","./assets/index.es-DLUbECjP.js","./assets/isler-1CzgOVbc.js","./assets/jspdf.es.min-elOqQtlQ.js","./assets/jszip.min-C2y56AlE.js","./assets/kontrol-CiOp_b3w.js","./assets/labels-CtCg_OEu.js","./assets/libarchive-DMb2DkTG.js","./assets/maliyet-CsC_QGcB.js","./assets/markalama-DqRogt0g.js","./assets/measure-bu_d9hAD.js","./assets/montaj-COqyrd1T.js","./assets/native-uErk1Ltc.js","./assets/nest-Wn3VTwIG.js","./assets/paket-nV1QZ1a5.js","./assets/pdf-DzgcQj9I.js","./assets/pdfbukum-BAL7tlG5.js","./assets/pdfout-DwdxZx6S.js","./assets/prices-ui-DB5jgd2U.js","./assets/project-CfNWoJVD.js","./assets/purify.es-BwoZCkIS.js","./assets/qrscan-B3StLsMO.js","./assets/ru-BvW1DROV.js","./assets/sablon-X3fyPUDN.js","./assets/siparis-BXWqjfPo.js","./assets/teklif-nbG1hh2f.js","./assets/teslim-N7C5SG9S.js","./assets/tools-DduKPEEG.js","./assets/view3d-BYmIHwj-.js","./assets/viewdxf-3p_-g4Rr.js","./assets/viewer3d-BqZVqCky.js","./assets/viewpdf-CdJlajuy.js","./assets/web-BCOcDm9n.js","./assets/web-BeUMVplK.js","./assets/web-CARaKjDw.js","./assets/web-KECa1LiF.js","./assets/widget-hm-Gzs3M.js","./assets/worker-bundle-Dx5mKZOL.js","./assets/yerlesim-BOkev-DM.js","./img/mi-logo-koyu.png","./img/mi-logo.svg","./index.html","./libarchive/libarchive.wasm","./libarchive/worker-bundle.js","./manifest.webmanifest","./occt/license.occt-import-js.txt","./occt/license.occt.txt","./occt/occt-import-js.js","./occt/occt-import-js.wasm","./occt/split.js","./occt/worker.js","./pdfjs/pdf.worker.min.mjs","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
