const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.kachanReady&&document.querySelector('.home-orbit')?.dataset.motionState==='running');
 const pixels=()=>page.locator('.workspace-orbit').evaluate(e=>e.toDataURL());const first=await pixels();await page.waitForTimeout(120);assert.notEqual(await pixels(),first,'The orbit really draws moving frames');
 await page.locator('.focus-portal').first().hover();await page.waitForFunction(()=>document.querySelector('.pointer-lit'));assert.equal(await page.locator('.pointer-lit').count(),1);
 await page.setViewportSize({width:1440,height:450});await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForFunction(()=>document.querySelector('.home-orbit').dataset.motionState==='paused');const offscreen=await pixels();await page.waitForTimeout(100);assert.equal(await pixels(),offscreen,'No drawing outside viewport');
 await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>document.querySelector('.home-orbit').dataset.motionState==='running');
 await page.evaluate(()=>{location.hash='resources';showView()});await page.waitForFunction(()=>document.querySelector('.home-orbit').dataset.motionState==='paused');assert.equal(await page.locator('.pointer-lit').count(),0);
 await page.evaluate(()=>{location.hash='dashboard';showView()});await page.waitForFunction(()=>document.querySelector('.home-orbit').dataset.motionState==='running');
 for(const lang of ['uk','en'])for(const theme of ['dark','light'])for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});await page.evaluate(({lang,theme})=>{setLanguage(lang);settings.theme=theme;extras.preferences.systemTheme=false;applySettings();scrollTo(0,0)},{lang,theme});await page.waitForTimeout(100);
  assert.equal(await page.locator('.workspace-orbit').count(),1);assert.equal(await page.locator('.orbit-label').count(),3);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow '+width+' '+lang+' '+theme);
  for(const label of await page.locator('.orbit-label').all()){const r=await label.boundingBox();assert(r.x>=0&&r.x+r.width<=width+1,'Labels fit viewport')}
 }
 await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{setLanguage('uk');settings.theme='dark';applySettings();scrollTo(0,0)});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.home-orbit').dataset.motionState==='paused');const still=await pixels();await page.waitForTimeout(120);assert.equal(await pixels(),still,'Reduced motion retains static artwork');assert.equal(await page.locator('.pointer-lit').count(),0);await page.screenshot({path:'.qa/orbit-home.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS moving pixels, offscreen/route pause, cursor light, 16 language/theme/viewport layouts, single scene after rerenders, reduced motion, no errors');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
