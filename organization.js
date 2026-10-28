// Presentation groups reuse the existing courses, editors and saved records.
const organizedCopy=()=>document.documentElement.lang==='uk'?{
 courses:'Курси',practice:'Практика',reference:'Довідники',code:'Мій код',
 start:'Я зовсім новачок',route:'Порядок навчання',practiceIntro:'Закріплюй знання після уроків. Обери один проєкт або коротку вправу.',
 referenceIntro:'Матеріали для конкретного питання. Це не обов’язкова частина кожного уроку.',
 chapters:'Поглиблені теми',chaptersText:'Додаткові пояснення за технологіями.',
 referenceTitle:'Шпаргалки та приклади',referenceText:'Знайди синтаксис або готовий приклад.',
 debug:'Знайти помилку',debugText:'Короткі завдання з поступовими підказками.',
 review:'Повторити вивчене',reviewText:'Перевір себе й повернися до складних тем.',
 trace:'Розібрати виконання',traceText:'Подивись, як код працює крок за кроком.',
 portfolio:'Зібрати перший сайт',portfolioText:'Один проєкт від HTML до публікації.',
 map:'Карта знань',mapText:'Побач зв’язки між темами.',comic:'Вебкомікси',comicText:'Короткі пояснення в ілюстраціях.',
 choose:'Обери напрямок',all:'← Усі категорії',toolsIntro:'Відкрий потрібну категорію або знайди інструмент за назвою.',
 projects:'Практичні проєкти',exercises:'Короткі тренування',more:'Додаткові матеріали'
}:{courses:'Courses',practice:'Practice',reference:'Reference',code:'My code',start:'I am a complete beginner',route:'Learning order',practiceIntro:'Put lessons into practice. Choose one project or a short exercise.',referenceIntro:'Look up a specific question. These materials are optional companions to your lessons.',chapters:'Deeper topics',chaptersText:'Additional explanations by technology.',referenceTitle:'Cheatsheets and examples',referenceText:'Look up syntax or a working example.',debug:'Find a bug',debugText:'Short exercises with progressive hints.',review:'Review what you learned',reviewText:'Test yourself and revisit difficult topics.',trace:'Follow the execution',traceText:'See how code runs step by step.',portfolio:'Build your first site',portfolioText:'One project from HTML to publication.',map:'Knowledge map',mapText:'See how topics connect.',comic:'Web comics',comicText:'Short illustrated explanations.',choose:'Choose a category',all:'← All categories',toolsIntro:'Open a category or find a tool by name.',projects:'Practice projects',exercises:'Short exercises',more:'Additional materials'};

function organizationCard(title,description,action,mark='↗'){
 const card=button('',action,'organization-card');card.append(E('span','organization-mark',mark),E('strong','',title),E('span','organization-description',description));return card;
}
let organizationWindow;
function openLearningDirectory(kind){
 if(!organizationWindow){const body=E('div','organization-directory');organizationWindow={body,...utilityWindow('learning-directory-window','learning',body)};}
 const {body}=organizationWindow,c=organizedCopy(),lang=document.documentElement.lang;body.replaceChildren();
 body.append(E('h2','',kind==='route'?c.route:c.chapters));
 if(kind==='route'&&typeof renderStudyRoute==='function'){renderStudyRoute(body);organizationWindow.open();return;}
 if(kind==='route'){
  body.append(E('p','panel-note',lang==='uk'?'Починай із HTML і рухайся послідовно. TypeScript — після JavaScript; Figma можна вивчати окремо.':'Start with HTML and follow the sequence. Learn TypeScript after JavaScript; Figma is an independent track.'));
  const list=E('ol','organization-route');
  for(const [course,title,description]of journeyStages){const li=E('li'),next=learningModules().find(m=>m.id===course).lessons.find(l=>!learningDone(l))||learningModules().find(m=>m.id===course).lessons[0];li.append(organizationCard(course+' · '+title[lang==='uk'?0:1],description[lang==='uk'?0:1],()=>{organizationWindow.shut();openLesson(next.id);},'→'));list.append(li);}body.append(list);
 }else{
  for(const course of ['HTML','CSS','JavaScript','Git','TypeScript','Figma']){const fold=E('details','organization-topic');fold.append(E('summary','',course+' · '+extraChapters.filter(l=>l.course===course).length));for(const chapter of extraChapters.filter(l=>l.course===course))fold.append(button((chapterRead(chapter.id)?'✓ ':'')+chapter.title[lang],()=>{organizationWindow.shut();openChapter(chapter.id);},'chapter-link'));body.append(fold);}
 }
 organizationWindow.open();
}

