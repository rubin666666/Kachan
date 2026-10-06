/* Small usability refinements; no changes to user records or lesson content. */
const quietCopy={uk:{searchTools:'Знайти інструмент',noTools:'Інструментів не знайдено',clear:'Очистити пошук'},en:{searchTools:'Find a tool',noTools:'No tools found',clear:'Clear search'}};
const quietText=()=>quietCopy[document.documentElement.lang];
let toolSearch='';
Q('resource-query').closest('.dashboard-panel').classList.add('quiet-resource-search');
const resourceQuietControls=E('div','quiet-resource-controls');Q('resource-filters').before(resourceQuietControls);resourceQuietControls.append(Q('resource-filters'),Q('resources-display-mode'));
const toolsBeforeQuiet=renderTools;
renderTools=function(){
 toolsBeforeQuiet();
 const catalog=toolsView.querySelector('.tool-catalog');
 if(catalog){
  const control=E('div','quiet-tool-search'),label=E('label','',quietText().searchTools),input=E('input');
  input.id='tool-catalog-search';input.type='search';input.maxLength=120;input.value=toolSearch;input.placeholder=quietText().searchTools;label.htmlFor=input.id;
  const empty=E('p','panel-note',quietText().noTools);empty.setAttribute('role','status');
  const clear=button(quietText().clear,()=>{input.value='';filter();input.focus();},'secondary-button');
  function filter(){toolSearch=input.value;const query=toolSearch.trim().toLocaleLowerCase();let count=0;for(const card of catalog.children){card.hidden=!card.textContent.toLocaleLowerCase().includes(query);if(!card.hidden)count++;}empty.hidden=count>0;clear.hidden=!input.value;}
  input.addEventListener('input',filter);control.append(label,input,clear);catalog.before(control);catalog.after(empty);filter();
 }
 const utility=toolsView.querySelector('.focus-utility');
 if(utility){for(const [i,field] of [...utility.querySelectorAll('textarea')].entries()){field.id='utility-field-'+i;const label=field.previousElementSibling;if(label?.tagName==='LABEL')label.htmlFor=field.id;}}
};
const resourcesBeforeQuiet=renderResources;
renderResources=function(){resourcesBeforeQuiet();Q('resource-type-navigation')?.remove();};
const controlsBeforeQuiet=refreshFocusControls;
refreshFocusControls=function(){controlsBeforeQuiet();const hint=Q('project-scope-bar')?.querySelector('p');if(hint){Q('project-context').title=hint.textContent;hint.hidden=true;}};
window.addEventListener('languagechange',()=>{renderTools();renderResources();});
renderTools();renderResources();refreshFocusControls();
