// The complete home layout has one renderer. Decorative motion is added separately.
function homeRenderSignature(){const next=nextResumeEntry();return [document.documentElement.lang,next.id,...learningModules().map(m=>m.lessons.filter(learningDone).length),resourceRows().length,toolTabs.length].join('|');}
renderHome=function(){
 const signature=homeRenderSignature();if(homeSurface.dataset.homeSignature===signature&&homeSurface.querySelector('.home-primary-action'))return false;
 homeSurface.dataset.homeSignature=signature;homeSurface.replaceChildren();const uk=document.documentElement.lang==='uk',next=nextResumeEntry(),hero=E('div','focus-hero'),copy=E('div','home-hero-text');
 copy.append(E('p','eyebrow',uk?'ОСОБИСТА МАЙСТЕРНЯ':'YOUR PERSONAL WORKSHOP'),E('h1','',uk?'Місце для\nнаступної ідеї.':'Space for your\nnext idea.'),E('p','home-hero-description',uk?'Уроки, документація та інструменти — в одному робочому просторі.':'Lessons, documentation and tools in one workspace.'));
 const action=E('div','home-primary-action');action.append(E('span','home-next-label',next.course+' · '+next.title[document.documentElement.lang]),button(uk?'Продовжити →':'Continue →',()=>openLesson(next.id),'primary-button'));copy.append(action);const art=E('div','home-blueprint');art.setAttribute('aria-hidden','true');hero.append(copy,art);homeSurface.append(hero);
 const grid=E('div','focus-portals');for(const [route,icon]of [['resources','↗'],['learning','◫'],['tools','⌘']]){const card=E('a','focus-portal');card.href='#'+route;card.append(E('span','focus-portal-icon',icon),E('h2','',t()[route]),E('p','',fc()[route]),E('span','focus-portal-arrow','↗'));grid.append(card);}homeSurface.append(grid);return true;
};
function renderHomeQuickStart(){
 const uk=document.documentElement.lang==='uk',section=E('section','home-quick-start'),heading=E('div','home-quick-heading');heading.append(E('h2','',uk?'Швидкий старт':'Quick start'),E('p','',uk?'Обери зручний спосіб почати.':'Choose how to get started.'));section.append(heading);const actions=E('div','home-quick-actions');
 const items=[
  [uk?'Маршрут до першого сайту':'Your first website roadmap',uk?'Чотири зрозумілі кроки: від структури до публікації.':'Four clear steps, from page structure to publication.',()=>{location.hash='learning';showView();learningScreen='library';applyLearningLook();if(typeof openLearningDirectory==='function'){openLearningDirectory('route');}else{renderLearningJourney();const fold=Q('learning-journey');fold.open=true;fold.scrollIntoView({block:'start'});}}],
  [uk?'Спробувати код':'Try some code',uk?'HTML, CSS і результат поруч — експериментуй.':'HTML, CSS and a live result — experiment.',()=>openTool('playground')],
  [uk?'Почати з нуля':'Start from zero',uk?'Що таке сайт, браузер і редактор — без складних слів.':'Websites, browsers and editors, explained simply.',()=>openFoundation()]
 ];
 for(const [title,description,run]of items){const action=button(title,run,'home-quick-action');action.replaceChildren(E('span','home-quick-title',title),E('span','home-quick-description',description),E('span','home-quick-arrow','↗'));actions.append(action);}section.append(actions);homeSurface.append(section);
}
window.addEventListener('languagechange',()=>renderHome());renderHome();
