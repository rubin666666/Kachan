// Keep the existing forms and their validation; only change how they are presented.
const editorWindows=new Map();
function createEditorWindow(kind,form,field){
 const dialog=E('dialog','editor-window'),header=E('header','editor-window-header'),heading=E('h2');heading.id=kind+'-window-title';
 const close=button('close',()=>dialog.close());close.className='window-close';close.textContent='×';
 header.append(heading,close);dialog.append(header,form);dialog.setAttribute('aria-labelledby',heading.id);document.body.append(dialog);
 const state={dialog,heading,field,previous:null};editorWindows.set(kind,state);
 dialog.addEventListener('close',()=>{document.body.classList.toggle('editor-window-open',[...editorWindows.values()].some(s=>s.dialog.open));if(state.previous?.isConnected)state.previous.focus();});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 return state;
}
function openEditorWindow(kind){const state=editorWindows.get(kind);if(!state||state.dialog.open)return;state.previous=document.activeElement;updateWindowLabels();state.dialog.showModal();document.body.classList.add('editor-window-open');Q(state.field).focus();}
function updateWindowLabels(){for(const [kind,state] of editorWindows){state.heading.textContent=t()[kind==='task'?(editingTaskId?'editTask':'newTask'):(editingProjectId?'editProject':'newProject')];state.dialog.querySelector('.window-close').setAttribute('aria-label',t().close);}taskCreate.textContent='+ '+t().newTask;projectCreate.textContent='+ '+t().newProject;}
const taskCreate=button('newTask',()=>{resetTaskForm();openEditorWindow('task');},'primary-button');taskCreate.id='open-task-window';
const taskToolbar=E('div','view-toolbar');taskToolbar.append(taskCreate);Q('task-form').before(taskToolbar);createEditorWindow('task',Q('task-form'),'task-input');
const projectCreate=button('newProject',()=>{resetProjectForm();Q('project-editor').open=true;openEditorWindow('project');},'primary-button');projectCreate.id='open-project-window';
const projectToolbar=E('div','view-toolbar');projectToolbar.append(projectCreate);Q('project-editor').before(projectToolbar);createEditorWindow('project',Q('project-form'),'project-name');Q('project-editor').hidden=true;
new MutationObserver(()=>{if(Q('project-editor').open)openEditorWindow('project');else editorWindows.get('project').dialog.close();}).observe(Q('project-editor'),{attributes:true,attributeFilter:['open']});
const taskResetBeforeWindow=resetTaskForm;resetTaskForm=function(){taskResetBeforeWindow();editorWindows.get('task').dialog.close();};
Q('quick-task').addEventListener('click',()=>openEditorWindow('task'));
Q('quick-project').addEventListener('click',()=>openEditorWindow('project'));
Q('cancel-task-edit').addEventListener('click',()=>editorWindows.get('task').dialog.close());
document.addEventListener('click',e=>{if(e.target.closest('.task-edit')){openEditorWindow('task');queueMicrotask(updateWindowLabels);}},true);
window.addEventListener('languagechange',updateWindowLabels);
window.addEventListener('hashchange',()=>{const route=location.hash.slice(1).split('?')[0];for(const [kind,state] of editorWindows)if(state.dialog.open&&!(kind==='task'?(route==='tasks'||(route==='projects'&&new URLSearchParams(location.hash.split('?')[1]).get('tab')==='tasks')):route==='projects'))state.dialog.close();});
// Navigation never animates the position of working content.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
updateWindowLabels();
const activeMotions=new Set();
function playMotion(element,frames,options={}){if(motionPreference.matches||!element.isConnected)return;const animation=element.animate(frames,{easing:'cubic-bezier(.2,.8,.2,1)',...options});activeMotions.add(animation);animation.finished.catch(()=>{}).finally(()=>activeMotions.delete(animation));return animation;}
document.addEventListener('change',event=>{const checkbox=event.target;if(!checkbox.matches('.task-row input[type=checkbox]')||!checkbox.checked)return;const row=checkbox.closest('li'),id=row?.dataset.taskId;queueMicrotask(()=>{const replacement=id?document.querySelector('[data-task-id="'+CSS.escape(id)+'"]'):null;if(replacement){playMotion(replacement,[{background:'var(--accent-soft)'},{background:'transparent'}],{duration:650});}});},true);
motionPreference.addEventListener('change',()=>{if(motionPreference.matches){for(const animation of activeMotions)animation.cancel();}});
