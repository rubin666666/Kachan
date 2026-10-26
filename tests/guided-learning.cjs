const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.KACHAN_TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.kachanReady);
  async function lesson(id,step='theory'){
   await page.evaluate(({id,step})=>{openLesson(id);learningStep=step;arrangeLesson()},{id,step});
   await page.waitForFunction(({id,step})=>{const n=studyBody()?.querySelector('.study-overview');return n?.dataset.lesson===id&&n.dataset.step===step},{id,step});
  }
  const lessons=await page.evaluate(()=>lessonCatalog().map(l=>l.id));
  for(const lang of ['uk','en']){
   await page.evaluate(lang=>setLanguage(lang),lang);
   for(const id of lessons){
    await lesson(id);const reader=page.locator('.learning-reader:visible');
    assert.equal(await reader.locator('.study-overview').count(),1,id);
    assert.equal(await reader.locator('.study-example').count(),1,id);
    assert.equal(await reader.locator('.lesson-live-demo').count(),0,'No repeated generic example');
    assert.equal(await reader.locator('.study-example-code pre').first().textContent(),await page.evaluate(id=>beginnerLessons[id].code,id),'Exact teaching code');
    assert(await page.evaluate(()=>validExtras(extras)));
   }
  }
  await page.evaluate(()=>setLanguage('en'));
  await lesson('html-document');
  const original=await page.evaluate(()=>htmlCourse.lessons.document.code);
  await page.locator('.study-example-edit>summary:visible').click();
  await page.locator('.study-example-input:visible').fill('<h1>Independent example</h1>');
  await page.locator('.study-example-actions:visible button').first().click();
  assert.equal(await page.frameLocator('.study-example-frame:visible').locator('h1').textContent(),'Independent example');
  assert.equal(await page.evaluate(()=>htmlCourse.lessons.document.code),original,'Example does not overwrite practice draft');
  assert.equal(await page.evaluate(()=>htmlCourse.lessons.document.completed),false,'Preview never completes a lesson');
  await lesson('javascript-values');await page.locator('.study-example-actions:visible button').first().click();
  await page.waitForFunction(()=>studyBody().querySelector('.study-example-output')?.textContent.includes('false'));
  await page.locator('.study-example-edit>summary:visible').click();await page.locator('.study-example-input:visible').fill('console.log(2 + 3);');
  await page.locator('.study-example-actions:visible button').first().click();await page.waitForFunction(()=>studyBody().querySelector('.study-example-output')?.textContent==='5');
  await lesson('javascript-dom');await page.locator('.study-example-actions:visible button').first().click();
  const dom=page.frameLocator('.study-example-frame:visible');await dom.locator('button').first().click();await dom.locator('button').first().click();assert.equal(await dom.locator('#count').textContent(),'2');
  await lesson('javascript-dom','practice');
  const domFiles=await page.evaluate(()=>studySource(currentLearningEntry()).solution);
  for(const file of ['html','css','js']){await page.locator('.study-editor button[data-file='+file+']').click();await page.locator('#academy-code-'+file).fill(domFiles[file]||'');}
  await page.locator('.study-actionbar .primary-button:visible').click();await page.waitForFunction(()=>!academyRunning&&academyResult!==null);
  assert.equal(await page.evaluate(()=>academyResult.error),undefined,'Ordinary learner variable names do not collide with runtime checks');
  assert(await page.evaluate(()=>academyResult.results.length>0&&academyResult.results.every(r=>r.passed)));
  await lesson('typescript-types');await page.locator('.study-example-edit>summary:visible').click();await page.locator('.study-example-input:visible').fill('const price: number = "20";');await page.locator('.study-example-actions:visible button').first().click();
  await page.waitForFunction(()=>studyBody().querySelector('.study-example-status')?.dataset.state==='error');
  assert.equal(await page.evaluate(()=>academy.states['typescript-types'].completed),false);
  await lesson('git-init');await page.locator('.study-example-actions:visible button').first().click();await page.waitForFunction(()=>studyBody().querySelector('.study-example-status')?.textContent.includes('simulation'));
  await lesson('figma-frames');assert((await page.locator('.study-example-status:visible').textContent()).includes('not a Figma editor'));
  await lesson('typescript-types','practice');assert.equal(await page.locator('.study-editor button[data-file]:visible').count(),0,'Single-file lessons avoid irrelevant HTML/CSS tabs');
  await lesson('css-flex','practice');assert.equal(await page.locator('.study-editor button[data-file]:visible').count(),2,'CSS lessons show HTML and CSS');
  await lesson('javascript-values','practice');await page.locator('#academy-code-js').fill('const userName = "Rubin"; function isPassed(score) { console.log(score >= 60); }');await page.locator('.study-actionbar .primary-button:visible').click();await page.locator('.study-coach:visible').waitFor();assert((await page.locator('.study-coach').innerText()).includes('returned value'));
  await lesson('css-cascade','practice');await page.locator('.study-editor button[data-file=html]').click();await page.locator('#academy-code-html').fill('<p>No matching element</p>');await page.locator('.study-actionbar .primary-button:visible').click();await page.locator('.study-coach:visible').waitFor();assert((await page.locator('.study-coach').innerText()).includes('could not find the element'));
  await lesson('git-init','practice');await page.locator('#academy-code-js').fill('git status');await page.locator('.study-actionbar .primary-button:visible').click();await page.locator('.study-coach:visible').waitFor();assert((await page.locator('.study-coach').innerText()).includes('git init'));
  await lesson('typescript-types','practice');await page.locator('#academy-code-js').fill('const userName: string = 123; const completed: boolean = false;');await page.locator('.study-actionbar .primary-button:visible').click();await page.locator('.study-coach:visible').waitFor();assert((await page.locator('.study-coach').innerText()).includes('type does not match'));
  await lesson('figma-frames','practice');await page.locator('#academy-code-js').fill('{ broken report');await page.locator('.study-actionbar .primary-button:visible').click();await page.locator('.study-coach:visible').waitFor();assert((await page.locator('.study-coach').innerText()).includes('JSON object'));

  await lesson('html-document','practice');await page.locator('#course-code').fill('<p>Not a complete document</p>');await page.locator('.study-actionbar .primary-button:visible').click();
  await page.locator('.study-coach:visible').waitFor();assert((await page.locator('.study-coach').innerText()).includes('<!doctype html>'));
  await page.locator('#course-code').fill('<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>My page</title></head><body><h1>Hello</h1></body></html>');
  await page.locator('.study-actionbar .primary-button:visible').click();await page.waitForFunction(()=>htmlCourse.lessons.document.completed);
  await lesson('html-document','test');assert(await page.locator('.study-recap:visible').count());assert.equal(await page.locator('.study-recap-checks [data-passed=false]:visible').count(),0);assert(await page.locator('.study-next-lesson:visible').count());
  await lesson('html-document','practice');await page.locator('#course-code').fill('<p>Changed after passing</p>');assert.equal(await page.evaluate(()=>htmlCourse.lessons.document.completed),false,'Changed HTML needs a fresh check, like other courses');
  await page.locator('#course-code').fill(await page.evaluate(()=>htmlLessons[0].solution));await page.locator('.study-actionbar .primary-button:visible').click();await page.waitForFunction(()=>htmlCourse.lessons.document.completed);

  await lesson('css-flex','practice');
  const css='/* saved while learning */\n.container { display: flex; gap: 24px; }';
  await page.locator('#academy-code-css').fill(css);
  await page.locator('.study-editor button[data-file=html]').click();
  const html=await page.locator('#academy-code-html').inputValue();
  await page.locator('.study-workbench:visible').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY+50));
  await page.evaluate(()=>rememberStudyScroll());await page.evaluate(()=>kachanStorage.flush());
  const place=await page.evaluate(()=>studyPosition());assert.equal(place.step,'practice');assert.equal(place.file,'html');
  await page.reload();await page.waitForFunction(()=>window.kachanReady);await page.waitForFunction(()=>studyPosition()?.id==='css-flex'&&learningScreen==='lesson'&&learningStep==='practice');
  await page.waitForFunction(()=>studyBody()?.querySelector('.study-editor [data-file=html]')?.getAttribute('aria-pressed')==='true');
  assert.equal(await page.locator('#academy-code-css').inputValue(),css);assert.equal(await page.locator('#academy-code-html').inputValue(),html);
  await page.locator('.sidebar a[href="#dashboard"]').click();await page.locator('.home-primary-action .primary-button').click();
  await page.waitForFunction(()=>currentLearningEntry().id==='css-flex'&&learningStep==='practice');
  await page.locator('.learning-back:visible').first().click();await page.locator('.organization-course-actions button').nth(1).click();
  assert.equal(await page.locator('.study-route-list>li').count(),6);
  assert((await page.locator('.study-route-next').innerText()).includes('Headings and text'));
  await page.locator('.study-route-list>[data-course=TypeScript] button').click();await page.waitForFunction(()=>currentLearningEntry().course==='TypeScript');

  await lesson('javascript-values','test');assert(await page.locator('.study-return-needed:visible').count());assert.equal(await page.evaluate(()=>learningDone(currentLearningEntry())),false);
  await lesson('javascript-values');await page.locator('.learning-footer-actions .primary-button:visible').click();
  await page.locator('#academy-code-js').fill(await page.evaluate(()=>studySource(currentLearningEntry()).solution.js));await page.locator('.study-actionbar .primary-button:visible').click();await page.waitForFunction(()=>academy.states['javascript-values'].practicePassed);
  await lesson('javascript-values','test');const answer=await page.evaluate(()=>studySource(currentLearningEntry()).quiz.answer);await page.locator('#academy-quiz input').nth(answer).check();await page.locator('#academy-quiz button[type=submit]').click();
  await page.waitForFunction(()=>academy.states['javascript-values'].completed);await page.locator('.study-next-lesson:visible').waitFor();
  assert.equal(await page.locator('.study-recap-checks [data-passed=false]:visible').count(),0);
  assert(await page.evaluate(()=>validExtras(extras)&&validStudyJourney(studyJourney())));
  const bad=await page.evaluate(()=>({...studyJourney(),position:{...studyPosition(),step:'unknown'}}));assert.equal(await page.evaluate(value=>validStudyJourney(value),bad),false);
  assert.equal(await page.evaluate(value=>{const data=structuredClone(extras);data.preferences.studyJourney=value;return validExtras(data)},bad),false,'Malformed resume data is rejected by backup validation');
  assert(await page.evaluate(()=>validateBackup({app:'Kachan',version:7,data:{settings,snippets,favorites,progress:savedProgress,tasks,projects,language:document.documentElement.lang,htmlCourse,notes,dashboard:dashboardData,workspace,extras,academy,personalization}})),'Saved learning position remains compatible with backups');
  await page.setViewportSize({width:1920,height:700});await lesson('html-document');
  await page.locator('.study-example:visible').evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top+60));
  await page.evaluate(()=>rememberStudyScroll());const reading=await page.evaluate(()=>studyPosition());assert.equal(reading.section,'example');
  await page.evaluate(()=>kachanStorage.flush());await page.reload();await page.waitForFunction(()=>window.kachanReady);
  await page.waitForFunction(position=>{const e=studyBody()?.querySelector('.study-example');return e&&Math.abs(e.getBoundingClientRect().top-(24-position.offset*e.getBoundingClientRect().height))<12},reading);
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.context().setOffline(true);await page.reload();await page.waitForFunction(()=>window.kachanReady&&navigator.serviceWorker.controller);
  await lesson('javascript-values');await page.locator('.study-example-actions:visible button').first().click();await page.waitForFunction(()=>studyBody().querySelector('.study-example-output')?.textContent.includes('false'));
  await page.context().setOffline(false);
  assert.deepEqual(errors,[]);console.log('PASS all '+lessons.length+' lessons in two languages, independent live examples, real TS error, Git/Figma scope, HTML feedback, exact resume/file/draft, six-track route and honest recap/completion');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
