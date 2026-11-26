/* VIEWFINITY lightweight offline fallback. Only the offline document is cached. */
const VF_OFFLINE_CACHE='viewfinity-offline-v1';
const VF_OFFLINE_PATH='/offline.html';

self.addEventListener('install',event=>{
 event.waitUntil(
  caches.open(VF_OFFLINE_CACHE)
   .then(cache=>cache.add(new Request(VF_OFFLINE_PATH,{cache:'reload'})))
   .then(()=>self.skipWaiting())
 );
});

self.addEventListener('activate',event=>{
 event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys
   .filter(key=>key.startsWith('viewfinity-offline-')&&key!==VF_OFFLINE_CACHE)
   .map(key=>caches.delete(key))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.mode!=='navigate'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  try{return await fetch(request)}
  catch{
   const fallback=await caches.match(VF_OFFLINE_PATH,{cacheName:VF_OFFLINE_CACHE});
   return fallback||Response.error();
  }
 })());
});