function organizeLearning(){
 if(typeof learningProjects==='undefined'||!learningLibrary)return;
 Q('learning-view').dataset.reading=String(learningScreen==='lesson'&&focusedRoute().params.get('tab')!=='code');
 const c=organizedCopy(),lang=document.documentElement.lang;
 let shell=learningLibrary.querySelector('.organized-learning');
 if(!shell){shell=E('div','organized-learning');for(const id of ['courses','practice','reference']){const panel=E('section','organized-learning-panel');panel.dataset.learningPanel=id;panel.id='learning-panel-'+id;shell.append(panel);}learningLibrary.append(shell);}
 const panel=id=>shell.querySelector('[data-learning-panel='+id+']');
 const move=(selector,target)=>{const node=learningLibrary.querySelector(selector);if(node&&!target.contains(node))target.append(node);};
 for(const selector of ['.learning-library-intro','.learning-resume-banner','.learning-course-grid'])move(selector,panel('courses'));
 for(const selector of ['#beginner-start','#learning-journey','.studio-learning-entry']){move(selector,panel('courses'));const node=learningLibrary.querySelector(selector);if(node)node.hidden=true;}
 move('.learning-project-entry',panel('practice'));
 for(const selector of ['#extra-chapter-list','#content-library-entry']){move(selector,panel('reference'));const node=learningLibrary.querySelector(selector);if(node)node.hidden=true;}
 if(shell.dataset.lang!==lang){
  shell.dataset.lang=lang;for(const node of shell.querySelectorAll('.organization-generated'))node.remove();
  const welcome=E('div','organization-generated organization-course-actions');welcome.append(button(c.start,openFoundation,'secondary-button'),button(c.route,()=>openLearningDirectory('route'),'secondary-button'));panel('courses').prepend(welcome);
  const intro=E('p','organization-generated organization-intro',c.practiceIntro);panel('practice').prepend(intro);
  const exercises=E('section','organization-generated practice-exercises');exercises.append(E('h2','organization-heading',c.exercises));const rows=E('div','organization-grid');for(const [id,title,description]of [['debug',c.debug,c.debugText],['review',c.review,c.reviewText],['trace',c.trace,c.traceText]])rows.append(organizationCard(title,description,()=>openStudio(id)));exercises.append(rows);panel('practice').append(exercises);
  const reference=E('section','organization-generated');reference.append(E('p','organization-intro',c.referenceIntro));const grid=E('div','organization-grid');grid.append(organizationCard(c.chapters,c.chaptersText,()=>openLearningDirectory('chapters')),organizationCard(c.referenceTitle,c.referenceText,()=>openContent('reference')));reference.append(grid,E('h2','organization-heading',c.more));const more=E('div','organization-grid');more.append(organizationCard(c.map,c.mapText,()=>openStudio('map')),organizationCard(c.comic,c.comicText,()=>openStudio('comic')));reference.append(more);panel('reference').append(reference);
 }
 // Stable order even when an existing renderer refreshes just one entry.
 const practiceEntry=panel('practice').querySelector('.learning-project-entry');if(practiceEntry)panel('practice').querySelector('.organization-intro')?.after(practiceEntry);
 const tab=focusedRoute().params.get('tab')||'courses';for(const section of shell.children)section.hidden=section.dataset.learningPanel!==(['practice','reference'].includes(tab)?tab:'courses');
 learningLibrary.dataset.organized='true';
 for(const description of learningLibrary.querySelectorAll('.learning-course-description')){const fold=description.closest('.compact-description');if(fold)fold.replaceWith(description);}
 let desk=panel('courses').querySelector('.course-desk');
 if(!desk){desk=E('div','course-desk');desk.append(E('aside','course-desk-aside'),E('div','course-desk-list'));panel('courses').append(desk);}
 const aside=desk.querySelector('.course-desk-aside'),list=desk.querySelector('.course-desk-list');
 for(const selector of ['.learning-resume-banner','.organization-course-actions']){const node=panel('courses').querySelector(selector);if(node&&node.parentElement!==aside)aside.append(node);}
 const courseGrid=panel('courses').querySelector('.learning-course-grid');if(courseGrid&&courseGrid.parentElement!==list)list.append(courseGrid);
 organizePractice(panel('practice'));
}
window.addEventListener('kachan-ready',organizeLearning);
window.addEventListener('languagechange',()=>{organizeLearning();if(organizationWindow?.dialog.open)organizationWindow.shut();});
organizeLearning();

