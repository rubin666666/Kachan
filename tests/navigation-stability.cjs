const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:Number(process.env.KACHAN_TEST_WIDTH)||1920,height:1080},reducedMotion:'no-preference'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
   window.uiMovement=[];
   const original=Element.prototype.animate;
   Element.prototype.animate=function(frames,options){
    const list=Array.isArray(frames)?frames:Object.entries(frames).map(([key,value])=>({[key]:value}));
    if(this.closest('.content,dialog')&&!this.closest('.home-blueprint,.tool-demo,.studio-motion-stage,.studio-poster,.live-example-preview')&&list.some(frame=>['transform','translate','scale','height','top','left'].some(key=>frame[key]!==undefined)))window.uiMovement.push({target:this.className,frames});
    return original.call(this,frames,options);
   };
  });
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);
  await page.evaluate(({lang,theme})=>{if(lang)setLanguage(lang);if(theme){settings.theme=theme;applySettings()}},{lang:process.env.KACHAN_TEST_LANG,theme:process.env.KACHAN_TEST_THEME});
  async function stable(selector,keys=['x','y','width','height']){
   const frames=await page.evaluate(async selector=>{
    const frames=[];
    for(let i=0;i<15;i++)await new Promise(resolve=>requestAnimationFrame(()=>{
     const el=document.querySelector(selector),r=el?.getBoundingClientRect();
     const moving=document.getAnimations().filter(a=>{const node=a.effect?.target;if(!(node instanceof Element)||node.closest('.home-blueprint,.tool-demo,.studio-motion-stage,.studio-poster,.live-example-preview'))return false;const f=a.effect.getKeyframes();return ['transform','translate','scale','height','top','left'].some(key=>new Set(f.map(x=>x[key]).filter(x=>x!==undefined)).size>1);}).map(a=>({target:a.effect.target.className,name:a.animationName,frames:a.effect.getKeyframes()}));
     frames.push({box:r?{x:r.x,y:r.y,width:r.width,height:r.height}:null,moving});resolve();
    }));return frames;
   },selector);
   assert(frames.every(f=>f.box),selector+' exists');
   const movements=frames.flatMap(f=>f.moving);assert.equal(movements.length,0,selector+' has no positional animations: '+JSON.stringify(movements.slice(0,2)));
   for(const key of keys){const values=frames.map(f=>f.box[key]);assert(Math.max(...values)-Math.min(...values)<.8,selector+' '+key+' '+values.join(','));}
   return frames[frames.length-1].box;
  }
  for(const route of ['resources','learning','tools','projects','profile','settings','dashboard']){
   await page.locator('.sidebar [data-view-link="'+route+'"]').click();
   await page.waitForFunction(route=>document.body.dataset.focusRoute===route,route);
   await stable(route==='dashboard'?'.focus-hero':'#'+route+'-view>.page-heading');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.locator('.focus-portal').first().hover();await stable('.focus-portal');
  await page.locator('#global-search-open').click();const search=await stable('#command-dialog'),input=await page.locator('#global-query').boundingBox();
  for(const query of ['MDN','CSS','no-such-result-529']){
   await page.locator('#global-query').fill(query);const box=await stable('#command-dialog');for(const key of ['x','y','width','height'])assert(Math.abs(box[key]-search[key])<.8,'Search does not resize/recenter: '+query+' '+key);
   assert(Math.abs((await page.locator('#global-query').boundingBox()).y-input.y)<.8,'Search field stays fixed');
  }
  await page.locator('#global-query').fill('CSS');
  for(const row of await page.locator('.command-result').all()){
   const title=await row.locator('.search-result-title').boundingBox(),description=await row.locator('.search-preview-text').boundingBox(),box=await row.boundingBox();
   assert(title&&title.height>0&&title.width>200,'Search title has a readable column');
   if(description)assert(description.y>=title.y+title.height-1&&description.y+description.height<=box.y+box.height-8,'Search description stays below title and within row '+JSON.stringify({title,description,box}));
  }
  const count=await page.locator('.command-result').count();for(let i=0;i<count;i++)await page.keyboard.press('ArrowDown');
  assert(await page.locator('.command-result').last().evaluate(e=>{const r=e.getBoundingClientRect(),p=e.closest('dialog').getBoundingClientRect();return r.top>=p.top&&r.bottom<=p.bottom}),'Keyboard results stay within search');
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'global-search-open');
  await page.locator('.sidebar [data-view-link=resources]').click();
  const resource=page.locator('.resource-card:visible').first(),resourceId=await resource.getAttribute('data-resource-id'),resourceBox=await resource.boundingBox();
  await resource.locator('.resource-save-button').click();
  const savedBox=await stable('.resource-card[data-resource-id="'+resourceId+'"]');assert(Math.abs(savedBox.height-resourceBox.height)<.8,'Saving a resource never inserts a temporary badge row');
  assert.equal(await page.locator('.resource-favorite-mark:visible').count(),0,'One clear saved-state indicator');
  const main=await page.locator('#main-content>.content').boundingBox();
  await page.locator('.resource-details-open:visible').first().click();const detail=await stable('#resource-details-window');assert(detail.width<=762,'Readable detail width');
  await page.locator('#resource-details-window .resource-comment>summary').click();const expanded=await stable('#resource-details-window',['x','y','width']);assert(Math.abs(expanded.y-detail.y)<.8,'Expanding fields does not recenter dialog');
  const locked=await page.locator('#main-content>.content').boundingBox();assert(Math.abs(locked.x-main.x)<.8&&Math.abs(locked.width-main.width)<.8,'No page width shift under modal');
  await page.keyboard.press('Escape');
  await page.evaluate(()=>openFoundation());await stable('#foundation-window');await page.keyboard.press('Escape');
  await page.locator('.sidebar [data-view-link=settings]').click();
  for(const key of ['account','data','alerts','look']){await page.evaluate(key=>{settingsTab=key;arrangeSettings()},key);await stable('#settings-view>.page-heading');await stable('#settings-tabs');}
  await page.evaluate(()=>{openLesson('html-document');learningStep='theory';arrangeLesson()});
  await page.waitForFunction(()=>studyBody()?.querySelector('.study-overview')?.dataset.step==='theory');
  await page.locator('.study-example:visible').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY+60));await page.evaluate(()=>rememberStudyScroll());
  await page.locator('.sidebar [data-view-link=dashboard]').click();
  const resumeFrames=await page.evaluate(async()=>{const values=[];openLesson('html-document');for(let i=0;i<15;i++)await new Promise(resolve=>requestAnimationFrame(()=>{values.push(scrollY);resolve()}));return values});
  assert(Math.max(...resumeFrames)-Math.min(...resumeFrames)<1,'Lesson resume scroll is resolved before the first paint: '+resumeFrames);
  await page.evaluate(()=>{location.hash='dashboard';showView()});await page.waitForFunction(()=>document.querySelector('.home-orbit')?.dataset.motionState==='running');
  const first=await page.locator('.workspace-orbit').evaluate(e=>e.toDataURL());await page.waitForTimeout(100);assert.notEqual(await page.locator('.workspace-orbit').evaluate(e=>e.toDataURL()),first,'Decorative orbit remains animated');
  assert.deepEqual(await page.evaluate(()=>uiMovement),[],'Navigation never asks WAAPI to move working content');
  assert.deepEqual(errors,[]);console.log('PASS normal-motion route/card/dialog geometry, fixed search footprint, expanding resource details, stable page width and settings tabs, keyboard results/focus, preserved moving orbit');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

