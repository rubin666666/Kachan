const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.kachanReady);
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.exampleCopied=text}}});openLesson('html-document')});
 const shell=page.locator('.beginner-lesson .reader-code-shell').first(),pre=shell.locator('pre');await shell.waitFor();assert.equal(await page.locator('.beginner-lesson>button').count(),0,'Existing copy action is consolidated');const original=await pre.textContent();assert(original.length>0);await shell.locator('.example-copy').click();assert.equal(await page.evaluate(()=>window.exampleCopied),original);
 await shell.locator('.example-wrap').click();assert.equal(await pre.evaluate(e=>getComputedStyle(e).whiteSpace),'pre-wrap');assert.equal(await shell.locator('.example-wrap').getAttribute('aria-pressed'),'true');assert.equal(await pre.textContent(),original);await shell.locator('.example-wrap').click();assert.equal(await shell.locator('.example-wrap').getAttribute('aria-pressed'),'false');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Unavailable')}}}));await shell.locator('.example-copy').click();assert.equal(await page.evaluate(()=>getSelection().toString()),original,'Manual copy fallback selects only source');
 for(const lang of ['uk','en'])for(const width of [320,390,768,1440])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:900});await page.evaluate(({lang,theme})=>{setLanguage(lang);settings.theme=theme;applySettings();openLesson('html-document')},{lang,theme});await page.locator('.reader-code-shell:visible').first().waitFor();
  assert.equal(await page.locator('.reader-code-shell .reader-code-shell').count(),0,'No duplicate frames');
  assert.equal(await page.locator('.reader-code-toolbar').evaluateAll(rows=>rows.filter(e=>e.scrollWidth>e.clientWidth+2).length),0,'Toolbar fits');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(lang==='uk'&&theme==='dark'&&width===1440)await page.screenshot({path:'.qa/example-actions.png',fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS exact copy, clipboard fallback, reversible line wrapping, no duplicate controls, four widths, both languages and themes');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
