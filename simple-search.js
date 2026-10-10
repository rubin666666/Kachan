const simpleSearchCopy={uk:{search:'Пошук…',resources:'Знайти ресурс…',projects:'Знайти проєкт…',tasks:'Знайти задачу…',notes:'Знайти нотатку…',snippets:'Знайти код…',tools:'Знайти інструмент…',hint:'Введи назву або слово — пошук знайде матеріали на сайті.',filters:'Тема',clear:'Очистити пошук'},en:{search:'Search…',resources:'Find a resource…',projects:'Find a project…',tasks:'Find a task…',notes:'Find a note…',snippets:'Find code…',tools:'Find a tool…',hint:'Type a name or a word to find content across the site.',filters:'Topic',clear:'Clear search'}};
const ss=()=>simpleSearchCopy[document.documentElement.lang];
const resourceTopicFold=E('details','simple-search-filters'),resourceTopicSummary=E('summary');resourceTopicFold.append(resourceTopicSummary,Q('resource-collection').closest('.form-field'));Q('resource-query').closest('.dashboard-panel').append(resourceTopicFold);
function simplifySearchFields(){
 resourceTopicSummary.textContent=ss().filters+(Q('resource-collection').value!=='all'?' · '+Q('resource-collection').selectedOptions[0]?.textContent:'');
 for(const [id,key] of [['resource-query','resources'],['projects-search','projects'],['tasks-search','tasks'],['notes-search','notes'],['snippets-search','snippets'],['tool-catalog-search','tools']]){
  const input=Q(id);if(!input)continue;input.placeholder=ss()[key];const label=document.querySelector(`label[for="${id}"]`);label?.classList.add('simple-search-label');
  const box=input.closest('.search-box');if(box)box.classList.add('simple-search-box');
  let clear=input.parentElement.querySelector('[data-simple-clear]')||input.parentElement.querySelector('[data-clear-search]')||(id==='tool-catalog-search'?input.parentElement.querySelector('button'):null);
  if(!clear){clear=button('×',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();});clear.dataset.simpleClear=id;input.after(clear);input.parentElement.classList.add('simple-search-row');}
  clear.textContent='×';clear.setAttribute('aria-label',ss().clear);clear.title=ss().clear;clear.hidden=!input.value;
  if(!input.dataset.simpleBound){input.dataset.simpleBound='true';input.addEventListener('input',()=>{clear.hidden=!input.value;});}
 }
}
Q('resource-collection').addEventListener('change',simplifySearchFields);
openSearch=function(){
 if(searchDialog.open)return;priorFocus=document.activeElement;searchDialog.replaceChildren();
 const title=E('h2','',t().shortSearch);title.id='command-title';searchDialog.setAttribute('aria-labelledby',title.id);
 const input=E('input');input.id='global-query';input.type='search';input.maxLength=200;input.placeholder=ss().search;input.setAttribute('aria-label',t().shortSearch);
 const results=E('div','command-results'),hint=E('p','panel-note',ss().hint);hint.setAttribute('role','status');
 const close=button('×',()=>searchDialog.close(),'simple-search-close');close.setAttribute('aria-label',t().close);
 const resultCount=E('p','search-result-count');resultCount.setAttribute('role','status');resultCount.setAttribute('aria-live','polite');resultCount.setAttribute('aria-atomic','true');
 function render(){results.replaceChildren();const query=input.value.trim().toLocaleLowerCase();const words=query.split(/\s+/).filter(Boolean);hint.hidden=!!query;
  const items=query?searchItems().filter(item=>!item.command&&(item.id||toolTabs.some(([,key])=>t()[key]===item.name))).filter(item=>words.every(word=>[item.name,item.body||''].join(' ').toLocaleLowerCase().includes(word))).sort((a,b)=>Number(b.name.toLocaleLowerCase().includes(query))-Number(a.name.toLocaleLowerCase().includes(query))):['resources','learning','tools','projects'].map(kind=>({name:t()[kind],kind,command:true}));
  resultCount.textContent=query?(document.documentElement.lang==='uk'?'Результатів: ':'Results: ')+items.length+(items.length>20?(document.documentElement.lang==='uk'?' · Показано перші 20':' · Showing first 20'):''):'';
  if(!items.length)results.append(E('p','panel-note',t().noResults));
  for(const item of items.slice(0,20)){const row=button(item.name,()=>{searchDialog.close();if(item.action)item.action();else if(item.command){location.hash=item.kind;showView();}else openEntity(item.kind,item.id);},'command-result');if(query&&item.kind)row.append(E('small','panel-note',t()[item.kind]));results.append(row);}
 }
 input.addEventListener('input',render);input.addEventListener('keydown',event=>{if(event.key==='Enter'&&input.value.trim()){event.preventDefault();results.querySelector('button')?.click();}});
 searchDialog.onkeydown=navigateSearchResults;
 function navigateSearchResults(event){if(event.key==='Escape'){event.preventDefault();searchDialog.close();return;}if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const controls=[input,...results.querySelectorAll('button')],index=controls.indexOf(document.activeElement);controls[(index+(event.key==='ArrowDown'?1:-1)+controls.length)%controls.length]?.focus();}}
 searchDialog.append(title,close,input,hint,resultCount,results);render();searchDialog.showModal();input.focus();
};
for(const name of ['renderTools','renderResources','renderProjects','renderTasks','renderNotes','renderSnippets']){const original=window[name];window[name]=function(...args){const result=original.apply(this,args);simplifySearchFields();return result;};}
window.addEventListener('languagechange',simplifySearchFields);simplifySearchFields();
