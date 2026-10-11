const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.kachanReady);
 for(const lang of ['uk','en']){
  await page.evaluate(lang=>{setLanguage(lang);location.hash='resources';showView();resourceFilter='all';renderResources()},lang);
  await page.locator('.resource-type-group').first().evaluate(e=>e.open=true);
  const card=page.locator('.resource-card:visible').first(),id=await card.getAttribute('data-resource-id');await card.locator('.resource-save-button').waitFor();const was=await card.locator('.resource-save-button').getAttribute('aria-pressed');
  await card.locator('.resource-save-button').click();await page.waitForFunction(({id,was})=>[...document.querySelectorAll('.resource-card')].find(c=>c.dataset.resourceId===id)?.querySelector('.resource-save-button')?.getAttribute('aria-pressed')!==was,{id,was});
  assert.equal(await page.evaluate(id=>favorites.includes(id),id),was!=='true');await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>document.activeElement.className),'resource-save-button');
  await page.reload();await page.waitForFunction(()=>window.kachanReady);assert.equal(await page.evaluate(id=>favorites.includes(id),id),was!=='true');
  await page.evaluate(()=>{location.hash='learning';showView();learningScreen='library';applyLearningLook()});await page.locator('.course-card-actions').first().waitFor();assert.equal(await page.locator('.course-card-actions').count(),6);
  await page.locator('.course-card-actions .learning-outline').first().click();await page.locator('.learning-map-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');
  await page.locator('.course-card-actions .learning-course-start').first().click();await page.locator('.learning-reader').first().waitFor({state:'visible'});
  for(const width of [320,390,768,1440])for(const theme of ['dark','light']){
   await page.setViewportSize({width,height:900});await page.evaluate(theme=>{settings.theme=theme;applySettings();learningScreen='library';applyLearningLook()},theme);await page.locator('.course-card-actions').first().waitFor();
   assert.equal(await page.locator('.course-card-actions').evaluateAll(rows=>rows.filter(e=>e.scrollWidth>e.clientWidth+1).length),0,'Course buttons fit');
   await page.locator('#extra-chapter-list').evaluate(e=>e.open=true);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.evaluate(()=>{location.hash='resources';showView()});await page.locator('.resource-type-group').first().evaluate(e=>e.open=true);await page.locator('.resource-save-button').first().waitFor();
   assert.equal(await page.locator('.resource-card:visible').evaluateAll(rows=>rows.filter(e=>e.scrollWidth>e.clientWidth+2).length),0,'Resource cards fit');
   if(width===1440&&theme==='dark'&&lang==='uk')await page.screenshot({path:'.qa/resource-actions.png',fullPage:true});
   await page.evaluate(()=>{location.hash='learning';showView();learningScreen='library';applyLearningLook()});
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS direct favorite toggle, restored focus, reload persistence, both languages, grouped course actions and navigation');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