function organizeToolCatalog(body,input,filters,count,grid,cards){
 let categories=body.querySelector('.organization-tool-categories');
 const c=organizedCopy();
 if(!categories){
  categories=E('section','organization-tool-categories');categories.append(E('h2','organization-heading',c.choose));
  const list=E('div','organization-grid');
  for(const control of filters.children){const id=control.dataset.group;if(id==='all')continue;const amount=cards.filter(card=>card.dataset.unifiedGroup===id).length;if(!amount)continue;
   const card=organizationCard(control.textContent,(document.documentElement.lang==='uk'?'Інструментів: ':'Tools: ')+amount,()=>{control.click();body.querySelector('.unified-filters [aria-pressed=true]')?.focus({preventScroll:true});},({HTML:'</>',CSS:'{ }',JavaScript:'JS',design:'▦',learning:'≡',inspiration:'↗',utilities:'⌘'})[id]||'↗');card.dataset.categoryGroup=id;list.append(card);
  }categories.append(list);grid.before(categories);
  const back=button(c.all,()=>{input.value='';filters.querySelector('[data-group=all]').click();input.focus({preventScroll:true});},'secondary-button organization-tool-back');filters.before(back);
  body.querySelector('.unified-intro p:last-child').textContent=c.toolsIntro;
 }
 let desk=body.querySelector('.tool-results-workspace');if(!desk){desk=E('div','tool-results-workspace');const main=E('section','tool-results-main');desk.append(filters,main);main.append(count,grid,body.querySelector('.unified-empty'));body.append(desk);}
 const browsing=unifiedGroup==='all'&&!input.value.trim();categories.hidden=!browsing;desk.hidden=browsing;grid.hidden=browsing;count.hidden=browsing;filters.hidden=browsing;body.querySelector('.organization-tool-back').hidden=browsing;
}
if(toolCatalogOpen)renderUnifiedCatalog();

function organizeProjectControls(){
 const root=Q('projects-view');let toolbar=Q('project-collection-toolbar');
 if(!toolbar){toolbar=E('div','organization-collection-toolbar');toolbar.id='project-collection-toolbar';const search=root.querySelector(':scope>.search-box');if(search)search.before(toolbar);else Q('all-projects').before(toolbar);}
 const search=root.querySelector(':scope>.search-box');if(search)toolbar.append(search);
 let more=toolbar.querySelector('.project-collection-more');if(!more){more=E('details','project-collection-more quiet-options');more.append(E('summary'));toolbar.append(more);more.addEventListener('click',()=>requestAnimationFrame(updateLabel));}
 const updateLabel=()=>{more.querySelector(':scope>summary').textContent=studioText('Додатково','More options')+(Q('project-archive-toggle').classList.contains('active')?studioText(' · архів',' · archive'):'');};
 let options=more.querySelector('.project-options-body');if(!options){options=E('div','project-options-body');more.append(options);}
 for(const node of [Q('project-archive-toggle'),Q('projects-display-mode')])if(node&&node.parentElement!==options)options.append(node);
 const github=Q('github-form')?.closest('details');if(github){github.hidden=false;if(!more.contains(github))more.append(github);}
 updateLabel();
 toolbar.hidden=(focusedRoute().params.get('tab')||'overview')!=='overview';
}
organizeProjectControls();
const projectsBeforeOrganization=renderProjects;renderProjects=function(){const result=projectsBeforeOrganization();organizeProjectControls();return result;};

