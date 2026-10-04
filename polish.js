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
window.addEventListener('hashchange',()=>{const route=location.hash.slice(1).split('?')[0];for(const [kind,state] of editorWindows)if(state.dialog.open&&route!==(kind==='task'?'tasks':'projects'))state.dialog.close();});
// Animate newly visible routes, rather than every render of a timer or a task.
let animatedRoute='';const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function animateRoute(){const route=(location.hash.slice(1)||'dashboard').split('?')[0];if(route===animatedRoute)return;animatedRoute=route;const view=Q(route+'-view');if(!view||motionPreference.matches)return;view.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});}
window.addEventListener('hashchange',animateRoute);window.addEventListener('kachan-ready',animateRoute);updateWindowLabels();
