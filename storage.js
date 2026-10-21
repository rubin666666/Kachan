// A synchronous working cache backed by atomic IndexedDB transactions.
// Existing modules use the same getItem/setItem interface after boot hydration.
const kachanStorage={cache:new Map(),dirty:new Map(),db:null,revision:0,pending:null,error:null,external:false,mode:'loading',channel:null,
 bumpFallbackRevision(){this.revision++;try{localStorage.setItem('kachan-fallback-revision',String(this.revision));}catch{}},
 owns:key=>key.startsWith('devspace-')||key==='kachan-cloud-config',
 getItem(key){return this.cache.get(key)??null;},
 setItem(key,value){if(this.external)throw Error('Another tab updated the data. Reload first.');value=String(value);if(this.cache.get(key)===value)return;if(!this.db){this.cache.set(key,value);try{localStorage.setItem(key,value);this.bumpFallbackRevision();this.dirty.delete(key);if(!this.dirty.size)this.error=null;}catch(error){this.dirty.set(key,value);this.error=error;throw error;}finally{this.signal();}return;}this.cache.set(key,value);this.dirty.set(key,value);this.schedule();},
 removeItem(key){if(this.external)throw Error('Another tab updated the data. Reload first.');if(!this.cache.has(key))return;this.cache.delete(key);if(!this.db){try{localStorage.removeItem(key);this.bumpFallbackRevision();this.dirty.delete(key);if(!this.dirty.size)this.error=null;}catch(error){this.dirty.set(key,null);this.error=error;throw error;}finally{this.signal();}return;}this.dirty.set(key,null);this.schedule();},
 signal(){window.dispatchEvent(new Event('kachan-storage-status'));},
 schedule(){this.error=null;this.signal();if(!this.scheduled){this.scheduled=true;queueMicrotask(()=>{this.scheduled=false;this.flush().catch(()=>{});});}},
 async init(){
  const legacy=new Map();try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(this.owns(key))legacy.set(key,localStorage.getItem(key));}}catch{}
  try{this.db=await new Promise((resolve,reject)=>{const req=indexedDB.open('kachan-local',1);req.onupgradeneeded=()=>req.result.createObjectStore('records');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Storage blocked'));});
   const loaded=await new Promise((resolve,reject)=>{const tx=this.db.transaction('records','readonly'),store=tx.objectStore('records'),keys=store.getAllKeys(),values=store.getAll();tx.oncomplete=()=>resolve(new Map(keys.result.map((k,i)=>[k,values.result[i]])));tx.onabort=()=>reject(tx.error);});
   this.revision=loaded.get('__revision')||0;loaded.delete('__revision');this.cache=loaded;this.mode='indexeddb';
   if(this.revision===0){this.cache=new Map(legacy);this.dirty=new Map(legacy);this.dirty.set('__migration','1');await this.flush();await this.resetLegacy();}
   try{localStorage.setItem('kachan-idb-migrated','1');}catch{}
   this.db.onversionchange=()=>{this.db.close();this.external=true;this.signal();};
   if('BroadcastChannel'in window){this.channel=new BroadcastChannel('kachan-storage');this.channel.onmessage=e=>{if(e.data?.revision>this.revision){this.external=true;this.signal();}};}
  }catch(error){if(this.db)this.db.close();this.db=null;let migrated=false;try{migrated=localStorage.getItem('kachan-idb-migrated')==='1';}catch{}if(migrated)throw Error('Local database unavailable; data has not been replaced.');this.cache=legacy;this.dirty.clear();this.mode='localstorage';try{const saved=Number(localStorage.getItem('kachan-fallback-revision'));this.revision=Number.isSafeInteger(saved)&&saved>=0?saved:0;}catch{}this.error=null;}
  this.signal();
 },
 async flush(){
  if(this.external)throw Error('Storage conflict');
  if(!this.db){const retrying=this.dirty.size>0;try{for(const [key,value]of this.dirty){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);this.dirty.delete(key);}if(retrying)this.bumpFallbackRevision();this.error=null;}catch(error){this.error=error;throw error;}finally{this.signal();}return;}if(this.pending){await this.pending;if(this.dirty.size)return this.flush();return;}if(!this.dirty.size)return;if(this.external)throw Error('Storage conflict');
  const batch=new Map(this.dirty),expected=this.revision;
  this.pending=new Promise((resolve,reject)=>{let conflict=false;const tx=this.db.transaction('records','readwrite',{durability:'strict'}),store=tx.objectStore('records'),req=store.get('__revision');
   req.onsuccess=()=>{if((req.result||0)!==expected){conflict=true;tx.abort();return;}for(const [key,value] of batch){if(value===null)store.delete(key);else store.put(value,key);}store.put(expected+1,'__revision');};
   tx.oncomplete=()=>{this.revision=expected+1;for(const [key,value] of batch)if(this.dirty.get(key)===value)this.dirty.delete(key);this.error=null;this.channel?.postMessage({revision:this.revision});resolve();};
   tx.onabort=()=>{if(conflict)this.external=true;this.error=tx.error||Error(conflict?'Storage conflict':'Storage write failed');reject(this.error);};
  });
  this.signal();try{await this.pending;}catch(error){this.error=error;throw error;}finally{this.pending=null;this.signal();}if(this.dirty.size)return this.flush();
 },
 async resetLegacy(){try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(this.owns(key))localStorage.removeItem(key);}}catch{}},
 async estimate(){return navigator.storage?.estimate?await navigator.storage.estimate():null;}
};
window.addEventListener('beforeunload',event=>{if(kachanStorage.dirty.size||kachanStorage.error){event.preventDefault();event.returnValue='';}});

window.addEventListener('storage',event=>{if(kachanStorage.mode==='localstorage'&&event.key==='kachan-fallback-revision'&&Number(event.newValue)>kachanStorage.revision){kachanStorage.external=true; kachanStorage.signal();}});
