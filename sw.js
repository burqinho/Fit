/* PersonalHomeTrainer — GIF önbellek Service Worker'ı
   static.exercisedb.dev GIF'lerini opak yanıt olarak önbelleğe alır;
   çevrimdışıyken <img> istekleri buradan beslenir. */
const CACHE = "pht-gifs-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = e.request.url;
  if(!/static\.exercisedb\.dev\/media\/.+\.gif/i.test(u)) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(u);
    if(hit) return hit;
    let resp = null;
    try{ resp = await fetch(e.request.url, { mode:"no-cors" }) }catch(_){}
    if(resp){
      try{ await cache.put(u, resp.clone()) }catch(_){}
      return resp;
    }
    return new Response("", { status: 504 });
  })());
});
