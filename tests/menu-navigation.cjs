const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'no-preference'}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);
 await page.evaluate(()=>{projects.push({...projects[0],id:'menu-navigation-project',name:'Navigation check'});renderProjects();});
 for(const lang of ['uk','en']){
  await page.evaluate(lang=>{setLanguage(lang);location.hash='projects';showView()},lang);
  const menus=page.locator('#all-projects .project-row-more');assert(await menus.count()>=2);
  await menus.nth(0).locator(':scope>summary').click();assert(await menus.nth(0).evaluate(e=>e.open));
  await menus.nth(1).locator(':scope>summary').click();assert(!(await menus.nth(0).evaluate(e=>e.open)));assert(await menus.nth(1).evaluate(e=>e.open));
  await page.keyboard.press('Escape');assert(!(await menus.nth(1).evaluate(e=>e.open)));assert(await menus.nth(1).locator(':scope>summary').evaluate(e=>e===document.activeElement));
  await menus.nth(0).locator(':scope>summary').click();await page.locator('#page-breadcrumb').click();assert(!(await menus.nth(0).evaluate(e=>e.open)));
  await page.evaluate(()=>{location.hash='projects?tab=tasks';showView()});
  const task=page.locator('#all-tasks .task-action-menu').first();await task.locator(':scope>summary').click();await page.keyboard.press('Escape');assert(!(await task.evaluate(e=>e.open)));assert(await task.locator(':scope>summary').evaluate(e=>e===document.activeElement));
  await task.locator(':scope>summary').click();await task.locator('.task-edit').click();assert(await page.locator('#task-input').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('#task-input').isVisible()));await page.waitForFunction(()=>document.activeElement.matches('.task-action-menu>summary'));assert(await task.locator(':scope>summary').evaluate(e=>e===document.activeElement));
  // Native Escape must dismiss the inner menu before cancelling its containing dialog.
  await page.evaluate(()=>{const content=E('div'),menu=E('details','project-row-more');menu.append(E('summary','','Options'),button('Action',()=>{}));content.append(menu);window.menuTestWindow=utilityWindow('menu-navigation-test','projects',content);menuTestWindow.open();menu.open=true;menu.querySelector('button').focus();});
  await page.keyboard.press('Escape');assert(await page.locator('#menu-navigation-test').evaluate(e=>e.open));assert(!(await page.locator('#menu-navigation-test details').evaluate(e=>e.open)));assert(await page.locator('#menu-navigation-test summary').evaluate(e=>e===document.activeElement));
  await page.keyboard.press('Escape');assert(!(await page.locator('#menu-navigation-test').evaluate(e=>e.open)));await page.evaluate(()=>menuTestWindow.dialog.remove());
  await page.evaluate(()=>{location.hash='resources';showView()});
  const cards=page.locator('.resource-card:visible'),names=await cards.locator('.resource-card-title').allTextContents(),opener=cards.first().locator('.resource-details-open');await opener.click();
  const dialog=page.locator('#resource-details-window'),nav=dialog.locator('.resource-details-navigation'),next=nav.locator('button').last();
  assert(await nav.locator('button').first().isDisabled());assert.equal(await dialog.locator('.resource-detail-content>h2').innerText(),names[0]);
  await next.click();assert.equal(await dialog.locator('.resource-detail-content>h2').innerText(),names[1]);assert.equal(await nav.locator('[role=status]').innerText(),'2 / '+names.length);assert(await next.evaluate(e=>e===document.activeElement));
  const navigation=await nav.boundingBox(),description=await dialog.locator('.resource-detail-description').boundingBox();assert(navigation.y+navigation.height<=description.y,'Navigation precedes variable-length content');
  await nav.locator('button').first().click();assert.equal(await dialog.locator('.resource-detail-content>h2').innerText(),names[0]);assert(await nav.locator('button').first().isDisabled());await page.keyboard.press('Escape');assert(await opener.evaluate(e=>e===document.activeElement));
 }
 assert.deepEqual(errors,[]);console.log('PASS bilingual exclusive menus, outside dismissal, Escape focus and modal precedence, task edit return, top-positioned resource browsing and boundary states');
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});
