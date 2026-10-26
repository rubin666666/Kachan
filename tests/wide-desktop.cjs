const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);
  for(const [width,height] of [[1600,900],[1920,1080],[2560,1440],[3440,1440]])for(const lang of ['uk','en']){
   await page.setViewportSize({width,height});await page.evaluate(lang=>setLanguage(lang),lang);
   await page.evaluate(()=>{location.hash='learning';learningScreen='library';showView()});
   const courses=page.locator('.course-desk .learning-course-card');
   const first=await courses.nth(0).boundingBox(),second=await courses.nth(1).boundingBox();
   assert.equal(Math.abs(first.y-second.y)<2,width>=1800,'Course grid follows available desktop width');
   const resume=await page.locator('.course-desk-aside>.learning-resume-banner').boundingBox(),actions=await page.locator('.organization-course-actions').boundingBox();
   assert(Math.abs(resume.y-actions.y)<resume.height&&resume.x<actions.x,'Continue lesson is primary, secondary actions share its row');
   await page.evaluate(()=>{unifiedGroup='all';unifiedQuery='';openUnifiedTools()});
   const categories=page.locator('.organization-tool-categories .organization-card');
   const categoryFirst=await categories.nth(0).boundingBox(),categoryThird=await categories.nth(2).boundingBox();
   assert.equal(Math.abs(categoryFirst.y-categoryThird.y)<2,width>=1800,'Category tiles use three columns on large monitors '+JSON.stringify({width,lang,categoryFirst,categoryThird}));
   await page.evaluate(()=>{unifiedGroup='CSS';unifiedQuery='';openUnifiedTools()});
   await page.waitForTimeout(60);await page.evaluate(()=>scrollTo(0,0));
   const tools=page.locator('.unified-catalog .unified-tool-card:visible');
   const a=await tools.nth(0).boundingBox(),b=await tools.nth(1).boundingBox();
   assert(Math.abs(a.y-b.y)<2&&b.x>a.x,'Two tool columns');assert(a.width>=460,'Tool labels and demos have room');
   assert(await tools.count()>=2);
   const initialFilters=await page.locator('.tool-results-workspace>.unified-filters').boundingBox();
   await page.evaluate(()=>scrollTo(0,700));await page.waitForTimeout(60);
   const filters=await page.locator('.tool-results-workspace>.unified-filters').boundingBox(),scrolled=await page.evaluate(()=>scrollY);
   assert(Math.abs(filters.y-Math.max(12,initialFilters.y-scrolled))<2,'Tool categories stay accessible without forcing needless page scrolling');
   if(width===2560&&lang==='uk'){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'.qa/wide-tools.png',fullPage:true});}
   await page.locator('.sidebar a[href="#resources"]').click();
   await page.waitForFunction(()=>convenienceRoute==='#resources');
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.locator('.resource-desk-more').click();await page.locator('.resource-desk-more').click();
   assert.equal(await page.locator('.resource-card:visible').count(),24);
   await page.evaluate(()=>scrollTo(0,600));
   await page.waitForTimeout(60);const nav=await page.locator('.resource-desk-nav').boundingBox();assert(nav.y>=10&&nav.y<=14,'Resource categories stay accessible '+JSON.stringify({width,lang,nav,scroll:await page.evaluate(()=>scrollY)}));
   await page.evaluate(()=>{openLesson('css-flex');learningStep='practice';arrangeLesson()});
   const editor=page.locator('#academy-code-css'),preview=page.locator('.study-result .academy-preview');
   assert(await editor.isVisible());assert(await preview.isVisible());
   const e=await editor.boundingBox(),p=await preview.boundingBox();assert(p.x>e.x+e.width,'Editor and result share the desktop workspace');
   if(width>=1800){assert(e.height>=360);assert(p.height>=380);}
   const actionDocumentTop=await page.locator('.study-actionbar').evaluate(e=>e.getBoundingClientRect().top+scrollY);
   await page.evaluate(()=>{const r=document.querySelector('.study-workbench').getBoundingClientRect();scrollTo(0,r.top+scrollY+80)});
   await page.waitForTimeout(60);const bar=await page.locator('.study-actionbar').boundingBox(),practiceScroll=await page.evaluate(()=>scrollY);assert(Math.abs(bar.y-Math.max(12,actionDocumentTop-practiceScroll))<2,'Run and check controls remain reachable '+JSON.stringify({width,height,bar,practiceScroll,actionDocumentTop}));
   await page.evaluate(()=>openContent('reference'));
   const dialog=await page.locator('#content-reference-window').boundingBox();assert(dialog.width>=1000&&dialog.width<=1282);assert(dialog.y>=0&&dialog.y+dialog.height<=height+1);
   await page.keyboard.press('Escape');
   if(width===2560&&lang==='uk'){await page.evaluate(()=>{location.hash='dashboard';showView()});await page.screenshot({path:'.qa/wide-home.png',fullPage:true});}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
  }
  assert.deepEqual(errors,[]);console.log('PASS wide desktop at 1600/1920/2560/3440: two-column catalogs, readable tool cards, sticky filters/actions, editor-preview pair and reference window, both languages');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
