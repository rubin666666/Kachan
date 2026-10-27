const{chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5175');await page.waitForFunction(()=>window.kachanReady);
 for(const width of [1280,1440,1920,2560])for(const lang of ['uk','en'])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:1080});await page.evaluate(({lang,theme})=>{setLanguage(lang);settings.theme=theme;applySettings();},{lang,theme});
  const navigation=await page.locator('.sidebar .nav-item:visible').evaluateAll(items=>items.map(item=>{const icon=item.querySelector(':scope>span:first-child>svg'),label=item.querySelector('.nav-text');if(!icon)return{missing:item.textContent};const a=icon.getBoundingClientRect(),b=label.getBoundingClientRect();return{label:label.textContent,x:a.x,w:a.width,h:a.height,delta:a.y+a.height/2-b.y-b.height/2};}));
  assert(navigation.every(x=>!x.missing&&x.w===18&&x.h===18&&Math.abs(x.delta)<1),JSON.stringify(navigation));assert(navigation.every(x=>Math.abs(x.x-navigation[0].x)<1),'All sidebar icons share the same rail');
  let titleRail;
  for(const route of ['resources','learning','tools','projects','profile','settings']){
   await page.evaluate(route=>{location.hash=route;showView()},route);
   const geometry=await page.locator('#'+route+'-view>.page-heading').evaluate(root=>{const title=root.querySelector('h1'),icon=root.querySelector('.section-emblem'),svg=icon.querySelector('svg'),a=title.getBoundingClientRect(),b=icon.getBoundingClientRect(),c=svg.getBoundingClientRect(),buttons=[...root.querySelectorAll('.primary-button,.secondary-button,.quiet-profile-share>summary')].filter(e=>e.checkVisibility());return{x:a.x,w:b.width,h:b.height,delta:b.y+b.height/2-a.y-a.height/2,svgDelta:c.y+c.height/2-a.y-a.height/2,buttons:buttons.map(e=>{const r=e.getBoundingClientRect();return{text:e.textContent,height:r.height,delta:r.y+r.height/2-a.y-a.height/2};})};});
   titleRail??=geometry.x;assert(Math.abs(geometry.x-titleRail)<1,JSON.stringify({route,width,lang,theme,geometry,titleRail}));assert.equal(geometry.w,28);assert.equal(geometry.h,28);assert(Math.abs(geometry.delta)<1&&Math.abs(geometry.svgDelta)<1,route+' icon centers');assert(geometry.buttons.every(b=>Math.abs(b.delta)<1&&b.height>=40&&b.height<=44),JSON.stringify({route,geometry}));
   if(route==='profile'){
    const title=page.locator('#profile-view>.page-heading h1'),before=await title.boundingBox();await page.locator('.quiet-profile-share>summary').click();const after=await title.boundingBox();assert(Math.abs(before.x-after.x)<1&&Math.abs(before.y-after.y)<1&&before.height===after.height,'Sharing controls do not squeeze or move the title');await page.locator('.quiet-profile-share>summary').click();
   }
   if(route==='learning'){
    const cards=await page.locator('.learning-course-card').evaluateAll(items=>items.map(e=>{const icon=e.querySelector('.learning-course-mark').getBoundingClientRect(),title=e.querySelector('h3').getBoundingClientRect();return{delta:icon.y+icon.height/2-title.y-title.height/2,text:e.querySelector('h3').textContent};}));assert(cards.length===6&&cards.every(c=>Math.abs(c.delta)<1),JSON.stringify(cards));
   }
   if(route==='tools'){
    const cards=await page.locator('.organization-tool-categories .organization-card').evaluateAll(items=>items.map(e=>{const mark=e.querySelector('.organization-mark').getBoundingClientRect(),title=e.querySelector('strong').getBoundingClientRect(),count=e.querySelector('.organization-description').getBoundingClientRect();return{titleDelta:mark.y+mark.height/2-title.y-title.height/2,countDelta:mark.y+mark.height/2-count.y-count.height/2,markOffset:mark.x-e.getBoundingClientRect().x,titleOffset:title.x-e.getBoundingClientRect().x};}));assert(cards.every(c=>Math.abs(c.titleDelta)<1&&Math.abs(c.countDelta)<1&&Math.abs(c.titleOffset-cards[0].titleOffset)<1),JSON.stringify(cards));
   }
  }
 }
 await page.setViewportSize({width:1920,height:1080});await page.evaluate(()=>{location.hash='resources';showView();globalCreate.click()});const dialog=page.locator('#create-window');assert(await dialog.isVisible());assert(await dialog.locator('.create-option>svg').evaluateAll(icons=>icons.every(e=>getComputedStyle(e).display==='block'&&e.getBoundingClientRect().width===22)));assert(await dialog.evaluate(e=>{const title=e.querySelector('.editor-window-header h2').getBoundingClientRect(),close=e.querySelector('.window-close').getBoundingClientRect();return Math.abs(title.y+title.height/2-close.y-close.height/2)<1;}));await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);console.log('PASS sidebar SVG slots, matching title rails in six sections, centered icons and header actions, uniform profile controls, six course marks and tool category rows at four desktop widths in both themes/languages');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
