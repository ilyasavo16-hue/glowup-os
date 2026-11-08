'use strict';

const scope = self.registration.scope;
const CACHE_PREFIX = 'glowup:'+scope+':';
const CACHE = CACHE_PREFIX+'5.0.0';
const ASSETS = [
  './index.html','./style.css','./data.js','./model.js','./app.js',
  './manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'
];
const assetUrls = new Set(ASSETS.map(path=>new URL(path,scope).href));

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>
    cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))
  ));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET' || new URL(request.url).origin!==self.location.origin) return;
  const url=new URL(request.url);
  const root=new URL(scope);
  if(request.mode==='navigate' && (url.pathname===root.pathname || url.pathname===root.pathname+'index.html')){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      return await cache.match(new URL('./index.html',scope)) || fetch(request);
    })());
  } else if(assetUrls.has(request.url)){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      return await cache.match(request) || fetch(request);
    })());
  }
});
self.addEventListener('push',event=>{
  let data={};
  try{ data=event.data?.json()||{}; }catch{}
  const title=typeof data.title==='string'?data.title.slice(0,100):'GlowUp OS';
  const body=typeof data.body==='string'?data.body.slice(0,240):'Запланированное напоминание';
  event.waitUntil(self.registration.showNotification(title,{body,icon:'./icon-192.png',tag:typeof data.tag==='string'?data.tag.slice(0,80):'glowup-reminder'}));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const current=windows.find(client=>client.url.startsWith(scope));
    if(current) return current.focus();
    return self.clients.openWindow(scope);
  })());
});
