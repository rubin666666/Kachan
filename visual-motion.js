// Decorative motion has one owner and stops outside the viewport or in the background.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let scene=null;
 function createScene(host){
  const canvas=E('canvas','workspace-orbit'),context=canvas.getContext('2d');
  if(!context)return null; // Keep the existing vector if canvas is unavailable.
  host.replaceChildren(canvas);host.classList.add('home-orbit');
  for(const [route,position] of [['resources','orbit-resources'],['learning','orbit-learning'],['tools','orbit-tools']]){
   const label=E('span','orbit-label '+position);label.append(E('span','orbit-dot'),E('span','',t()[route]));host.append(label);
  }
  const points=Array.from({length:560},(_,i)=>{const y=1-2*(i+.5)/560,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5));return [Math.cos(a)*r,y,Math.sin(a)*r];});
  let width=0,height=0,frame=0,last=0,angle=.35,visible=false,disposed=false,accent='#77caff',panel='#11151c',light=false;
  let targetX=0,targetY=0,tiltX=0,tiltY=0;
  function colors(){const style=getComputedStyle(host);accent=style.color;panel=style.getPropertyValue('--panel').trim()||'#11151c';light=document.body.dataset.theme==='light';}
  function project(point){const ca=Math.cos(angle+tiltX),sa=Math.sin(angle+tiltX),cb=Math.cos(-.22+tiltY),sb=Math.sin(-.22+tiltY);const x=point[0]*ca+point[2]*sa,z=point[2]*ca-point[0]*sa,y=point[1]*cb-z*sb,depth=z*cb+point[1]*sb;const r=Math.min(width*.35,height*.4),perspective=1+depth*.1;return {x:width*.51+x*r*perspective,y:height*.49+y*r*perspective,z:depth};}
  function dot(x,y,r,alpha){context.globalAlpha=alpha;context.beginPath();context.arc(x,y,r,0,Math.PI*2);context.fill();}
  function paint(){
   if(disposed||!width)return;context.clearRect(0,0,width,height);context.fillStyle=accent;context.strokeStyle=accent;
   const radius=Math.min(width*.35,height*.4),cx=width*.51,cy=height*.49;
   const glow=context.createRadialGradient(cx,cy,radius*.3,cx,cy,radius*1.45);glow.addColorStop(0,panel);glow.addColorStop(.68,accent);glow.addColorStop(1,'transparent');context.globalAlpha=light?.055:.07;context.fillStyle=glow;context.fillRect(0,0,width,height);context.fillStyle=accent;
   // A sparse spherical point cloud gives depth without loading images or a 3D library.
   for(const point of points){const p=project(point);dot(p.x,p.y,p.z>0?1.25:.8,(p.z+1)*.26+.08);}
   for(const [index,tilt] of [[0,-.4],[1,.7]]){
    context.beginPath();for(let i=0;i<=100;i++){const a=i/100*Math.PI*2,p=project([Math.cos(a)*1.12,Math.sin(a)*Math.sin(tilt),Math.sin(a)*Math.cos(tilt)]);if(i===0)context.moveTo(p.x,p.y);else context.lineTo(p.x,p.y);}context.globalAlpha=.22;context.lineWidth=1;context.stroke();
    for(let j=0;j<3;j++){const a=angle*(index?-.8:1.2)+j*Math.PI*2/3,p=project([Math.cos(a)*1.12,Math.sin(a)*Math.sin(tilt),Math.sin(a)*Math.cos(tilt)]);dot(p.x,p.y,3,.9);dot(p.x,p.y,8,.08);}
   }
   context.globalAlpha=.9;context.font='500 '+Math.max(20,width*.08)+'px monospace';context.textAlign='center';context.textBaseline='middle';context.fillText('</>',cx,cy);context.globalAlpha=1;
  }
  function tick(time){frame=0;if(!allowed())return;const delta=last?Math.min(time-last,48):0;last=time;angle+=delta*.00009;tiltX+=(targetX-tiltX)*.065;tiltY+=(targetY-tiltY)*.065;paint();frame=requestAnimationFrame(tick);}
  function allowed(){return !disposed&&visible&&!document.hidden&&!reduce.matches&&host.isConnected&&!host.closest('[hidden]');}
  function sync(){if(frame){cancelAnimationFrame(frame);frame=0;}last=0;host.dataset.motionState=allowed()?'running':'paused';paint();if(allowed())frame=requestAnimationFrame(tick);}
  function resize(){const r=host.getBoundingClientRect();width=r.width;height=r.height;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);paint();}
  function pointer(event){if(!fine.matches||reduce.matches)return;const r=host.getBoundingClientRect();targetX=(event.clientX-r.left-r.width/2)/r.width*.35;targetY=(event.clientY-r.top-r.height/2)/r.height*.25;}
  function leave(){targetX=targetY=0;}
  const resizeObserver=new ResizeObserver(resize),intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});
  const themeObserver=new MutationObserver(()=>{colors();paint();});
  resizeObserver.observe(host);intersection.observe(host);themeObserver.observe(document.body,{attributes:true,attributeFilter:['data-theme','data-accent','style']});themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-accent','style']});
  host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);colors();resize();sync();
  return {sync,destroy(){disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();intersection.disconnect();themeObserver.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);}};
 }
 const before=renderHome;
 renderHome=function(){scene?.destroy();scene=null;before();const heading=homeSurface.querySelector('.home-hero-text h1');if(heading){const text=heading.textContent,index=text.lastIndexOf(' ');if(index>0)heading.replaceChildren(document.createTextNode(text.slice(0,index+1)),E('span','home-title-accent',text.slice(index+1)));}const host=homeSurface.querySelector('.home-blueprint');if(host)scene=createScene(host);decorateHomePortals();};
 document.addEventListener('visibilitychange',()=>scene?.sync());window.addEventListener('hashchange',()=>requestAnimationFrame(()=>scene?.sync()));window.addEventListener('languagechange',()=>renderHome());reduce.addEventListener('change',()=>scene?.sync());
 renderHome();

 // Keep the navigation's visual language and existing controls.
 const toolCaptions={
  playground:['Код і живий перегляд','Code and live preview'],reviews:['Власні розбори сайтів','Your website reviews'],ideas:['Ідея для наступного проєкту','Your next project idea'],cheats:['Синтаксис під рукою','Syntax at a glance'],lab:['Експерименти зі стилями','Experiment with styles'],json:['Форматування й перевірка даних','Format and validate data'],text:['Перетворення тексту й адрес','Transform text and URLs'],grid:['Колонки, рядки й готовий CSS','Columns, rows and CSS'],flex:['Розташування елементів','Arrange your elements'],paint:['Градієнти, тіні та CSS','Gradients, shadows and CSS'],form:['Збери форму й отримай HTML','Build a form and get HTML'],markup:['Знайди помилки в HTML','Find mistakes in HTML'],'js-practice':['Вправи з перевіркою результату','Exercises with result checks']
 };
 const sectionPaths={resources:'M14 4h6v6 M20 4 10 14 M20 14v6H4V4h6',learning:'M12 5v15 M12 5C9 3 5 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-6-1-9 1',tools:'M9 9h6v6H9z M9 9H6a3 3 0 1 1 3-3v3 M15 9V6a3 3 0 1 1 3 3h-3 M15 15h3a3 3 0 1 1-3 3v-3 M9 15v3a3 3 0 1 1-3-3h3',projects:'M3 7V4h6l2 3h10v13H3z',profile:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-3a8 8 0 0 1 16 0v3',settings:'M4 7h16 M4 17h16 M8 4v6 M16 14v6'};
 const categoryPaths=['M5 3h10l4 4v14H5z M14 3v5h5 M8 12h8 M8 16h6','M4 5h6v4h4V5h6v6h-4v4h4v5h-6v-4h-4v4H4v-5h4v-4H4z','M4 20 20 4 M4 4h6v6H4z M14 14h6v6h-6z','M5 18v3h3L20 9l-3-3z M14 9l3 3'];
 const highlightedCode=new WeakMap();
 function highlightExample(pre){
  const target=pre.querySelector(':scope>code')||pre,source=target.textContent;
  if(source.length>30000||pre.querySelector('button,input,textarea,a')||highlightedCode.get(target)===source)return;
  const language=/<\/?[a-z][\w-]*(?:\s|>)/i.test(source)?'HTML':/\b(?:const|let|function|return|console)\b|=>/.test(source)?'JavaScript':/[\w-]+\s*:[^\n]+[;}]|[.#][\w-]+\s*\{/.test(source)?'CSS':null;
  if(!language)return;highlightedCode.set(target,source);
  const tokens=/(<!--[^]*?-->|\/\*[^]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|<\/?[\w-]+|\b(?:const|let|var|function|return|if|else|for|while|class|new|true|false|null|undefined|async|await|import|export|from|interface|type)\b|\b[\w-]+(?=\s*:)|\b\d+(?:\.\d+)?\b)/g;
  const fragment=document.createDocumentFragment();let last=0;
  for(const match of source.matchAll(tokens)){if(match.index>last)fragment.append(document.createTextNode(source.slice(last,match.index)));const value=match[0],kind=/^(<!--|\/\*|\/\/)/.test(value)?'comment':/^["'`]/.test(value)?'string':/^\d/.test(value)?'number':'keyword';fragment.append(E('span','code-token code-token-'+kind,value));last=match.index+value.length;}
  fragment.append(document.createTextNode(source.slice(last)));target.replaceChildren(fragment);pre.classList.add('reader-code-block');pre.dataset.codeLanguage=language;
 }
 function updateRange(input){const min=Number(input.min||0),max=Number(input.max||100),value=Number(input.value),fill=max>min?Math.min(100,Math.max(0,(value-min)/(max-min)*100)):0;input.style.setProperty('--range-fill',fill+'%');}
 function exampleActions(pre){
  if(pre.parentElement.classList.contains('reader-code-shell'))return;
  const uk=document.documentElement.lang==='uk',shell=E('div','reader-code-shell'),bar=E('div','reader-code-toolbar'),language=E('span','reader-code-language',pre.dataset.codeLanguage||'Code');
  const previous=pre.previousElementSibling,next=pre.nextElementSibling;previous?.matches('.learning-copy')&&previous.remove();if(next?.matches('button')&&next.textContent===t().copy)next.remove();
  const copy=button(uk?'Копіювати':'Copy',async()=>{const target=pre.querySelector(':scope>code')||pre;try{await navigator.clipboard.writeText(target.textContent);notice(t().copied);}catch{const range=document.createRange();range.selectNodeContents(target);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);notice(t().copyError);}},'example-copy');
  copy.classList.add('example-copy');copy.textContent=uk?'Копіювати':'Copy';copy.prepend(smallIcon('M9 9h11v11H9z M15 9V4H4v11h5'));
  const wrap=button(uk?'Перенос рядків':'Wrap lines',()=>{const active=shell.classList.toggle('code-lines-wrapped');wrap.setAttribute('aria-pressed',String(active));},'example-wrap');wrap.setAttribute('aria-pressed','false');
  bar.append(language,wrap,copy);pre.before(shell);shell.append(bar,pre);
 }
 document.addEventListener('input',event=>{if(event.target.matches('input[type=range]'))updateRange(event.target);},{passive:true});
 function smallIcon(path){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.5');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');const line=document.createElementNS(svg.namespaceURI,'path');line.setAttribute('d',path);svg.append(line);return svg;}
 function decorateHomePortals(){
  const uk=document.documentElement.lang==='uk',items={resources:{value:resourceRows().length,label:uk?'матеріалів':'resources',path:'M10 19h35v30H10z M20 12h35v30 M30 5h35v30 M16 27h21 M16 34h15 M16 41h18'},learning:{value:learningModules().reduce((n,m)=>n+m.lessons.length,0),label:uk?'уроків':'lessons',path:'M7 40h13v-9h13V20h14V9h20 M7 46h13 M33 37h14 M53 27h14 M58 9l9 0 0 9'},tools:{value:toolTabs.length,label:uk?'інструментів':'tools',path:'M9 9h24v16H9z M43 9h24v16H43z M9 35h24v16H9z M43 35h24v16H43z M17 17h8 M51 17h8 M17 43h8 M51 43h8'}};
  for(const card of homeSurface.querySelectorAll('.focus-portal')){const item=items[card.hash.slice(1)];if(!item)continue;
   const icon=card.querySelector('.focus-portal-icon');if(icon){icon.textContent='';icon.setAttribute('aria-hidden','true');const drawing=smallIcon(item.path);drawing.setAttribute('viewBox','0 0 78 58');drawing.classList.add('portal-diagram');icon.append(drawing);}
   const metric=E('span','portal-metric');metric.append(E('strong','',String(item.value)),document.createTextNode(' '+item.label));card.append(metric);
  }
 }
 function enhanceToolEditor(input){
  if(input.parentElement.classList.contains('code-editor-shell'))return;
  const uk=document.documentElement.lang==='uk',shell=E('div','code-editor-shell'),bar=E('div','code-editor-toolbar'),status=E('div','code-editor-status'),size=E('span'),position=E('span');
  const language=input.id==='developer-js'?'JavaScript':input.id==='markup-code'?'HTML':input.id==='playground-code'?({html:'HTML',css:'CSS',js:'JavaScript'})[playgroundFile]:(input.getAttribute('aria-label')||'Code');
  const wrap=button(uk?'Перенос рядків':'Wrap lines',()=>{const active=shell.classList.toggle('editor-lines-wrapped');input.wrap=active?'soft':'off';wrap.setAttribute('aria-pressed',String(active));},'editor-wrap');wrap.setAttribute('aria-pressed','false');wrap.setAttribute('aria-controls',input.id);
  const expand=button(uk?'Більше місця':'Expand',()=>{const active=shell.classList.toggle('editor-expanded');expand.textContent=active?(uk?'Компактно':'Compact'):(uk?'Більше місця':'Expand');expand.setAttribute('aria-pressed',String(active));},'editor-expand');expand.setAttribute('aria-pressed','false');expand.setAttribute('aria-controls',input.id);
  bar.append(E('span','code-editor-language',language),wrap,expand);status.append(size,position);const hint=E('span','code-editor-shortcut',(navigator.platform.includes('Mac')?'⌘':'Ctrl')+' + Enter');hint.title=uk?'Запустити або перевірити код':'Run or check code';status.append(hint);
  function update(){const value=input.value,selection=value.slice(0,input.selectionStart),lines=value.split('\n').length,row=selection.split('\n').length,column=selection.length-selection.lastIndexOf('\n'),summary=lines+(uk?' рядків · ':' lines · ')+Array.from(value).length+(uk?' символів':' characters'),caret=(uk?'Рядок ':'Ln ')+row+' · '+(uk?'Позиція ':'Col ')+column;if(size.textContent!==summary)size.textContent=summary;if(position.textContent!==caret)position.textContent=caret;}
  input.wrap='off';input.before(shell);shell.append(bar,input,status);for(const event of ['input','keyup','click','select'])input.addEventListener(event,update);update();
 }
 function refineInlineCode(paragraph){
  if(paragraph.children.length)return;const source=paragraph.textContent,tokens=/<\/?[a-z][\w-]*(?:\s[^<>]{0,100})?>|\b(?:console\.(?:log|error)|document\.(?:querySelector|getElementById)|addEventListener|return|const|let|undefined|NaN)\b/gi;
  const matches=[...source.matchAll(tokens)];if(!matches.length)return;const fragment=document.createDocumentFragment();let last=0;for(const match of matches){fragment.append(document.createTextNode(source.slice(last,match.index)),E('code','reader-inline-code',match[0]));last=match.index+match[0].length;}fragment.append(document.createTextNode(source.slice(last)));paragraph.replaceChildren(fragment);
 }
 function refineChapterNavigation(){
  const reader=document.querySelector('#chapter-window .chapter-reader');if(!reader||!reader.children.length)return;
  let nav=reader.querySelector('.chapter-section-nav');if(!nav){const sections=[reader.querySelector(':scope>section'),reader.querySelector(':scope>details.chapter-fold'),[...reader.querySelectorAll(':scope>section')][1],reader.querySelector('.chapter-quiz')];if(sections.some(section=>!section))return;
   const uk=document.documentElement.lang==='uk',labels=uk?['Пояснення','Приклад','Практика','Перевір себе']:['Explanation','Example','Practice','Self-check'];nav=E('nav','chapter-section-nav');nav.setAttribute('aria-label',uk?'Розділи уроку':'Lesson sections');
   sections.forEach((section,index)=>{section.id='chapter-section-'+index;const control=button(labels[index],()=>{if(section.matches('details'))section.open=true;const dialog=reader.closest('dialog'),offset=dialog.querySelector('.editor-window-header').getBoundingClientRect().height+nav.getBoundingClientRect().height+20;dialog.scrollTo({top:dialog.scrollTop+section.getBoundingClientRect().top-dialog.getBoundingClientRect().top-offset,behavior:reduce.matches?'instant':'smooth'});},'chapter-section-link');control.setAttribute('aria-controls',section.id);if(!index)control.setAttribute('aria-current','location');nav.append(control);});reader.querySelector('h2').after(nav);
  }
 }
 let chapterScrollFrame=0;const chapterDialog=document.getElementById('chapter-window');new ResizeObserver(entries=>{chapterDialog.style.setProperty('--chapter-header-height',entries[0].target.getBoundingClientRect().height+'px');}).observe(chapterDialog.querySelector('.editor-window-header'));chapterDialog.addEventListener('scroll',()=>{if(chapterScrollFrame)return;chapterScrollFrame=requestAnimationFrame(()=>{chapterScrollFrame=0;const nav=chapterDialog.querySelector('.chapter-section-nav');if(!nav)return;const line=nav.getBoundingClientRect().bottom+30,controls=[...nav.children];let active=0;controls.forEach((control,index)=>{const target=document.getElementById(control.getAttribute('aria-controls'));if(target?.getBoundingClientRect().top<=line)active=index;});controls.forEach((control,index)=>{if(index===active)control.setAttribute('aria-current','location');else control.removeAttribute('aria-current');});});},{passive:true});
 document.addEventListener('keydown',event=>{if(event.key!=='Enter'||!(event.ctrlKey||event.metaKey)||event.altKey||event.shiftKey||event.repeat||!event.target.matches('.tool-body textarea.tool-code-editor'))return;const run=event.target.closest('.tool-body')?.querySelector('button.primary-button');if(!run)return;event.preventDefault();if(!run.disabled)run.click();});
 function refineSurfaces(){
  for(const route of ['resources','learning','tools','projects','profile','settings']){
   const heading=Q(route+'-view')?.querySelector(':scope>.page-heading'),title=heading?.querySelector('h1');if(!title||heading.querySelector('.section-emblem'))continue;
   const emblem=E('span','section-emblem');emblem.setAttribute('aria-hidden','true');emblem.append(smallIcon(sectionPaths[route]));
   if(title.parentElement.classList.contains('title-with-help'))title.before(emblem);else{const identity=E('div','section-identity');title.before(identity);identity.append(emblem,title);}
   heading.classList.add('section-heading-surface');
  }
  const uk=document.documentElement.lang==='uk';
  for(const state of document.querySelectorAll('.content .empty-state-refined,.content .profile-skills-empty')){if(state.querySelector('.empty-state-emblem'))continue;const mark=E('span','empty-state-emblem');mark.setAttribute('aria-hidden','true');mark.append(smallIcon('M4 5h16v14H4z M4 12h5l2 3h2l2-3h5 M9 8h6'));state.prepend(mark);}
  for(const card of Q('resources-view').querySelectorAll('.resource-card')){
   if(card.querySelector('.resource-save-button'))continue;
   const control=[...card.querySelectorAll('button')].find(b=>b.textContent===t().favorite||b.textContent===t().unfavorite),title=card.querySelector('.title-with-help')||card.querySelector('h2,h3,h4');if(!control||!title)continue;
   const saved=favorites.includes(card.dataset.resourceId),name=title.querySelector('h2,h3,h4')?.textContent||title.textContent;
   control.className='resource-save-button';control.setAttribute('aria-label',(saved?t().unfavorite:t().favorite)+' · '+name);control.setAttribute('aria-pressed',String(saved));control.title=saved?t().unfavorite:t().favorite;
   control.replaceChildren(smallIcon('m12 3 2.8 5.7 6.3.9-4.55 4.43 1.07 6.27L12 17.34l-5.62 2.96 1.07-6.27L2.9 9.6l6.3-.9L12 3Z'));
   title.after(control);card.querySelector('.resource-favorite-mark')?.remove();
  }
  for(const card of Q('learning-view').querySelectorAll('.learning-course-card')){
   if(card.querySelector('.course-card-actions'))continue;const start=card.querySelector('.learning-course-start'),outline=card.querySelector('.learning-outline');if(!start||!outline)continue;
   const actions=E('div','course-card-actions');start.before(actions);actions.append(start,outline);
  }
  for(const [index,card] of [...Q('tools-view').querySelectorAll('.tool-catalog-card')].entries()){
   const id=toolTabs[index]?.[0],copy=toolCaptions[id],label=card.querySelector('.tool-guide-label');if(copy&&label&&!card.querySelector('.tool-card-caption'))label.append(E('span','tool-card-caption',copy[uk?0:1]));
   if(!card.querySelector('.tool-open-arrow')){const arrow=E('span','tool-open-arrow','↗');arrow.setAttribute('aria-hidden','true');card.append(arrow);}
  }
  for(const group of Q('resources-view').querySelectorAll('.resource-type-group')){
   const index=['Docs','Tools','Design','Practice'].indexOf(group.id.replace('resource-type-','')),summary=group.querySelector(':scope>summary');if(index<0||!summary||summary.querySelector('.resource-category-icon'))continue;const mark=E('span','resource-category-icon');mark.setAttribute('aria-hidden','true');mark.append(smallIcon(categoryPaths[index]));summary.prepend(mark);
  }
  for(const tabs of Q('learning-view').querySelectorAll('.lesson-step-tabs'))for(const [index,control] of [...tabs.querySelectorAll('button')].entries()){if(control.querySelector('.lesson-tab-number,.learning-step-dot'))continue;const number=E('span','lesson-tab-number',String(index+1).padStart(2,'0'));number.setAttribute('aria-hidden','true');control.prepend(number);}
  for(const pre of document.querySelectorAll('#learning-view .learning-reader pre,.chapter-reader pre')){highlightExample(pre);if(pre.classList.contains('reader-code-block'))exampleActions(pre);}
  for(const paragraph of document.querySelectorAll('.beginner-lesson p,.chapter-reader p,.foundation-reader p'))refineInlineCode(paragraph);
  refineChapterNavigation();
  for(const input of document.querySelectorAll('.content input[type=range],dialog input[type=range]'))updateRange(input);
  for(const input of Q('tools-view').querySelectorAll('.tool-body textarea.tool-code-editor:not([readonly])'))enhanceToolEditor(input);
  const exercise=Q('developer-exercise');if(exercise){const label=exercise.closest('label');if(label?.firstChild?.nodeType===3)label.firstChild.textContent=uk?'Вправа':'Exercise';label?.classList.add('practice-exercise-field');
   const body=exercise.closest('.tool-body'),note=[...body.querySelectorAll(':scope>p.panel-note')].find(p=>p.textContent===dc().sandbox);if(note){const fold=E('details','tool-runtime-note');fold.append(E('summary','',uk?'Про середовище запуску':'About the runtime'));note.before(fold);fold.append(note);}
  }
 }
 let surfaceFrame=0;
 function scheduleSurfaces(){if(surfaceFrame)return;surfaceFrame=requestAnimationFrame(()=>{surfaceFrame=0;refineSurfaces();});}
 refineSurfaces();window.addEventListener('languagechange',scheduleSurfaces);window.addEventListener('hashchange',scheduleSurfaces);
 document.addEventListener('click',event=>{const control=event.target.closest('.resource-save-button');if(!control)return;const id=control.closest('.resource-card').dataset.resourceId,openGroups=[...Q('resource-list').querySelectorAll('.resource-type-group[open]')].map(group=>group.id);requestAnimationFrame(()=>{for(const id of openGroups){const group=document.getElementById(id);if(group)group.open=true;}refineSurfaces();const replacement=[...Q('resource-list').querySelectorAll('.resource-card')].find(card=>card.dataset.resourceId===id)?.querySelector('.resource-save-button');if(replacement)replacement.focus({preventScroll:true});else Q('resource-query')?.focus({preventScroll:true});});},true);

 // Pointer light follows only interactive cards, without moving their text or hit areas.
 const cards='.focus-portal,.home-quick-action,.tool-catalog-card,.learning-course-card,.resource-card,.project-card';
 let litCard=null,pointerFrame=0,pointerEvent=null;
 function clearLight(){if(litCard){litCard.classList.remove('pointer-lit');litCard.style.removeProperty('--pointer-x');litCard.style.removeProperty('--pointer-y');litCard=null;}}
 Q('main-content').addEventListener('pointermove',event=>{if(!fine.matches||reduce.matches)return;pointerEvent={target:event.target,x:event.clientX,y:event.clientY};if(pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const card=pointerEvent.target.closest(cards);if(card!==litCard)clearLight();if(!card)return;litCard=card;const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',pointerEvent.x-r.left+'px');card.style.setProperty('--pointer-y',pointerEvent.y-r.top+'px');card.classList.add('pointer-lit');});},{passive:true});
 Q('main-content').addEventListener('pointerleave',clearLight);window.addEventListener('hashchange',clearLight);reduce.addEventListener('change',clearLight);fine.addEventListener('change',clearLight);

 // Transform-only stagger: contents remain readable throughout navigation and scroll.
 const seen=new WeakSet();let routeEpoch=0,lastRoute='',entering=false;
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){const el=entry.target;if(!entry.isIntersecting||el.closest('[hidden]'))continue;observer.unobserve(el);if(seen.has(el))continue;seen.add(el);if(!reduce.matches){const siblings=[...el.parentElement.children].filter(e=>e.matches(cards)),index=siblings.indexOf(el);playMotion(el,[{translate:'0 12px'},{translate:'0 0'}],{duration:420,delay:Math.min(Math.max(index,0)*45,180)});}}},{threshold:.12});
 function register(root){for(const el of root.querySelectorAll(cards))if(!seen.has(el))observer.observe(el);}
 function newRoute(){const route=(location.hash.slice(1)||'dashboard').split('?')[0];if(route===lastRoute)return;lastRoute=route;entering=true;const epoch=++routeEpoch;requestAnimationFrame(()=>{if(epoch===routeEpoch){register(Q('main-content'));entering=false;}});}
 const tree=new MutationObserver(records=>{scheduleSurfaces();for(const record of records){for(const node of record.removedNodes)if(node.nodeType===1){observer.unobserve(node);node.querySelectorAll(cards).forEach(el=>observer.unobserve(el));}for(const node of record.addedNodes)if(node.nodeType===1){const els=[...(node.matches(cards)?[node]:[]),...node.querySelectorAll(cards)];for(const el of els){const rect=el.getBoundingClientRect();if(!entering&&rect.top<innerHeight&&rect.bottom>0){seen.add(el);}else if(!seen.has(el))observer.observe(el);}}}});
 tree.observe(Q('main-content'),{childList:true,subtree:true});window.addEventListener('hashchange',newRoute);window.addEventListener('kachan-ready',newRoute);newRoute();
 tree.observe(chapterBody,{childList:true,subtree:true});tree.observe(foundationBody,{childList:true,subtree:true});
})();