function simplifyLesson(body){
 if(!body)return;
 let companions=body.querySelector('.lesson-companions');
 if(!companions){companions=E('details','lesson-companions');companions.append(E('summary','',studioText('Приклади та додаткові матеріали','Examples and supporting material')));const anchor=body.querySelector('.lesson-connections,.learning-step-footer');if(anchor)anchor.before(companions);else body.append(companions);}
 for(const selector of ['.lesson-compass','.lesson-live-demo','.learning-notes-fold']){const node=body.querySelector(selector);if(node&&node.parentElement!==companions)companions.append(node);}
 companions.hidden=learningStep!=='theory';
 for(const reader of body.querySelectorAll('.beginner-lesson'))if(reader.querySelector('.example-copy'))for(const control of reader.querySelectorAll('button:not(.example-copy)'))if(control.textContent.trim()===t().copy)control.hidden=true;
}

Object.assign(translations.uk,{resourceDetails:'Деталі ресурсу'});Object.assign(translations.en,{resourceDetails:'Resource details'});
let resourceDetailsWindow,resourceDetailsRestore=()=>{};
function openResourceDetails(card){
 const more=card.querySelector('.card-more-body');if(!more)return;
 if(!resourceDetailsWindow){const body=E('div','resource-detail-content');resourceDetailsWindow={body,...utilityWindow('resource-details-window','resourceDetails',body)};resourceDetailsWindow.dialog.addEventListener('close',()=>resourceDetailsRestore());resourceDetailsWindow.dialog.addEventListener('click',event=>{if(event.target.closest('.card-more-body button'))resourceDetailsWindow.shut();},true);}
 resourceDetailsRestore();const marker=document.createComment('resource-details');more.before(marker);resourceDetailsRestore=()=>{if(marker.parentNode)marker.replaceWith(more);resourceDetailsRestore=()=>{};};
 const {body}=resourceDetailsWindow;body.replaceChildren(E('h2','',card.querySelector('.resource-card-title')?.textContent||''));
 const description=card.querySelector(':scope>.panel-note');if(description)body.append(E('p','resource-detail-description',description.textContent));
 const link=card.querySelector('a.text-link');if(link){const actions=E('div','resource-detail-actions');const open=link.cloneNode(true);open.className='primary-button';actions.append(open);body.append(actions);}body.append(more);
 const siblings=[...Q('resource-list').querySelectorAll('.resource-card')].filter(row=>!row.hidden),index=siblings.indexOf(card);
 if(index>=0&&siblings.length>1){const navigation=E('nav','resource-details-navigation');navigation.setAttribute('aria-label',studioText('Перегляд ресурсів','Browse resources'));const previous=button(studioText('← Попередній','← Previous'),()=>{openResourceDetails(siblings[index-1]);body.querySelector('.resource-details-navigation>button:not(:disabled)')?.focus({preventScroll:true});},'secondary-button'),next=button(studioText('Наступний →','Next →'),()=>{openResourceDetails(siblings[index+1]);(body.querySelector('.resource-details-navigation>button:last-child:not(:disabled)')||body.querySelector('.resource-details-navigation>button:not(:disabled)'))?.focus({preventScroll:true});},'secondary-button');previous.disabled=index===0;next.disabled=index===siblings.length-1;const count=E('span','',String(index+1)+' / '+siblings.length);count.setAttribute('role','status');count.setAttribute('aria-live','polite');count.setAttribute('aria-label',body.firstElementChild.textContent+' · '+count.textContent);navigation.append(previous,count,next);body.firstElementChild.after(navigation);}
 resourceDetailsWindow.open();body.scrollTop=0;resourceDetailsWindow.dialog.scrollTop=0;
}
function simplifyResources(){
 if(resourceDetailsWindow?.dialog.open)resourceDetailsWindow.shut();
 for(const card of Q('resource-list').querySelectorAll('.resource-card')){
  card.querySelector('.card-more')?.setAttribute('hidden','');
  const title=card.querySelector('.resource-card-title');let details=card.querySelector('.resource-details-open');
  if(!details)details=button('',()=>openResourceDetails(card),'resource-details-open quiet-title-action');
  if(title&&!title.contains(details)){const name=title.textContent;details.textContent=name;details.setAttribute('aria-label',studioText('Деталі: ','Details: ')+name);title.replaceChildren(details);}
  if(!details.isConnected){details.textContent=studioText('Деталі','Details');card.append(details);}
 }
 renderResourceDesk();
}
let resourceDeskLimit=8,resourceDeskSignature='',resourceStartWindow,resourcePendingFocus=null;
function openResourceStart(){
 if(!resourceStartWindow){const body=E('div','resource-detail-content');resourceStartWindow={body,...utilityWindow('resource-start-window','resources',body)};}
 const c=resourceGuideText(),body=resourceStartWindow.body;body.replaceChildren(E('h2','',c.start),E('p','panel-note',c.intro));
 const links=Q('resource-beginner-start')?.querySelector('.resource-start-links');if(links)body.append(links.cloneNode(true));resourceStartWindow.open();
}
function renderResourceDesk(){
 const root=Q('resource-list'),cards=[...root.querySelectorAll('.resource-card')],uk=document.documentElement.lang==='uk';
 const signature=[document.documentElement.lang,resourceFilter,Q('resource-query').value,Q('resource-collection').value,resourcePurpose,cards.map(card=>card.dataset.resourceId).join(',')].join('|');
 if(signature!==resourceDeskSignature){resourceDeskLimit=8;resourceDeskSignature=signature;}
 const nav=E('nav','resource-desk-nav');nav.setAttribute('aria-label',uk?'Тип ресурсу':'Resource type');const rows=resourceRows();
 for(const [id,title]of [['all',uk?'Усі ресурси':'All resources'],['favorites',uk?'Обране':'Saved'],...['Docs','Tools','Design','Practice'].map(id=>[id,t()[id]])]){
  const amount=id==='all'?rows.length:id==='favorites'?rows.filter(row=>favorites.includes(row.id)).length:rows.filter(row=>row.category===id).length;
  const control=button('',()=>{resourceFilter=id;resourcePurpose='all';Q('resource-collection').value='all';renderResources();root.querySelector('.resource-desk-nav-item[aria-pressed=true]')?.focus({preventScroll:true});},'resource-desk-nav-item');control.append(E('span','',title),E('small','',String(amount)));control.setAttribute('aria-pressed',String(resourceFilter===id));nav.append(control);
 }
 nav.append(button(uk?'З чого почати? ↗':'Where to start? ↗',openResourceStart,'resource-desk-start'));
 const main=E('section','resource-desk-main'),header=E('div','resource-desk-header'),heading=E('h2','',resourceFilter==='all'?(uk?'Каталог ресурсів':'Resource catalog'):resourceFilter==='favorites'?(uk?'Збережені матеріали':'Saved resources'):t()[resourceFilter]),count=E('p','resource-desk-count');count.setAttribute('role','status');count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');
 const status=E('div','resource-desk-status'),reset=button(uk?'Скинути':'Reset',()=>{resourceFilter='all';resourcePurpose='all';Q('resource-query').value='';Q('resource-collection').value='all';renderResources();Q('resource-query').focus({preventScroll:true});},'secondary-button resource-reset-filters');
 const active=cards.length>0&&(resourceFilter!=='all'||resourcePurpose!=='all'||Q('resource-query').value.trim()||Q('resource-collection').value!=='all');reset.disabled=!active;reset.classList.toggle('is-unavailable',!active);reset.setAttribute('aria-label',uk?'Скинути пошук і фільтри ресурсів':'Reset resource search and filters');status.append(count,reset);header.append(heading,status);
 const list=E('div','resource-desk-list');list.append(...cards);if(!cards.length){
  const state=E('section','catalog-empty'),filtered=!!Q('resource-query').value.trim()||Q('resource-collection').value!=='all';state.setAttribute('role','status');
  state.append(E('strong','',uk?(resourceFilter==='favorites'&&!filtered?'Тут будуть обрані ресурси':'Нічого не знайдено'):(resourceFilter==='favorites'&&!filtered?'Your saved resources will appear here':'Nothing found')),
   E('p','',uk?(resourceFilter==='favorites'&&!filtered?'Натисни зірочку біля потрібного матеріалу в каталозі.':'Спробуй коротший запит або скинь вибрану тему й категорію.'):(resourceFilter==='favorites'&&!filtered?'Use the star beside a resource to keep it here.':'Try a shorter search or reset the selected topic and category.')),
   button(uk?'Показати всі ресурси':'Show all resources',()=>{resourceFilter='all';resourcePurpose='all';Q('resource-query').value='';Q('resource-collection').value='all';renderResources();Q('resource-query').focus({preventScroll:true});},'secondary-button'));
  list.append(state);
 }
 const more=button('',event=>{const first=resourceDeskLimit;resourceDeskLimit+=8;apply();if(event.detail===0){const next=cards[first];next?.querySelector('.resource-details-open')?.focus({preventScroll:true});next?.scrollIntoView({block:'nearest',behavior:'instant'});}},'secondary-button resource-desk-more');more.setAttribute('aria-controls','resource-list');
 function apply(){cards.forEach((card,index)=>card.hidden=index>=resourceDeskLimit);const remaining=Math.max(0,cards.length-resourceDeskLimit);more.hidden=!remaining;more.textContent=uk?'Показати ще '+Math.min(8,remaining):'Show '+Math.min(8,remaining)+' more';count.textContent=(uk?'Показано ':'Showing ')+Math.min(resourceDeskLimit,cards.length)+(uk?' з ':' of ')+cards.length;}
 const columns=E('div','resource-column-head');columns.setAttribute('aria-hidden','true');for(const title of (uk?['Матеріал','Для чого','Дії','']:['Resource','Purpose','Actions','']))columns.append(E('span','',title));
 main.append(header,columns,list,more);root.classList.add('resource-desk');root.replaceChildren(nav,main);apply();
 const panel=Q('resource-query').closest('.dashboard-panel');panel.classList.add('resource-desk-search');
 const field=Q('resource-collection').closest('.form-field');field.classList.add('resource-desk-topic');
 let refinement=panel.querySelector('.resource-refinement');if(!refinement){refinement=E('details','resource-refinement quiet-options');refinement.append(E('summary'));panel.append(refinement);}if(field.parentElement!==refinement)refinement.append(field);
 const select=Q('resource-collection'),chosen=select.value!=='all';refinement.classList.toggle('has-selection',chosen);refinement.querySelector(':scope>summary').textContent=chosen?studioText('Тема: ','Topic: ')+select.selectedOptions[0].textContent:studioText('Уточнити пошук','Refine search');
 if(resourcePendingFocus){const request=resourcePendingFocus;resourcePendingFocus=null;requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const visible=[...root.querySelectorAll('.resource-card')].filter(card=>!card.hidden),active=document.activeElement,emptySearchFocus=!visible.length&&active===Q('resource-query');
  if(document.body.dataset.focusRoute!=='resources'||document.querySelector('dialog[open]')||!emptySearchFocus&&![document.body,request.origin].includes(active))return;
  const card=visible.find(card=>card.dataset.resourceId===request.id)||visible[Math.min(request.index,visible.length-1)],control=card?.querySelector('.resource-save-button')||root.querySelector('.resource-desk-nav-item[aria-pressed=true]');control?.focus({preventScroll:true});
 }));}
}
simplifyResources();
if(learningScreen==='lesson')simplifyLesson(academy.course==='HTML'?Q('html-lesson'):academyPanel.querySelector('.course-layout>section'));
Q('resource-list').addEventListener('click',event=>{const control=event.target.closest('.resource-save-button');if(!control)return;const card=control.closest('.resource-card'),visible=[...Q('resource-list').querySelectorAll('.resource-card')].filter(card=>!card.hidden);resourcePendingFocus={id:card.dataset.resourceId,index:visible.indexOf(card),origin:control};},true);

