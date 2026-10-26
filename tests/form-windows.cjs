const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({reducedMotion:'no-preference'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await p.waitForFunction(()=>window.kachanReady);
for(const size of [{width:1440,height:680},{width:1920,height:1080}])for(const lang of ['uk','en']){
 await p.setViewportSize(size);await p.evaluate(lang=>setLanguage(lang),lang);
 for(const kind of ['project','resource','profile']){
  if(kind==='project'){await p.evaluate(()=>{location.hash='projects';showView()});await p.locator('#open-project-window').click();}
  else if(kind==='resource'){await p.evaluate(()=>{location.hash='resources';showView()});await p.locator('#open-resource-window').click();}
  else await p.evaluate(()=>{renderProfileForm();profileEditor.open()});
  const dialog=p.locator('dialog.form-window[open]'),form=dialog.locator(':scope>form'),header=dialog.locator('.editor-window-header'),footer=form.locator(':scope>.dialog-form-actions');
  assert.equal(await footer.count(),1);assert(await footer.locator('button[type=submit]').isVisible());const initialFooter=await footer.boundingBox();assert(initialFooter.y+initialFooter.height<=size.height,'Actions visible before scrolling');
  const before=await header.boundingBox();await form.evaluate(e=>e.scrollTop=e.scrollHeight);const after=await header.boundingBox();assert(Math.abs(before.y-after.y)<1,'Header stays fixed');
  const d=await dialog.boundingBox(),action=await footer.boundingBox();assert(d.y>=0&&d.y+d.height<=size.height+1,'Window fits viewport');assert(action.y>=after.y+after.height-1&&action.y+action.height<=d.y+d.height+1,'Footer within window');
  assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1),'No outer horizontal scrolling');
  await p.keyboard.press('Escape');
 }
}
await p.evaluate(()=>{location.hash='resources';showView()});await p.locator('#open-resource-window').click();
await p.locator('#resource-form [name=name]').fill('Window save check');await p.locator('#resource-form [name=url]').fill('https://example.com/window-check');
await p.locator('#resource-form .dialog-form-actions button[type=submit]').click();await p.waitForFunction(()=>extras.customResources.some(r=>r.name==='Window save check'));
await p.evaluate(()=>kachanStorage.flush());await p.reload();await p.waitForFunction(()=>window.kachanReady);assert(await p.evaluate(()=>extras.customResources.some(r=>r.name==='Window save check')),'Wrapped submit preserves real local saving');
assert.deepEqual(errors,[]);console.log('PASS short and large desktop forms, two languages, one live action bar, fixed headers, reachable save buttons and no horizontal overflow');}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
