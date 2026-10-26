// One learning experience built around the existing lessons, checks and learner drafts.
const studyWords=()=>document.documentElement.lang==='uk'?{
 phases:{theory:'Пояснення',practice:'Практика',test:'Тест і підсумок'},place:'Твоє місце',resume:'Продовжити',goal:'Що ти навчишся робити',example:'Код і результат',code:'Приклад коду',result:'Результат',run:'Показати результат',edit:'Спробувати зміну в прикладі',reset:'Початковий приклад',separate:'Це тимчасовий експеримент. Збережена відповідь у практиці не змінюється.',predict:'Спочатку передбач результат, потім запусти приклад.',running:'Виконую приклад…',empty:'Код виконався без повідомлень у консолі.',recap:'Підсумок уроку',skills:'Перевір, що вже виходить',use:'Де це знадобиться',recall:'Поясни своїми словами',done:'Виконано',remaining:'Ще потрібно',passed:'Перевірки пройдено',fix:'Розберімо, що виправити',why:'Чому це сталося',next:'Що зробити зараз',technical:'Технічні деталі',back:'Повернутись до',nextLesson:'Наступний урок',route:'Твій навчальний маршрут',recommended:'Рекомендований наступний крок',optional:'Додатковий напрямок',before:'Перед цим',ready:'Можна почати',noGate:'Це підказка порядку, а не обмеження: будь-який курс можна відкрити.',simulation:'Навчальна симуляція: справжні файли Git не змінюються.',design:'Це схема макета, а не редактор Figma. Практику виконай у власному файлі; Kachan перевіряє лише звіт.',mock:'У цьому прикладі fetch повертає навчальні дані HTML/CSS; реальний мережевий запит не надсилається.'
}:{
 phases:{theory:'Explanation',practice:'Practice',test:'Quiz and recap'},place:'Your place',resume:'Continue',goal:'What you will learn to do',example:'Code and result',code:'Example code',result:'Result',run:'Show result',edit:'Try a change in the example',reset:'Original example',separate:'This temporary experiment leaves your saved practice answer unchanged.',predict:'Predict the result before running the example.',running:'Running the example…',empty:'Code ran without console output.',recap:'Lesson recap',skills:'Check what you can do',use:'Where to use this',recall:'Explain in your own words',done:'Done',remaining:'Still needed',passed:'Checks passed',fix:'Work through the problem',why:'Why this happened',next:'What to try next',technical:'Technical details',back:'Return to',nextLesson:'Next lesson',route:'Your learning route',recommended:'Recommended next step',optional:'Additional track',before:'Before this',ready:'Ready to start',noGate:'This is a suggested order, not a restriction: every course is available.',simulation:'Learning simulation: real Git files stay unchanged.',design:'This is a layout outline, not a Figma editor. Practise in your own file; Kachan checks only the report.',mock:'Here fetch returns learning data for HTML/CSS; no real network request is sent.'
};
function studyJourney(){return extras.preferences.studyJourney||{version:1,position:null};}
function studyPosition(){const position=studyJourney().position;return position&&lessonCatalog().some(l=>l.id===position.id)?position:null;}
function studySource(entry){return entry.course==='HTML'?htmlLessons.find(l=>'html-'+l.id===entry.id):academyLessonList().find(l=>l.id===entry.id);}
function studyBody(){return academy.course==='HTML'?Q('html-lesson'):academyPanel.querySelector('.course-layout>section');}
function studyAllowedFiles(entry){return entry.course==='HTML'?[]:entry.course==='CSS'?['html','css']:studySource(entry)?.kind==='source'?['html','css','js']:['js'];}
function configureStudyFiles(body,entry){
 const tabs=body.querySelector('.study-editor>.task-filters');if(!tabs)return;
 const files=studyAllowedFiles(entry);tabs.hidden=files.length<2;
 for(const control of tabs.querySelectorAll('[data-file]'))control.hidden=!files.includes(control.dataset.file);
}
let studyOpening=false,studyFrame=0,studyScrollTimer,studyResultObserver;
function saveStudyPosition(place={}){
 if(studyOpening||learningScreen!=='lesson'||document.body.dataset.focusRoute!=='learning')return;
 const entry=currentLearningEntry(),old=studyPosition(),sameLesson=old?.id===entry.id,same=sameLesson&&old.step===learningStep;
 const position={id:entry.id,step:learningStep,section:same?old.section:'',offset:same?old.offset:0,file:sameLesson?old.file:null,open:true,...place};
 if(JSON.stringify(studyJourney().position)===JSON.stringify(position))return;
 extras.preferences.studyJourney={version:1,position};persistExtras();
 updateStudyResume();
}
function updateStudyResume(){
 const position=studyPosition();let entry=position?lessonCatalog().find(l=>l.id===position.id):null;if(!entry)return;
 const resume=!learningDone(entry);if(!resume)entry=nextResumeEntry();
 const c=studyWords(),phase=resume?position.step:'theory',label=c.resume+' · '+c.phases[phase];
 const banner=learningLibrary.querySelector('.learning-resume-banner');
 if(banner){const line=banner.querySelector('.learning-resume-kicker,p'),action=banner.querySelector('button'),title=banner.querySelector('h3');if(line)line.textContent=(resume?c.place:c.recommended)+' · '+entry.course+' · '+c.phases[phase];if(action)action.textContent=label;if(title)title.textContent=entry.title[document.documentElement.lang];}
 const action=homeSurface.querySelector('.home-primary-action .primary-button'),next=homeSurface.querySelector('.home-next-label');
 if(action)action.textContent=label+' →';if(next)next.textContent=entry.course+' · '+entry.title[document.documentElement.lang];
}
const studyNextBefore=nextResumeEntry;
nextResumeEntry=function(){const position=studyPosition(),entry=position&&lessonCatalog().find(l=>l.id===position.id);return entry&&!learningDone(entry)?entry:studyNextBefore();};
const studyHomeBefore=renderHome;renderHome=function(){const result=studyHomeBefore();updateStudyResume();return result;};