function organizePractice(panel){
 const uk=document.documentElement.lang==='uk',mode=focusedRoute().params.get('mode')==='exercises'?'exercises':'projects';
 let desk=panel.querySelector('.practice-workspace');
 if(!desk){desk=E('div','practice-workspace');desk.append(E('aside','practice-aside'),E('div','practice-main'));panel.append(desk);}
 let tabs=panel.querySelector('.practice-mode-tabs');
 if(!tabs||tabs.dataset.lang!==document.documentElement.lang){tabs?.remove();tabs=E('div','practice-mode-tabs');tabs.dataset.lang=document.documentElement.lang;tabs.setAttribute('role','group');tabs.setAttribute('aria-label',uk?'Вид практики':'Practice type');for(const [id,title]of [['projects',uk?'Проєкти':'Projects'],['exercises',uk?'Тренування':'Exercises']]){const control=button(title,()=>{location.hash='learning?tab=practice'+(id==='exercises'?'&mode=exercises':'');},'secondary-button');control.dataset.mode=id;tabs.append(control);}panel.querySelector('.organization-intro')?.after(tabs);}
 for(const control of tabs.children)control.setAttribute('aria-pressed',String(control.dataset.mode===mode));
 const aside=desk.querySelector('.practice-aside'),main=desk.querySelector('.practice-main');
 const entry=panel.querySelector('.learning-project-entry'),exercises=panel.querySelector('.practice-exercises');
 const portfolio=entry?.querySelector('.organization-portfolio');if(portfolio){aside.replaceChildren(portfolio);portfolio.classList.add('practice-portfolio-card');}
 if(entry&&entry.parentElement!==main)main.append(entry);if(exercises&&exercises.parentElement!==main)main.append(exercises);
 if(entry)entry.hidden=mode!=='projects';if(exercises)exercises.hidden=mode!=='exercises';
}

