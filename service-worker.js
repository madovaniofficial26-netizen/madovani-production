const CACHE='madovani-production-v5';
const ASSETS=['./manifest-v5.webmanifest','./Screenshot_20261008_105943_Gallery.jpg?v=5'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match('./')));
    return;
  }
  event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)));
});