/* VIEWFINITY branded offline fallback (only the offline page and official logo are cached). */
const VF_OFFLINE_CACHE='viewfinity-offline-v3';
const VF_OFFLINE_PATH='/offline.html';
const VF_OFFLINE_LOGO='/assets/media/c0b84cfe6d6fdbcf67.png';

self.addEventListener('install',event=>{
 event.waitUntil(
  caches.open(VF_OFFLINE_CACHE)
   .then(cache=>cache.addAll([new Request(VF_OFFLINE_PATH,{cache:'reload'}),new Request(VF_OFFLINE_LOGO,{cache:'reload'})]))
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
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname===VF_OFFLINE_LOGO){
  event.respondWith(caches.match(VF_OFFLINE_LOGO,{cacheName:VF_OFFLINE_CACHE}).then(cached=>cached||fetch(request)));
  return;
 }
 if(request.mode!=='navigate')return;
 event.respondWith((async()=>{
  try{return await fetch(request)}
  catch{
   const fallback=await caches.match(VF_OFFLINE_PATH,{cacheName:VF_OFFLINE_CACHE});
   return fallback||Response.error();
  }
 })());
});
