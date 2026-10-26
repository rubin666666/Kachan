const {chromium}=require('playwright'),assert=require('node:assert/strict');

// Read actual painted CSS colors, including color-mix and translucent ancestors.
function unreadableText(){
 const context=document.createElement('canvas').getContext('2d');
 function rgba(css){context.clearRect(0,0,1,1);context.fillStyle=css;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data]}
 function blend(a,b){const alpha=a[3]/255;return a.slice(0,3).map((x,i)=>x*alpha+b[i]*(1-alpha)).concat(255)}
 function background(element){return element?blend(rgba(getComputedStyle(element).backgroundColor),background(element.parentElement)):[255,255,255,255]}
 function luminance(color){const c=color.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
 return [...document.querySelectorAll('.content *, .sidebar a')]
  .filter(e=>e.checkVisibility()&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!e.closest('svg,iframe,canvas,select,[disabled]'))
  .map(e=>{const style=getComputedStyle(e),bg=background(e),a=luminance(blend(rgba(style.color),bg)),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),large=parseFloat(style.fontSize)>=24||parseFloat(style.fontSize)>=18.66&&parseInt(style.fontWeight)>=700;return {ratio,minimum:large?3:4.5,text:e.textContent.trim().slice(0,80),class:e.className}})
  .filter(row=>row.text.length>2&&row.ratio<row.minimum).slice(0,8);
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');
  await page.waitForFunction(()=>window.kachanReady);
  for(const lang of ['uk','en'])for(const theme of ['dark','light'])for(const accent of ['red','violet','blue','green']){
   await page.evaluate(({lang,theme,accent})=>{setLanguage(lang);settings.theme=theme;settings.accent=accent;applySettings()},{lang,theme,accent});
   for(const route of ['dashboard','resources','learning','tools','projects','profile','settings']){
    await page.evaluate(route=>{learningScreen='library';location.hash=route;showView();if(route==='settings'){settingsTab='look';arrangeSettings()}},route);
    assert.deepEqual(await page.evaluate(unreadableText),[],lang+' '+theme+' '+accent+' '+route);
   }
   await page.evaluate(()=>openLesson('css-flex'));
   await page.locator('.beginner-lesson:visible .code-token-number').first().waitFor();
   assert.deepEqual(await page.evaluate(unreadableText),[],lang+' '+theme+' '+accent+' lesson and syntax');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS readable text in seven sections and lesson/code examples, two languages, two themes and four accents');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
