// offline support: the app shell is cached on install; fonts and the PDF library are cached as they load
const V="eva-lesson-v11", SHELL=["./","index.html","template-green3.jpg","template-purple2.jpg","thumb-green3.jpg","thumb-purple2.jpg","template-teal.jpg","thumb-teal.jpg","template.jpg","template-purple.jpg","template-sci1.jpg","template-sci2.jpg","template-arabic.jpg","template-colorful.jpg","thumb-green.jpg","thumb-purple.jpg","thumb-sci1.jpg","thumb-sci2.jpg","thumb-arabic.jpg","thumb-colorful.jpg","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin&&u.pathname.endsWith("/users.json")) return; // the sign-in list always comes from the network
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(e.request);
    const net=fetch(e.request).then(r=>{ if(r&&(r.ok||r.type==="opaque")) c.put(e.request,r.clone()); return r; }).catch(()=>hit);
    return hit||net;
  }));
});
