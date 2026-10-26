const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],samples={};
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');
  await page.waitForFunction(()=>window.kachanReady);
  for(const theme of ['dark','light'])for(const accent of ['red','violet','blue','green']){
   await page.evaluate(()=>{location.hash='settings';showView();settingsTab='look';arrangeSettings()});
   await page.locator('#theme-select').selectOption(theme);
   await page.locator('#accent-color').selectOption(accent);
   await page.evaluate(()=>{location.hash='dashboard';showView()});
   await page.waitForTimeout(120);
   const sample=await page.evaluate(()=>{
    function rgb(css){const c=document.createElement('canvas').getContext('2d');c.fillStyle=css;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].slice(0,3)}
    function lum(css){const c=rgb(css).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
    function ratio(fg,bg){const a=lum(fg),b=lum(bg);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)}
    const style=selector=>getComputedStyle(document.querySelector(selector));
    const hero=style('.focus-hero'),word=style('.home-title-accent'),button=style('.home-primary-action .primary-button'),eyebrow=style('.home-hero-text>.eyebrow'),planet=style('.home-orbit'),label=style('.orbit-label'),learning=style('.focus-portal[href="#learning"]'),description=style('.focus-portal[href="#learning"] p');
    window.accentCanvas??=document.querySelector('.workspace-orbit');
    return {word:rgb(word.color),button:rgb(button.backgroundColor),eyebrow:rgb(eyebrow.color),planet:rgb(planet.color),label:rgb(label.color),learning:rgb(learning.backgroundColor),mineral:rgb(getComputedStyle(document.documentElement).getPropertyValue('--studio-mineral')),accent:rgb(getComputedStyle(document.documentElement).getPropertyValue('--accent')),canvasPreserved:window.accentCanvas===document.querySelector('.workspace-orbit'),contrasts:[ratio(word.color,hero.backgroundColor),ratio(eyebrow.color,hero.backgroundColor),ratio(button.color,button.backgroundColor),ratio(label.color,label.backgroundColor),ratio(description.color,learning.backgroundColor)],navigationContrast:ratio(style('.nav-item.active').color,style('body').backgroundColor)};
   });
   for(const key of ['button','eyebrow','planet','label'])assert.deepEqual(sample[key],sample.word,theme+' '+accent+' '+key);
   assert.deepEqual(sample.mineral,sample.accent,'Graphics follow selected accent');
   assert(sample.canvasPreserved,'Changing accent preserves planet');
   assert(sample.contrasts.every(r=>r>=4.5),theme+' '+accent+' contrast '+sample.contrasts);
   assert(sample.navigationContrast>=4.5,theme+' '+accent+' navigation contrast '+sample.navigationContrast);
   samples[theme+'-'+accent]=sample;
   if(theme==='dark'&&['red','blue'].includes(accent))await page.screenshot({path:'.qa/accent-'+accent+'.png',fullPage:true});
  }
  for(const theme of ['dark','light'])for(const key of ['word','learning'])assert.equal(new Set(['red','violet','blue','green'].map(a=>JSON.stringify(samples[theme+'-'+a][key]))).size,4,key+' changes for all accents');
  await page.evaluate(()=>{location.hash='settings';showView();settingsTab='look';arrangeSettings()});
  await page.locator('#accent-color').selectOption('red');
  await page.reload();await page.waitForFunction(()=>window.kachanReady);
  assert.equal(await page.evaluate(()=>settings.accent),'red','Choice survives reload');
  await page.evaluate(()=>{document.documentElement.dataset.studioTheme='terminal';applySettings()});
  assert(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()===palette[settings.accent]),'Terminal respects selected accent');
  await page.evaluate(()=>{document.documentElement.dataset.studioTheme='graphite';extras.preferences.systemTheme=true;applyComfort()});
  for(const colorScheme of ['light','dark']){
   await page.emulateMedia({colorScheme});
   await page.waitForFunction(theme=>document.documentElement.dataset.theme===theme,colorScheme);
   assert.equal(await page.evaluate(()=>settings.accent),'red','System theme preserves selected hue');
   assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()),colorScheme==='light'?'#b92332':'#ff5555','System theme chooses readable hue');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS four live accents, two themes, hero/button/planet/labels/graphics/card tints, contrast, preserved scene, saved choice and system theme');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

