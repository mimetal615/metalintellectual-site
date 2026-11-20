// Çevrimdışı çalışma (iPhone / tarayıcı): uygulama dosyaları ilk açılışta önbelleğe alınır.
const V = "mucit-59c2f0aca1";
const FILES = ["./","./assets/atolye-BbO3JkOs.js","./assets/ciz-B8CV_D0B.js","./assets/defter-IUfOhfJD.js","./assets/disli-CND1RBYs.js","./assets/dist-CXATIzgh.js","./assets/dukkan-Cgl8cLwa.js","./assets/esm-Cb0SV2xo.js","./assets/esm-D8cMDDsD.js","./assets/fredoka-hebrew-400-normal-CT3eDt6U.woff2","./assets/fredoka-hebrew-400-normal-S03uWvSu.woff","./assets/fredoka-hebrew-600-normal-BiVDObXj.woff","./assets/fredoka-hebrew-600-normal-CTBxhdlE.woff2","./assets/fredoka-latin-400-normal-17JuUzdy.woff2","./assets/fredoka-latin-400-normal-DbXSrOeS.woff","./assets/fredoka-latin-600-normal-C4zohCW5.woff2","./assets/fredoka-latin-600-normal-CcrEjrB4.woff","./assets/fredoka-latin-ext-400-normal-Cc3DdpKI.woff","./assets/fredoka-latin-ext-400-normal-h-azoVru.woff2","./assets/fredoka-latin-ext-600-normal-BExgZzUO.woff","./assets/fredoka-latin-ext-600-normal-GoyidTAB.woff2","./assets/hepsi-gwnKIHaZ.js","./assets/index-BosZIVWi.css","./assets/index-DbtNXC1L.js","./assets/kaldirac-o-6b_mJl.js","./assets/kapali-Q05vt9Ea.js","./assets/kopru-BASSajgb.js","./assets/makara-DVw1I922.js","./assets/mektup-CvshXpWT.js","./assets/oyun-Npimmsnr.js","./assets/profil-DcKgIa0m.js","./assets/rng-JhBcGIUO.js","./assets/ui-tPWqEuQW.js","./assets/veli-BplbV0bt.js","./assets/web-CVe9HaC1.js","./assets/web-DcyKXQy1.js","./img/mi-logo-koyu.png","./index.html","./manifest.webmanifest","./pwa/icon-180.png","./pwa/icon-192.png","./pwa/icon-512.png"];
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