function arrangeDesktopStudy(body){
 if(!body)return;
 const toolbar=Q('learning-course-toolbar');
 if(toolbar&&!toolbar.querySelector('.desktop-outline-open')){const control=button(studioText('Зміст курсу','Course outline'),()=>{const module=learningModules().find(item=>item.id===academy.course);if(module)openLearningMap(module);},'secondary-button desktop-outline-open');toolbar.append(control);}
 const outline=toolbar?.querySelector('.desktop-outline-open');if(outline)outline.hidden=false;
 const bench=body.querySelector('.study-workbench');if(!bench)return;
 const editor=bench.querySelector('.study-editor'),result=bench.querySelector('.study-result'),actions=bench.querySelector(':scope>.study-actionbar,.study-editor>.editor-actions');
 if(actions){actions.classList.add('study-actionbar');if(bench.firstElementChild!==actions)bench.prepend(actions);const summary=actions.querySelector('.study-practice-more>summary');if(summary)summary.textContent=studioText('Підказки й дії','Hints & actions');}
 const reading=bench.querySelector('.redesign-reading-toggle'),more=actions?.querySelector('.study-practice-more');if(reading&&more){const content=more.querySelector(':scope>div');if(content&&reading.parentElement!==content)content.append(reading);}
 for(const label of editor.querySelectorAll('.exercise-editors label')){const input=Q(label.htmlFor);if(input){input.setAttribute('aria-label',label.textContent);label.hidden=true;}}
 const width=[...body.querySelectorAll(':scope>.form-field')].find(field=>field.querySelector('select')&&field.querySelector('label')?.textContent===t().previewWidth);
 if(width){width.classList.add('study-preview-width');width.hidden=false;let options=result.querySelector('.study-result-options');if(!options){options=E('details','study-result-options quiet-options');options.append(E('summary','',studioText('Параметри прев’ю','Preview options')));result.querySelector(':scope>h3')?.after(options);}options.append(width);}
 let notes=body.querySelector('.study-execution-notes');if(!notes){notes=E('details','study-execution-notes');notes.append(E('summary','',studioText('Про виконання та збереження','Execution and saving')));bench.after(notes);}
 for(const note of body.querySelectorAll(':scope>p.panel-note'))if(note.textContent===t().lessonDraft||note.textContent===t().practiceSafe){note.hidden=false;notes.append(note);}
 notes.hidden=learningStep!=='practice';
}