function studyStepState(entry){
 const source=studySource(entry);
 if(entry.course==='HTML')return {practice:!!htmlCourse.lessons[source.id]?.completed,test:!!htmlCourse.lessons[source.id]?.completed,theory:null};
 const s=academy.states[entry.id];return {theory:!!s?.theoryRead,practice:!!s?.practicePassed,test:!!s?.quizPassed,review:!(source.project||source.manualReview)||!!s?.selfReview};
}
function renderStudyOverview(body,entry){
 const c=studyWords(),lang=document.documentElement.lang,module=learningModules().find(m=>m.id===entry.course),source=studySource(entry),index=module.lessons.findIndex(l=>l.id===entry.id);
 let overview=body.querySelector(':scope>.study-overview');if(!overview){overview=E('section','study-overview');body.querySelector('h2')?.after(overview);}
 overview.hidden=false;overview.replaceChildren(E('p','study-location',entry.course+' · '+(index+1)+' / '+module.lessons.length+' · '+c.phases[learningStep]));
 overview.dataset.lesson=entry.id;overview.dataset.step=learningStep;overview.dataset.lang=lang;
 if(learningStep==='theory'){const goal=E('details','study-goal');goal.append(E('summary','',c.goal),E('p','',source.task[lang]));overview.append(goal);}
 const tabs=body.querySelector('.lesson-step-tabs');
 if(tabs){overview.after(tabs);for(const control of tabs.querySelectorAll('[data-tab]')){const phase=control.dataset.tab;control.setAttribute('aria-label',c.phases[phase]);control.setAttribute('aria-current',phase===learningStep?'step':'false');let label=control.querySelector('.study-phase-label');if(!label){for(const node of [...control.childNodes])if(node.nodeType===3)node.remove();label=E('span','study-phase-label');control.append(label);}label.textContent=c.phases[phase];}}
 // The overview replaces a generic instruction; topic-specific teaching stays intact.
 const direction=body.querySelector('.lesson-direction');if(direction)direction.hidden=true;
}

