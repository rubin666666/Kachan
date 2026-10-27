// Keep secondary content available without repeating it on every first screen.
let quietTaskSelection=false;
function quietFold(owner,className,title,nodes){
 const items=nodes.filter(Boolean);if(!owner||!items.length)return null;
 let fold=owner.querySelector(':scope>.'+className);
 if(!fold){fold=E('details',className+' quiet-disclosure');fold.append(E('summary'),E('div','quiet-disclosure-body'));if(items[0].parentElement===owner)items[0].before(fold);else owner.append(fold);}
 fold.querySelector(':scope>summary').textContent=title;
 const body=fold.querySelector(':scope>.quiet-disclosure-body');
 for(const node of items)if(node.parentElement!==body)body.append(node);
 return fold;
}
function quietWorkspace(){
 const text=(uk,en)=>document.documentElement.lang==='uk'?uk:en;
 const daily=homeSurface.querySelector('.home-daily');
 if(daily)quietFold(homeSurface,'quiet-home-extra',text('Закріплене й рекомендації','Saved materials and suggestions'),[daily]);

 const controls=profileView.querySelector('.profile-controls');
 if(controls){const extra=[...controls.querySelectorAll(':scope>button:not(.primary-button)')],existing=controls.querySelector('.quiet-profile-share');
  if(extra.length||existing){const fold=quietFold(controls,'quiet-profile-share',text('Поділитися профілем','Share profile'),extra.length?extra:[existing.querySelector('.quiet-disclosure-body>button')]);
   const note=profileView.querySelector('.profile-local-note');if(note&&fold&&!fold.contains(note))fold.querySelector('.quiet-disclosure-body').append(note);
  }
 }
 const theme=Q('settings-form')?.querySelector('.studio-theme-launch');
 if(theme)quietFold(Q('settings-form'),'quiet-theme-extra',text('Додаткові стилі','Additional styles'),[theme]);

 const reference=Q('learning-panel-reference')?.querySelector('.organization-generated');
 const heading=reference?.querySelector(':scope>.organization-heading');
 if(heading?.nextElementSibling?.matches('.organization-grid')){const title=heading.textContent;heading.hidden=true;quietFold(reference,'quiet-reference-extra',title,[heading,heading.nextElementSibling]);}

 const snippets=Q('snippets-view'),intro=snippets.querySelector('.snippet-intro-fold'),mode=Q('snippets-display-mode');
 if(intro&&mode){intro.open=true;intro.querySelector(':scope>summary').hidden=true;quietFold(snippets,'quiet-code-extra',text('Вигляд і довідка','View and help'),[mode,intro]);}
 const filters=Q('snippet-filters');if(filters&&favoriteToggle.parentElement!==filters)filters.append(favoriteToggle);

 for(const card of Q('all-projects').querySelectorAll('.project-card')){
  const title=card.querySelector('.project-info h2,.project-info h3'),link=card.querySelector('a[href^="#projects?project="]');
  if(title&&link&&!title.contains(link)){const name=title.textContent;link.textContent=name;link.classList.remove('secondary-button');link.classList.add('quiet-title-action');link.setAttribute('aria-label',text('Відкрити проєкт: ','Open project: ')+name);title.replaceChildren(link);}
 }
 const detail=Q('project-detail'),progress=detail.querySelector('select[aria-label="'+t().progressMode+'"]');
 if(progress){const label=progress.previousElementSibling,archive=progress.nextElementSibling;
  const fold=quietFold(detail,'quiet-project-settings',text('Налаштування проєкту','Project settings')+(progress.value==='manual'?text(' · ручний прогрес',' · manual progress'):''),[label,progress,archive]);
  if(fold&&detail.lastElementChild!==fold)detail.append(fold);
 }

 for(const card of toolsView.querySelectorAll('.organization-tool-categories .organization-grid .organization-card')){
  const description=card.querySelector('.organization-description');if(!description)continue;
  const count=description.textContent.match(/\d+$/)?.[0];if(count){description.title=text('Інструментів: ','Tools: ')+count;description.setAttribute('aria-label',description.title);description.textContent=count;}
 }
 quietProjectWorkspaces();
}
function quietProjectWorkspaces(){
 const text=(uk,en)=>document.documentElement.lang==='uk'?uk:en,route=focusedRoute(),tab=route.params.get('tab')||'overview',active=route.route==='projects';
 const heading=Q('projects-view').querySelector('.page-heading');let actions=heading.querySelector('.quiet-workspace-actions');
 if(!actions){actions=E('div','quiet-workspace-actions');heading.append(actions);}
 for(const[id,target]of [['open-task-window','tasks'],['note-new','notes']]){const control=Q(id);if(control.parentElement!==actions)actions.append(control);control.hidden=!active||tab!==target;}
 actions.hidden=!active||!['tasks','notes'].includes(tab);Q('open-project-window').hidden=active&&tab!=='overview';
 const original=Q('open-project-window').closest('.view-header-actions');if(original)original.hidden=!actions.hidden;

 const panel=Q('tasks-view').querySelector('.tasks-page-panel'),tools=panel.querySelector('.task-view-tools');
 if(tools){const fold=quietFold(panel,'quiet-task-options',text('Вигляд і керування','View and manage'),[tools]);
  const marked=trashMode?text(' · корзина',' · trash'):kanbanMode?' · Kanban':Q('filter-project').value!=='all'||Q('filter-priority').value!=='all'?text(' · фільтр',' · filtered'):Q('task-sort').value!=='created'?' · '+Q('task-sort').selectedOptions[0].textContent:'';
  fold.querySelector(':scope>summary').textContent=text('Вигляд і керування','View and manage')+marked;
  let selection=tools.querySelector('#quiet-task-selection');if(!selection){selection=button('',()=>{quietTaskSelection=!quietTaskSelection;if(!quietTaskSelection)taskSelection.clear();renderTasks();},'secondary-button');selection.id='quiet-task-selection';selection.setAttribute('aria-controls','all-tasks');tools.append(selection);}
  selection.textContent=quietTaskSelection?text('Завершити вибір','Finish selecting'):text('Обрати кілька','Select several');selection.setAttribute('aria-pressed',String(quietTaskSelection));
 }
 panel.dataset.multiSelect=String(quietTaskSelection||taskSelection.size>0);
 Q('bulk-count').setAttribute('role','status');
 const filterContent=Q('task-sort').closest('.utility-content');let taskReset=filterContent.querySelector('.quiet-task-reset');
 if(!taskReset){taskReset=button('',()=>{projectScope='all';taskFilter='all';trashMode=false;kanbanMode=false;Q('tasks-search').value='';Q('filter-project').value='all';Q('filter-priority').value='all';Q('task-sort').value='created';location.hash='projects?tab=tasks';showView();renderTasks();taskReset.closest('dialog')?.close();},'secondary-button quiet-task-reset');filterContent.append(taskReset);}
 taskReset.textContent=text('Показати всі задачі','Show all tasks');taskReset.hidden=!(trashMode||kanbanMode||taskFilter!=='all'||Q('tasks-search').value||Q('filter-project').value!=='all'||Q('filter-priority').value!=='all'||Q('task-sort').value!=='created');

 const noteTools=Q('notes-view').querySelector('.notebook-tools');if(noteTools){if(folderBar.parentElement!==noteTools)noteTools.append(folderBar);const filtered=chosenFolder!=='all'||pinnedNotesOnly||showTrash||Q('notes-folder').value!=='all',sorted=Q('notes-sort').value!=='updated';noteTools.querySelector(':scope>summary').textContent=t().noteTools+(filtered?text(' · фільтр',' · filtered'):sorted?' · '+Q('notes-sort').selectedOptions[0].textContent:'');}
 const count=Q('notes-count'),browser=Q('notes-view').querySelector('.notes-browser');let status=browser.querySelector(':scope>.quiet-note-status');
 if(!status){status=E('div','quiet-note-status');const reset=button('',()=>{chosenFolder='all';pinnedNotesOnly=false;showTrash=false;Q('notes-folder').value='all';Q('notes-sort').value='updated';Q('notes-search').value='';if(notes.find(n=>n.id===selectedNote)?.deleted)selectedNote=null;renderNotes();Q('notes-search').focus({preventScroll:true});},'secondary-button quiet-note-reset');count.before(status);status.append(count,reset);}
 const noteReset=status.querySelector('button'),noteFiltered=chosenFolder!=='all'||pinnedNotesOnly||showTrash||Q('notes-folder').value!=='all'||Q('notes-sort').value!=='updated'||Q('notes-search').value.trim();noteReset.textContent=text('Скинути','Reset');noteReset.setAttribute('aria-label',text('Скинути пошук і фільтри нотаток','Reset note search and filters'));noteReset.disabled=!noteFiltered;noteReset.classList.toggle('is-unavailable',!noteFiltered);
 const toolbar=Q('notes-view').querySelector('.notes-toolbar'),template=Q('notes-view').querySelector('.template-tools');
 if(template){template.open=true;template.querySelector(':scope>summary').hidden=true;quietFold(toolbar,'quiet-note-tools',text('Додатково','More options'),[Q('quick-thought'),template]);}

 const form=Q('task-form'),repeat=Q('task-repeat').closest('.form-field'),priority=Q('task-priority').closest('.form-field'),deadline=Q('task-deadline').closest('.form-field'),project=Q('task-project').closest('.form-field');
 const custom=Q('task-repeat').value!=='none'||Q('task-priority').value!=='medium'||!!Q('task-deadline').value;
 const extra=quietFold(form,'quiet-task-fields',text('Додаткові параметри','Additional options')+(custom?text(' · налаштовано',' · configured'):''),[repeat,priority,deadline]);
 if(project.parentElement!==form)extra.before(project);
 if(editingTaskId&&custom)extra.open=true;
}
// Run after existing renderers, preserving their original nodes and event handlers.
for(const name of ['renderHome','renderProfile','renderProjects','renderProjectDetail','renderTasks','renderNotes','renderNotesList','renderFolders','renderSnippets','renderComfort','arrangeSettings','organizeLearning','renderUnifiedCatalog','setupCollectionViews','showView','openEditorWindow']){
 const previous=window[name];if(typeof previous!=='function')continue;
 window[name]=function(...args){
  const detail=name==='renderProjectDetail'?Q('project-detail'):null,old=detail?.querySelector('.quiet-project-settings'),identity=detail?.dataset.quietProject;
  const expanded=old?.open,focused=!!old&&old.querySelector('select')===document.activeElement;
  const result=previous.apply(this,args);quietWorkspace();
  if(name==='openEditorWindow'&&args[0]==='task'&&!editingTaskId)Q('task-form').querySelector('.quiet-task-fields').open=false;
  if(detail)detail.dataset.quietProject=new URLSearchParams(location.hash.split('?')[1]||'').get('project')||'';
  if(old&&identity&&identity===detail.dataset.quietProject){const fold=detail.querySelector('.quiet-project-settings');if(fold){fold.open=expanded;if(focused)fold.querySelector('select')?.focus({preventScroll:true});}}
  return result;
 };
}
document.documentElement.classList.add('quiet-interface');
window.addEventListener('languagechange',quietWorkspace);
window.addEventListener('kachan-ready',quietWorkspace);
Q('task-form').addEventListener('change',quietWorkspace);
const quietFilterFields=new Set(['notes-sort','notes-folder','custom-folder-filter','task-sort','filter-project','filter-priority']);
document.addEventListener('change',event=>{if(quietFilterFields.has(event.target.id))queueMicrotask(quietWorkspace);});
document.addEventListener('input',event=>{if(['notes-search','tasks-search'].includes(event.target.id))queueMicrotask(quietWorkspace);});
document.addEventListener('click',event=>{if(event.target.closest('.task-edit'))queueMicrotask(quietWorkspace);});
quietWorkspace();
