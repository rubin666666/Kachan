const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);
  for(const width of [1280,1920,2560])for(const lang of ['uk','en'])for(const theme of ['dark','light']){
   await page.setViewportSize({width,height:1080});await page.evaluate(({lang,theme})=>{setLanguage(lang);settings.theme=theme;applySettings()},{lang,theme});
   for(const id of ['html-document','css-flex','javascript-values','figma-frames'])for(const step of ['theory','practice','test']){
    await page.evaluate(({id,step})=>{openLesson(id);learningStep=step;arrangeLesson()},{id,step});
    await page.waitForFunction(({id,step})=>{const n=studyBody()?.querySelector('.study-overview');return n?.dataset.lesson===id&&n.dataset.step===step},{id,step});
    const overflow=await page.locator('.learning-reader:visible').evaluate(root=>[...root.querySelectorAll('*')].filter(e=>e.checkVisibility()&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+3&&!e.matches('input,textarea,select,pre,code,svg,iframe')&&!e.closest('pre,code,svg,iframe')&&!['auto','scroll'].includes(getComputedStyle(e).overflowX)).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,60)})).slice(0,5));
    assert.deepEqual(overflow,[],[width,lang,theme,id,step].join('/'));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(step==='theory'){
     const code=await page.locator('.study-example-code:visible').boundingBox(),result=await page.locator('.study-example-result:visible').boundingBox();
     assert(code.width>=250&&result.x>code.x+code.width,'Code and result have usable desktop columns');
     const p=await page.locator('.beginner-lesson:visible>p').first().boundingBox(),h=await page.locator('.beginner-lesson:visible>h3').first().boundingBox();assert(Math.abs(p.x-h.x)<2,'Reading headings align with text');
    }
    if(width===1920&&lang==='uk'&&theme==='dark'&&id==='html-document'&&step==='theory')await page.screenshot({path:'.qa/guided-learning-desktop.png',fullPage:true});
   }
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{openLesson('html-document');learningStep='theory';arrangeLesson()});await page.waitForFunction(()=>studyBody()?.querySelector('.study-overview')?.dataset.step==='theory');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Small-screen fallback keeps content available');
  assert.deepEqual(errors,[]);console.log('PASS 144 guided lesson/phase layouts at 1280/1920/2560, both themes/languages, usable example columns, aligned reading and small-screen fallback');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
