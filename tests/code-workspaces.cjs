const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);
  for(const width of [1440,1920,2560,3440])for(const lang of ['uk','en']){
   await page.setViewportSize({width,height:1080});await page.evaluate(lang=>{setLanguage(lang);openTool('js-practice')},lang);
   await page.locator('#developer-exercise').selectOption('free');
   const input=page.locator('#developer-js');await page.locator('.desktop-code-editor .code-editor-shell').waitFor();
   assert.equal(await page.locator('.desktop-code-workspace').count(),1);
   const editor=await input.boundingBox(),result=await page.locator('.desktop-code-result').boundingBox(),actions=await page.locator('.desktop-code-actions').boundingBox();
   assert(result.x>editor.x+editor.width,'Console is beside editor');assert(actions.y<editor.y,'Actions above code');
   assert.equal(await page.locator('.desktop-code-context #developer-exercise').count(),1);
   await input.fill('console.log("wide workspace");');await input.press('Control+Enter');
   await page.waitForFunction(()=>Q('developer-results').textContent.includes('wide workspace'));
   const code=await input.inputValue();await page.locator('.desktop-code-editor .editor-expand').click();assert((await input.boundingBox()).height>editor.height);
   await page.locator('.desktop-code-editor .editor-expand').click();assert.equal(await input.inputValue(),code);
   await page.locator('#developer-exercise').selectOption('sum');
   await page.locator('#developer-js').fill('function sum(numbers) { return numbers.reduce((total, n) => total + n, 0); }');
   await page.locator('.desktop-code-actions button[data-practice-run]').nth(1).click();
   await page.waitForFunction(()=>Q('developer-results').textContent.includes(dc().pass)&&!Q('developer-results').textContent.includes(dc().fail));
   await page.locator('.desktop-code-result .cheat-entry').first().locator('summary').click();assert(await page.locator('.desktop-code-result .cheat-entry[open]').count());
   await page.evaluate(()=>openTool('markup'));await page.locator('.desktop-code-editor .code-editor-shell').waitFor();
   const markup=page.locator('#markup-code');await markup.fill('<input><button></button>');await markup.press('Control+Enter');
   assert(await page.locator('.desktop-code-result #markup-results li').count()>=2);
   const clean='<main><h1>Wide preview</h1><label for="name">Name</label><input id="name"><button type="button">Save</button></main>';
   await markup.fill(clean);await markup.press('Control+Enter');assert.equal(await page.locator('#markup-results li').count(),1);
   assert.equal(await page.frameLocator('.desktop-code-result iframe').locator('h1').textContent(),'Wide preview');
   const bounds=await page.locator('.desktop-code-result').boundingBox();assert(bounds.x>(await markup.boundingBox()).x);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(width===1920&&lang==='uk')await page.screenshot({path:'.qa/code-workspace-markup.png',fullPage:true});
  }
  await page.evaluate(()=>kachanStorage.flush());await page.reload();await page.waitForFunction(()=>window.kachanReady);
  await page.evaluate(()=>openTool('markup'));assert((await page.locator('#markup-code').inputValue()).includes('Wide preview'));
  await page.evaluate(()=>openTool('js-practice'));assert((await page.locator('#developer-js').inputValue()).includes('numbers.reduce'));
  await page.locator('.tool-workspace-heading .tool-catalog-back').click();
  await page.waitForFunction(()=>document.activeElement.id==='tool-catalog-search');
  assert.equal(await page.locator('.desktop-code-workspace').count(),0,'Return opens the catalog without stale editor panels');
  assert.deepEqual(errors,[]);console.log('PASS HTML/JS side-by-side workspaces at 1440/1920/2560/3440, run/check shortcuts, exercise switching, expansion, live preview and saved drafts, both languages');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
