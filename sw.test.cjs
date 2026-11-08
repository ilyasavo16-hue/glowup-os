const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const scope='https://example.test/glowup-os/';
const handlers={}, assets=new Map(), notifications=[], deleted=[];
const cache={
  async addAll(requests){for(const req of requests)assets.set(req.url,{cached:req.url});},
  async match(req){return assets.get(req.url||req.href);}
};
class Request{constructor(path,options){this.url=new URL(path,scope).href;this.cache=options.cache;}}
const ctx=vm.createContext({URL,Request,self:{
  registration:{scope,showNotification:(...args)=>{notifications.push(args);return Promise.resolve();}},
  location:{origin:'https://example.test'},clients:{claim:async()=>{}},addEventListener:(n,fn)=>{handlers[n]=fn;}
},caches:{open:async()=>cache,keys:async()=>['glowup:'+scope+':4.9.0','glowup:'+scope+':5.0.0','glowup:https://example.test/preview/:5.0.0'],delete:async k=>{deleted.push(k);}},fetch:()=>{throw Error('offline');}});
vm.runInContext(fs.readFileSync('site/sw.js','utf8'),ctx);
(async()=>{
  let pending;
  const waitUntil=p=>{pending=p;};
  handlers.install({waitUntil}); await pending;
  assert.equal(assets.size,9);
  handlers.activate({waitUntil}); await pending;
  assert.deepEqual(deleted,['glowup:'+scope+':4.9.0']);
  handlers.fetch({request:{method:'GET',mode:'navigate',url:scope},respondWith:waitUntil});
  assert.equal((await pending).cached,scope+'index.html');
  handlers.fetch({request:{method:'GET',mode:'cors',url:scope+'app.js'},respondWith:waitUntil});
  assert.equal((await pending).cached,scope+'app.js');
  handlers.push({data:{json:()=>({title:'QA',body:'Test'})},waitUntil});
  await pending;
  assert.equal(notifications[0][0],'QA');
  console.log('PASS: service worker cache installation, scope cleanup, offline page/assets and mock push display');
})().catch(error=>{console.error(error);process.exitCode=1;});
