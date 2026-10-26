const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:Number(process.env.KACHAN_TEST_WIDTH)||1920,height:1080},reducedMotion:'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);if(process.env.KACHAN_TEST_THEME)await page.evaluate(theme=>{settings.theme=theme;applySettings()},process.env.KACHAN_TEST_THEME);
 for(const lang of ['uk','en']){
  await page.evaluate(lang=>{setLanguage(lang);location.hash='resources';showView();resourceFilter='all';Q('resource-query').value='';Q('resource-collection').value='all';renderResources()},lang);
  const card=page.locator('.resource-card:visible').first(),description=await card.locator(':scope>.panel-note').first().innerText(),href=await card.locator('a.text-link').getAttribute('href');
  await card.locator('.resource-details-open').click();const resource=page.locator('#resource-details-window');
  assert.equal(await resource.locator('.resource-detail-description').innerText(),description);assert.equal(await resource.locator('.resource-detail-actions>.primary-button').getAttribute('href'),href);
  const close=await resource.locator('.window-close').boundingBox(),header=await resource.locator('.editor-window-header').boundingBox();assert(close.width>=40&&close.height>=40);assert(header.height>=72&&header.height<=80);
  await page.keyboard.press('Escape');assert(await card.locator('.resource-details-open').evaluate(e=>e===document.activeElement));
  await page.locator('#open-resource-window').click();const formHeader=await page.locator('#resource-window .editor-window-header').boundingBox();assert(Math.abs(formHeader.height-header.height)<1);assert(Math.abs(formHeader.y-header.y)<1);await page.keyboard.press('Escape');
  await page.evaluate(()=>{location.hash='projects';showView()});await page.locator('#open-project-window').click();const projectHeader=await page.locator('.editor-window[open]>.editor-window-header').boundingBox();assert(Math.abs(projectHeader.height-header.height)<1);assert(Math.abs(projectHeader.y-header.y)<1);await page.keyboard.press('Escape');await page.evaluate(()=>{location.hash='resources';showView()});

  await page.locator('#resource-query').fill('does-not-exist-2918');await page.locator('.resource-desk-list .catalog-empty').waitFor();await page.locator('.resource-desk-list .catalog-empty button').click();assert(await page.locator('.resource-card:visible').count()>0);assert.equal(await page.locator('#resource-query').inputValue(),'');
  await page.locator('#global-search-open').click();await page.locator('#global-query').fill('does-not-exist-2918');await page.locator('#command-dialog .catalog-empty button').click();assert.equal(await page.locator('#global-query').inputValue(),'');assert(await page.locator('.command-result').count()>0);await page.keyboard.press('Escape');
  await page.evaluate(()=>openTool('flex'));assert(!(await page.locator('.tool-preset-actions').isVisible()));
  await page.locator('.tool-secondary-actions>summary').click();assert(await page.locator('.tool-preset-actions').isVisible());
  await page.locator('#dev-gap').fill('27');await page.locator('#dev-gap').dispatchEvent('input');assert.equal(await page.locator('.flex-preview').evaluate(e=>getComputedStyle(e).gap),'27px');
  page.once('dialog',dialog=>dialog.dismiss());await page.locator('.tool-preset-actions button').last().click();assert.equal(await page.locator('#dev-gap').inputValue(),'27');
  page.once('dialog',dialog=>dialog.accept());await page.locator('.tool-preset-actions button').last().click();assert.equal(await page.locator('#dev-gap').inputValue(),'16');assert(!(await page.locator('.tool-preset-actions').isVisible()));
  await page.evaluate(()=>{location.hash='settings';showView();settingsTab='account';arrangeSettings();cloudBusy=true;cloudMessage='cloudBusy';renderCloud()});
  assert.equal(await page.locator('#cloud-status').getAttribute('data-state'),'loading');assert.equal(await page.locator('#settings-account').getAttribute('aria-busy'),'true');assert.equal(await page.locator('#cloud-auth-form button:not(:disabled)').count(),0);
  await page.evaluate(()=>{cloudBusy=false;cloudMessage='cloudError';cloudFailure=Object.assign(new TypeError('Network error'),{code:'network'});renderCloud()});assert.equal(await page.locator('#cloud-status').getAttribute('role'),'alert');assert.equal(await page.locator('#cloud-status').getAttribute('data-state'),'error');assert((await page.locator('#cloud-status').innerText()).length>20);
  await page.evaluate(()=>{cloudFailure=null;cloudMessage='cloudSaved';renderCloud()});assert.equal(await page.locator('#cloud-status').getAttribute('data-state'),'success');assert.equal(await page.locator('#settings-account').getAttribute('aria-busy'),'false');
  await page.evaluate(()=>{cloudMessage='';renderCloud()});assert(!(await page.locator('#cloud-status').isVisible()));
 }
 assert.deepEqual(errors,[]);console.log('PASS two-language resource details/actions, empty search recovery, stable dialog header/close focus, folded tool actions with live controls and safe cancellation, loading/error/saved states without external requests');
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});