const studyFixture={
 'css-cascade':'<article class="card"><h2 class="title">Kachan</h2><p>Selectors and inheritance</p></article>',
 'css-box':'<div class="card box">Content inside a box</div>',
 'css-units':'<main class="container"><article class="card"><h1>Responsive size</h1><p>Try changing the values.</p></article></main>',
 'css-typography':'<article><h1>Readable text</h1><p>A comfortable line length helps you follow an explanation. Try a different font size and line height.</p></article>',
 'css-flex':'<div class="row container"><div class="item box">01</div><div class="item box">02</div><div class="item box">03</div></div>',
 'css-grid':'<div class="grid"><article>01</article><article>02</article><article>03</article></div>',
 'css-responsive':'<div class="grid"><article class="card">01</article><article class="card">02</article><article class="card">03</article></div><button>Tab focus</button>',
 'css-project':'<main class="cards grid"><article class="card">Project one</article><article class="card">Project two</article><article class="card">Project three</article></main>',
 'javascript-dom':'<p id="count">0</p><button id="increment">+1</button><button id="button">Try</button><p id="output"></p>'
};
function studyExampleFiles(entry,code){
 const source=studySource(entry),base='body{font:16px/1.6 system-ui;padding:20px;color:#172536;background:#f7f9fc}button,input{font:inherit;padding:8px}article,.item,.box{border:1px solid #8da1ba;padding:12px}';
 return {html:entry.course==='HTML'?code:(studyFixture[entry.id]||source.starter?.html||'<main class="demo card"><h1 class="title">Kachan</h1><p>Example</p></main>'),css:base+'\n'+(entry.course==='CSS'?code:''),js:['JavaScript','TypeScript','Git'].includes(entry.course)?code:''};
}
function renderStudyExample(body,entry){
 const reader=body.querySelector('.beginner-lesson'),data=beginnerLessons[entry.id];if(!reader||!data)return;
 const existing=reader.querySelector('.study-example');if(existing)return;
 const c=studyWords(),lang=document.documentElement.lang,source=studySource(entry);
 const pre=reader.querySelector('pre');if(!pre)return;
 const codeNode=pre.closest('.reader-code-shell')||pre,lab=E('section','study-example'),grid=E('div','study-example-grid'),left=E('div','study-example-code'),right=E('div','study-example-result');
 if(codeNode.previousElementSibling?.matches('h3'))codeNode.previousElementSibling.classList.add('study-example-heading');
 codeNode.before(lab);left.append(E('h4','',c.code),codeNode);right.append(E('h4','',c.result));grid.append(left,right);lab.append(grid);
 const view=E('div','study-example-view'),status=E('p','study-example-status',c.predict);status.setAttribute('role','status');right.append(view,status);
 right.append(E('h4','study-original-explanation',studioText('Приклад і запропонована зміна','The example and suggested change')));
 const expected=[...reader.querySelectorAll('details.chapter-fold')].find(f=>f.querySelector('summary')?.textContent===bc().expected);
 if(expected){for(const node of [...expected.children].filter(n=>n.tagName!=='SUMMARY'))right.append(node);expected.remove();}else right.append(E('p','',data[lang][3]));
 const edit=E('details','study-example-edit'),input=E('textarea','study-example-input');input.value=data.code;input.maxLength=20000;input.spellcheck=false;input.setAttribute('aria-label',c.edit);input.rows=8;
 edit.append(E('summary','',c.edit),input,E('p','panel-note',c.separate));left.append(edit);
 const actions=E('div','study-example-actions'),run=button(c.run,execute,'secondary-button'),reset=button(c.reset,()=>{generation++;run.disabled=false;input.value=data.code;status.textContent=c.predict;view.replaceChildren();},'secondary-button');actions.append(run,reset);left.append(actions);
 let generation=0;
 input.addEventListener('input',()=>{generation++;run.disabled=false;status.textContent=c.predict;view.replaceChildren();});
 async function execute(){
  const token=++generation,code=edit.open?input.value:data.code,files=studyExampleFiles(entry,code);run.disabled=true;status.textContent=c.running;view.replaceChildren();
  try{
   if(['HTML','CSS'].includes(entry.course)){const frame=E('iframe','study-example-frame');frame.title=c.result+' · '+entry.title[lang];frame.setAttribute('sandbox','');frame.srcdoc=safePracticeDocument(files);view.append(frame);status.textContent=c.separate;return;}
   if(entry.course==='Figma'){const outline=E('pre','study-design-outline',code);view.append(outline);status.textContent=c.design;return;}
   if(entry.id==='javascript-dom'){
    const compiled=await compilePractice(code,false,true);if(token!==generation||!lab.isConnected)return;if(compiled.error)throw Error(compiled.error);
    const frame=E('iframe','study-example-frame'),nonce=crypto.randomUUID();frame.title=c.result;frame.setAttribute('sandbox','allow-scripts');
    const receive=event=>{if(event.source!==frame.contentWindow||event.data?.nonce!==nonce)return;window.removeEventListener('message',receive);if(token!==generation||!lab.isConnected)return;const error=event.data.result?.error;if(error){status.textContent=learningExplainError(error);view.append(E('p','check-fail',error));}};
    window.addEventListener('message',receive);setTimeout(()=>window.removeEventListener('message',receive),2500);
    frame.srcdoc=domDocument(files,compiled.code,nonce,false);view.append(frame);status.textContent=c.separate;return;
   }
   const result=await runAcademyPractice({...source,id:'example-'+entry.id,kind:entry.course==='TypeScript'?'typescript':source.kind,checks:[]},files,false);
   if(token!==generation||!lab.isConnected)return;
   view.append(E('pre','study-example-output',(result.output||[]).join('\n')||c.empty));
   const advice=result.error?studyFailureAdvice(entry,null,result.error):null;
   status.textContent=advice?advice.why+' '+advice.next:entry.course==='Git'?c.simulation:/\bfetch\s*\(/.test(code)?c.mock:c.separate;
   if(result.error){view.append(E('p','check-fail',result.error));status.dataset.state='error';}else delete status.dataset.state;
  }catch(error){if(token===generation&&lab.isConnected){status.textContent=learningExplainError(error.message);view.append(E('p','check-fail',error.message));}}
  finally{if(token===generation&&run.isConnected)run.disabled=false;}
 }
 lab.dataset.studySection='example';
 // Preview markup immediately; programs execute only after an explicit click.
 if(['HTML','CSS','Figma'].includes(entry.course))execute();
}
// Topic examples replace the repeated track-wide Before/After demonstration.
renderLearningDemo=function(){};

function studyFailureAdvice(entry,failed,error){
 const lang=document.documentElement.lang,uk=lang==='uk',source=studySource(entry),label=String(failed?.label||''),raw=String(error||'');
 if(raw&&entry.course==='Figma')return {why:uk?'Звіт не вдалося прочитати як JSON-об’єкт. Це помилка запису звіту, а не оцінка твого макета.':'The report could not be read as a JSON object. This concerns report syntax, not the quality of your design.',next:uk?'Почни з фігурних дужок { }. Ключі бери у подвійні лапки, між полями став кому. Числа й true/false записуй без лапок.':'Start with braces { }. Use double quotes for keys and commas between fields. Numbers and true/false have no quotes.'};
 if(raw&&entry.course==='Git'){
  if(/init first/i.test(raw))return {why:uk?'У навчальному репозиторії ще немає історії Git. Інші команди очікують, що репозиторій уже створено.':'The learning folder has not been initialized as a Git repository. Later commands expect it to exist.',next:uk?'Почни з git init у симуляторі, потім перевір стан через git status і повтори наступну команду.':'Start with git init in the simulator, inspect git status, then retry the next command.'};
  return {why:/Unsupported|Only simulated/i.test(raw)?(uk?'Цю команду навчальний симулятор не підтримує. Це не означає, що команда відсутня у справжньому Git.':'The learning simulator does not support this command. That does not mean real Git lacks it.'):(uk?'Наступна команда потребує іншого стану репозиторію: підготовлених файлів, наявної гілки або налаштованого remote.':'The next command needs another repository state: staged files, an existing branch or a configured remote.'),next:source.hints?.[0]?.[lang]||source.task[lang]};
 }
 if(raw&&/Cannot find name|not defined|ReferenceError/i.test(raw))return {why:uk?'Змінна або функція недоступна в місці використання. Можлива помилка в назві чи області видимості.':'A variable or function is unavailable at the point of use. Its name or scope may be wrong.',next:uk?'Звір написання назви з оголошенням. Перевір, у якому блоці вона створена і чи відбулося оголошення до виклику.':'Match the spelling to the declaration. Check which block owns the name and whether it was declared before use.'};
 if(raw&&entry.course==='TypeScript'&&/TS2322|TS2345|not assignable/i.test(raw))return {why:uk?'Тип переданого значення не відповідає тому, що очікує оголошення. Опис типу сам не перетворює дані.':'The value type does not match the declaration. A type annotation does not convert data.',next:uk?'Знайди перший рядок помилки. Порівняй очікуваний тип з фактичним: наприклад, "20" — текст, а 20 — число. Виправ значення або обґрунтовано уточни тип.':'Find the first error line and compare expected and actual types: "20" is text while 20 is a number. Fix the value or deliberately revise the type.'};
 if(raw&&entry.id!=='javascript-dom'&&/Cannot read properties|Cannot read property/i.test(raw))return {why:uk?'Код намагається прочитати властивість у значення null або undefined. Часто це означає, що аргумент не передали або попередній крок нічого не повернув.':'The code reads a property from null or undefined. An argument may be missing, or an earlier step may not return a value.',next:uk?'Перевір значення перед крапкою через console.log. Звір аргументи виклику та return попередньої функції; потім повтори той самий приклад.':'Inspect the value before the dot with console.log. Check call arguments and the previous function’s return, then rerun the same example.'};
 if(raw&&/is not a function/i.test(raw))return {why:uk?'Дужки виклику застосовані до значення, яке не є функцією. Назва могла бути перезаписана або вибрано не той метод.':'A call is being made on a value that is not a function. A name may have been overwritten or the wrong method selected.',next:uk?'Перевір typeof значення перед викликом і точне написання назви методу. Не викликай рядок, число чи звичайний об’єкт як функцію.':'Check typeof before the call and the method’s exact spelling. Strings, numbers and ordinary objects cannot be called as functions.'};
 if(raw)return {why:learningExplainError(raw),next:uk?'Почни з першого повідомлення. Зміни одну причину й запусти ще раз; не замінюй одразу весь код.':'Start with the first message. Fix one cause and run again; avoid replacing all your code at once.'};
 if(entry.course==='HTML'){
  const rules=[[/doctype/i,['Браузеру потрібен режим сучасного HTML.','The browser needs modern HTML mode.'],['Додай <!doctype html> перед кореневим html.','Add <!doctype html> before the root html element.']],
   [/charset|UTF|кодуван/i,['Кодування задається метаданими, а не видимим текстом.','Encoding is metadata rather than visible text.'],['Перевір meta charset="UTF-8" усередині head.','Check for meta charset="UTF-8" inside head.']],
   [/lang|мов[аи]/i,['Мова сторінки задається атрибутом кореневого елемента.','The page language belongs on the root element.'],['Перевір lang="uk" або lang="en" у відкривальному html.','Check lang="uk" or lang="en" on the opening html tag.']],
   [/title|h1|заголов/i,['Назва вкладки й головний заголовок виконують різні ролі.','The tab title and main heading have different roles.'],['Знайди title у head та h1 у body; перевір, що вони містять текст.','Find title in head and h1 in body; make sure both contain text.']],
   [/alt|зображ/i,['Зображення потребує текстової альтернативи, яка залежить від його призначення.','An image needs a text alternative that depends on its purpose.'],['Перевір alt кожного img: опис для змісту, порожній alt для декору.','Inspect each img alt: describe meaningful content, use empty alt for decoration.']],
   [/label|підпис|форм/i,['Поле та його підпис мають бути пов’язані.','An input and its label need an explicit connection.'],['Звір for у label з id поля; потім перевір вимоги type та name в умові.','Match label for to the input id, then check the task’s type and name requirements.']]];
  const match=rules.find(([pattern])=>pattern.test(label));if(match)return {why:match[1][uk?0:1],next:match[2][uk?0:1]};
 }
 if(entry.course==='CSS')return {why:/not found|не знайден/i.test(String(failed?.actual))?(uk?'Перевірка не знайшла елемент, до якого треба застосувати стиль.':'The check could not find the element that needs styling.'):(uk?'Обчислений браузером стиль відрізняється від умови. На нього впливають селектор, одиниці та каскад.':'The browser’s computed style differs from the requirement. Selectors, units and the cascade affect it.'),next:uk?'Спочатку звір class/id у HTML із селектором у CSS. Потім перевір назву властивості та її значення в невдалій умові.':'First match HTML class/id to the CSS selector. Then check the property name and value in the failed condition.'};
 if(entry.course==='Figma')return {why:uk?'Перевірка читає твій JSON-звіт, а не сам макет. Значення або тип поля не відповідає умові.':'The check reads your JSON report, not the design file. A field value or type differs from the requirement.',next:uk?'Звір ключ і тип значення: число записується без лапок, логічне значення — true або false. Після звіту окремо оглянь макет у Figma.':'Check the key and value type: numbers have no quotes and booleans use true or false. Review the actual Figma design separately.'};
 return {why:entry.course==='Git'?(uk?'Стан навчального репозиторію ще не відповідає перевірці. Порядок команд має значення.':'The simulated repository has not reached the required state. Command order matters.'):(uk?'Код запускається, але одна з умов результату не виконана. Вивід console.log і повернене значення функції — різні речі.':'The code runs but an expected result is missing. Console output and a function’s returned value are different.'),next:source.hints?.[0]?.[lang]||source.hints?.[lang]?.[0]||source.task[lang]};
}
function renderStudyFeedback(body,entry){
 const source=studySource(entry),html=entry.course==='HTML',result=html?(courseResults?{results:courseResults}:null):academyResult;
 const old=body.querySelector('.study-coach');old?.remove();if(!result||learningStep!=='practice')return;
 const failures=(result.results||[]).filter(r=>!r.passed);if(!result.error&&!failures.length)return;
 const c=studyWords(),box=E('section','study-coach');box.dataset.studySection='feedback';box.setAttribute('aria-label',c.fix);box.append(E('h3','',c.fix));
 for(const failure of (failures.length?failures:[null]).slice(0,1)){
  const advice=studyFailureAdvice(entry,failure,result.error),item=E('div','study-coach-item');
  if(failure)item.append(E('h4','',failure.label));item.append(E('strong','',c.why),E('p','',advice.why),E('strong','',c.next),E('p','',advice.next));
  if(failure?.actual!==undefined){const details=E('details');details.append(E('summary','',c.technical),E('pre','',JSON.stringify({actual:failure.actual,expected:failure.expected},null,2)));item.append(details);}box.append(item);
 }
 const resultColumn=body.querySelector('.study-result');if(resultColumn)resultColumn.append(box);
 const previous=body.querySelector('.study-feedback');if(previous)previous.hidden=true;
}
function renderStudyRecap(body,entry){
 body.querySelector('.study-recap')?.remove();if(learningStep!=='test')return;
 const c=studyWords(),lang=document.documentElement.lang,source=studySource(entry),data=beginnerLessons[entry.id],state=studyStepState(entry),recap=E('section','study-recap');recap.dataset.studySection='recap';
 recap.append(E('h3','',c.recap),E('h4','',c.skills),E('p','',source.task[lang]));
 const checks=E('ul','study-recap-checks');for(const step of ['theory','practice','test']){if(state[step]===null)continue;const row=E('li','',c.phases[step]+' · '+(state[step]?c.done:c.remaining));row.dataset.passed=String(state[step]);checks.append(row);}if(state.review===false)checks.append(E('li','',t().projectReview));recap.append(checks);
 if(data)recap.append(E('h4','',c.use),E('p','',data[lang][0]));
 const recall=lessonCases[entry.id];if(recall){const fold=E('details');fold.append(E('summary','',c.recall),E('p','',recall[lang==='uk'?0:1]));const answer=E('details');answer.append(E('summary','',plusCopy[lang].answer),E('p','',recall[lang==='uk'?2:3]));fold.append(answer);recap.append(fold);}
 const footer=body.querySelector('.learning-step-footer');footer?.before(recap);
 const actions=footer?.querySelector('.learning-footer-actions'),old=actions?.querySelector('button:last-child');if(!old)return;
 if(!learningDone(entry)){
  const needed=state.theory===false?'theory':state.practice===false?'practice':'test';
  old.replaceWith(button(c.back+' · '+c.phases[needed],()=>{learningStep=needed;arrangeLesson();requestAnimationFrame(()=>studyBody()?.querySelector(needed==='test'?'#academy-quiz,.html-test-action':needed==='practice'?'.study-workbench':'.beginner-lesson')?.scrollIntoView({block:'start'}));},'secondary-button study-return-needed'));
 }else{
  const module=learningModules().find(m=>m.id===entry.course),index=module.lessons.findIndex(l=>l.id===entry.id),order=['HTML','CSS','JavaScript','Git','TypeScript'];
  const next=module.lessons[index+1]||learningModules().filter(m=>order.indexOf(m.id)>order.indexOf(entry.course)&&order.includes(m.id)&&order.includes(entry.course)).flatMap(m=>m.lessons).find(l=>!learningDone(l));
  if(next)old.replaceWith(button(c.nextLesson+' · '+next.title[lang]+' →',()=>openLesson(next.id),'primary-button study-next-lesson'));
 }
}

function renderStudyRoute(body){
 const c=studyWords(),lang=document.documentElement.lang,order=['HTML','CSS','JavaScript','Git','TypeScript','Figma'],modules=learningModules(),recommended=modules.filter(m=>['HTML','CSS','JavaScript','Git'].includes(m.id)).flatMap(m=>m.lessons).find(l=>!learningDone(l));
 body.append(E('p','panel-note',c.noGate));
 if(recommended){const banner=E('section','study-route-next');banner.append(E('p','eyebrow',c.recommended),E('h3','',recommended.course+' · '+recommended.title[lang]),button(c.resume+' →',()=>{organizationWindow.shut();openLesson(recommended.id);},'primary-button'));body.append(banner);}
 const list=E('ol','study-route-list');
 const prerequisites={HTML:['Основи браузера й файлів','Browser and file basics'],CSS:['HTML: сторінка з текстом і посиланнями','HTML: a page with text and links'],JavaScript:['HTML і базове оформлення CSS','HTML and basic CSS styling'],Git:['Перші файли проєкту; можна вчити паралельно','Your first project files; can be learned alongside HTML'],TypeScript:['JavaScript: функції, масиви й об’єкти','JavaScript: functions, arrays and objects'],Figma:['Можна вивчати окремо','Can be studied separately']};
 for(const course of order){const module=modules.find(m=>m.id===course),done=module.lessons.filter(learningDone).length,next=module.lessons.find(l=>!learningDone(l))||module.lessons[0],row=E('li');row.dataset.course=course;row.append(E('h3','',course+(course==='TypeScript'||course==='Figma'?' · '+c.optional:'')),E('p','',learningLookCopy[lang][course.toLowerCase()]),E('p','panel-note',c.before+': '+prerequisites[course][lang==='uk'?0:1]),E('span','study-route-progress',done+' / '+module.lessons.length),button(done?c.resume:learningLookCopy[lang].start,()=>{organizationWindow.shut();openLesson(next.id);},'secondary-button'));list.append(row);}body.append(list);
}

// Keep supporting material in one disclosure while preserving the original live controls.
function simplifyStudySupport(body,entry){
 const theory=learningStep==='theory',footer=body.querySelector('.learning-step-footer');if(!footer)return;
 let support=body.querySelector(':scope>.study-support');if(!support){support=E('details','study-support');support.append(E('summary','',studioText('Матеріали до уроку','Lesson materials')));footer.before(support);}
 support.querySelector(':scope>summary').textContent=studioText('Матеріали до уроку · додатково','Lesson materials · optional');
 for(const[selector,uk,en]of [['.beginner-deeper','Додаткове пояснення й практика','Further explanation and practice'],['.lesson-companions','Приклади й нотатки','Examples and notes'],['.lesson-connections','Інструменти й ресурси','Tools and resources']]){
  const section=body.querySelector(selector);if(!section)continue;section.classList.add('study-support-section');section.open=true;section.querySelector(':scope>summary').hidden=true;
  let heading=section.querySelector(':scope>.study-support-heading');if(!heading){heading=E('h3','study-support-heading');section.querySelector(':scope>summary').after(heading);}heading.textContent=studioText(uk,en);section.hidden=selector==='.lesson-connections'?learningStep==='test':!theory;if(section.parentElement!==support)support.append(section);
 }
 const compass=support.querySelector('.lesson-compass');if(compass){compass.open=true;compass.querySelector(':scope>summary').hidden=true;}
 const read=[...body.querySelectorAll('.form-field')].find(field=>field.querySelector(':scope>input[type=checkbox]')&&field.querySelector('label')?.textContent===t().theoryRead);
 if(read){let progress=support.querySelector('.study-support-progress');if(!progress){progress=E('section','study-support-progress');progress.append(E('h3','study-support-heading',studioText('Позначка прочитання','Reading status')));support.append(progress);}progress.hidden=!theory;read.hidden=false;if(read.parentElement!==progress)progress.append(read);}
 const previous=footer.querySelector('.learning-previous');if(previous&&theory){let navigation=support.querySelector('.study-support-navigation');if(!navigation){navigation=E('div','study-support-navigation');support.append(navigation);}navigation.replaceChildren(previous);}
 support.hidden=learningStep==='test'||![...support.children].some(node=>node.tagName!=='SUMMARY'&&!node.hidden);
 if(theory){const next=footer.querySelector('.learning-footer-actions>.primary-button');if(next){const readAlready=entry.course!=='HTML'&&academy.states[entry.id]?.theoryRead;next.textContent=readAlready?studioText('До практики →','Go to practice →'):studioText('Прочитав — до практики →','Read — go to practice →');}}
}

function refreshStudyExperience(){
 studyFrame=0;updateStudyResume();if(learningScreen!=='lesson')return;
 const body=studyBody(),entry=currentLearningEntry();if(!body||!entry)return;
 body.classList.add('study-guided-reader');body.querySelector('.lesson-live-demo')?.remove();
 configureStudyFiles(body,entry);renderStudyOverview(body,entry);renderStudyExample(body,entry);renderStudyFeedback(body,entry);renderStudyRecap(body,entry);simplifyStudySupport(body,entry);
 const explanation=body.querySelector('.beginner-lesson');if(explanation)explanation.dataset.studySection='explanation';
 const practice=body.querySelector('.study-workbench');if(practice)practice.dataset.studySection='practice';
 const quiz=body.querySelector('#academy-quiz,.html-test-action');if(quiz)quiz.dataset.studySection='test';
 studyResultObserver?.disconnect();const result=body.querySelector('#course-results,#academy-results');
 if(result){studyResultObserver=new MutationObserver(()=>scheduleStudyExperience());studyResultObserver.observe(result,{childList:true,subtree:true});}
}
function scheduleStudyExperience(){if(!studyFrame)studyFrame=requestAnimationFrame(refreshStudyExperience);}
const experienceArrangeBefore=arrangeLesson;arrangeLesson=function(){experienceArrangeBefore();saveStudyPosition();scheduleStudyExperience();};
const experienceLookBefore=applyLearningLook;applyLearningLook=function(){experienceLookBefore();const position=studyPosition();if(position&&learningScreen==='library'&&position.open){extras.preferences.studyJourney={version:1,position:{...position,open:false}};persistExtras();}scheduleStudyExperience();};
const studyOpenBefore=openLesson;
openLesson=function(id){
 const position=studyPosition(),restore=position?.id===id?{...position}:null;
 const ownsRouteScroll=!!restore&&location.hash.split('?')[0]!=='#learning';
 if(ownsRouteScroll)keepRouteScroll('#learning');
 studyOpening=true;try{studyOpenBefore(id);}finally{studyOpening=false;}
 if(restore){learningStep=restore.step;arrangeLesson();}else saveStudyPosition();
 scheduleStudyExperience();
 if(restore)requestAnimationFrame(()=>{
  const body=studyBody();if(!body||currentLearningEntry().id!==id||document.body.dataset.focusRoute!=='learning')return;
  if(restore.file&&studyAllowedFiles(currentLearningEntry()).includes(restore.file)){body.querySelector('.exercise-editors')?.previousElementSibling?.querySelector('[data-file="'+restore.file+'"]')?.click();}
  const target=restore.section&&body.querySelector('[data-study-section="'+restore.section+'"]');if(target&&!target.closest('[hidden]'))scrollTo({top:scrollY+target.getBoundingClientRect().top+restore.offset*target.getBoundingClientRect().height-24,behavior:'instant'});else if(ownsRouteScroll)scrollTo({top:0,behavior:'instant'});
 });
};
function rememberStudyScroll(){
 if(learningScreen!=='lesson'||document.body.dataset.focusRoute!=='learning'||document.querySelector('dialog[open]'))return;
 const body=studyBody();if(!body)return;
 const sections=[...body.querySelectorAll('[data-study-section]')].filter(el=>el.checkVisibility()),target=sections.filter(el=>el.getBoundingClientRect().top<=64).sort((a,b)=>b.getBoundingClientRect().top-a.getBoundingClientRect().top)[0];
 const activeFile=body.querySelector('.exercise-editors')?.previousElementSibling?.querySelector('[data-file][aria-pressed=true]')?.dataset.file||null;
 saveStudyPosition({section:target?.dataset.studySection||'',offset:target?Math.max(0,Math.min(1,(24-target.getBoundingClientRect().top)/Math.max(1,target.getBoundingClientRect().height))):0,file:activeFile});
}
window.addEventListener('scroll',()=>{clearTimeout(studyScrollTimer);studyScrollTimer=setTimeout(rememberStudyScroll,400);},{passive:true});
document.addEventListener('input',event=>{if(event.target.matches('textarea.course-code'))scheduleStudyExperience();});
document.addEventListener('click',event=>{if(event.target.closest('.exercise-editors')||event.target.closest('[data-file]'))queueMicrotask(rememberStudyScroll);});
window.addEventListener('pagehide',rememberStudyScroll);
window.addEventListener('languagechange',scheduleStudyExperience);
const storedStudyPosition=studyPosition();
if(storedStudyPosition?.open&&location.hash.split('?')[0]==='#learning')openLesson(storedStudyPosition.id);else scheduleStudyExperience();