function arrangeDesktopTool(){
 if(toolCatalogOpen)return;
 const body=toolsView.querySelector('.tool-body'),guide=body?.querySelector('.tool-learning-guide'),presets=body?.querySelector('.tool-secondary-actions,.tool-preset-actions');
 if(!body||!guide&&!presets)return;
 let toolbar=body.querySelector('.desktop-tool-toolbar');if(!toolbar){toolbar=E('div','desktop-tool-toolbar');body.prepend(toolbar);}
 for(const node of [guide,presets])if(node&&node.parentElement!==toolbar)toolbar.append(node);
 const heading=toolsView.querySelector('.page-heading'),back=toolsView.querySelector('.tool-catalog-back');
 if(heading&&back){heading.classList.add('tool-workspace-heading');heading.append(back);}
 arrangeCodeToolWorkspace(body);
}

// Move live controls, rather than cloning them, to keep drafts and execution handlers intact.
function arrangeCodeToolWorkspace(body){
 if(!['markup','js-practice'].includes(selectedTool)||body.querySelector('.desktop-code-workspace'))return;
 const js=selectedTool==='js-practice',input=Q(js?'developer-js':'markup-code'),output=Q(js?'developer-results':'markup-results');
 if(!input||!output)return;
 const editorNode=input.closest('.code-editor-shell')||input;
 const actions=js?body.querySelector(':scope>.editor-actions'):E('div','editor-actions');
 if(!actions)return;
 const resultHeading=output.previousElementSibling?.matches('h2')?output.previousElementSibling:null;
 const frame=js?null:body.querySelector(':scope>iframe.tool-preview');
 const extra=[...body.querySelectorAll(':scope>.cheat-entry,:scope>.tool-runtime-note')];
 if(!js)for(const control of [...body.querySelectorAll(':scope>button')])actions.append(control);
 const task=body.querySelector(':scope>.practice-task'),exercise=Q('developer-exercise')?.closest('label');
 for(const heading of body.querySelectorAll(':scope>.tool-stage-title'))heading.remove();
 if(exercise&&task){const context=E('section','desktop-code-context');exercise.classList.add('practice-exercise-field');context.append(exercise,task);body.append(context);}
 const bench=E('div','desktop-code-workspace'),editor=E('section','desktop-code-editor'),result=E('section','desktop-code-result');
 actions.classList.add('desktop-code-actions');bench.append(actions,editor,result);
 editor.append(E('h2','tool-stage-title',studioText('Код','Code')),editorNode);
 if(js){const saved=[...body.querySelectorAll(':scope>p.panel-note')].find(note=>note.textContent===dc().saved);if(saved)editor.append(saved);}
 result.append(resultHeading||E('h2','tool-stage-title',studioText('Результат','Result')),output);
 if(frame)result.append(frame);
 result.append(...extra);body.append(bench);
}

if(learningScreen==='lesson')arrangeDesktopStudy(academy.course==='HTML'?Q('html-lesson'):academyPanel.querySelector('.course-layout>section'));
if(!toolCatalogOpen)arrangeDesktopTool();
