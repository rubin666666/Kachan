Object.assign(translations.uk,{backupTitle:'Резервна копія',backupInfo:'Експортуй дані у JSON та перенеси їх в інший браузер. Імпорт замінює поточні дані після підтвердження.',exportData:'Завантажити JSON',importData:'Обрати JSON для імпорту',replaceData:'Замінити дані',importConfirm:'Замінити поточні дані Kachan цією резервною копією?',badBackup:'Неправильний або пошкоджений файл Kachan. Максимум 5 МБ.',backupReady:'Готово до імпорту',githubImport:'Імпортувати з GitHub',githubUser:'GitHub username',loadRepos:'Завантажити репозиторії',loadingRepos:'Завантаження…',repoError:'Не вдалося завантажити. Перевір мережу й повтори.',repoNotFound:'Користувача не знайдено.',repoRate:'Ліміт GitHub API вичерпано. Спробуй пізніше.',noRepos:'Публічних репозиторіїв немає.',addRepo:'Додати в Projects',alreadyAdded:'Уже додано',repoAdded:'Проєкт додано',importFailed:'Імпорт не виконано: браузер не зміг зберегти дані.'});
Object.assign(translations.en,{backupTitle:'Backup',backupInfo:'Export data as JSON and transfer it to another browser. Import replaces current data after confirmation.',exportData:'Download JSON',importData:'Choose JSON to import',replaceData:'Replace data',importConfirm:'Replace current Kachan data with this backup?',badBackup:'Invalid or damaged Kachan file. Maximum 5 MB.',backupReady:'Ready to import',githubImport:'Import from GitHub',githubUser:'GitHub username',loadRepos:'Load repositories',loadingRepos:'Loading…',repoError:'Could not load. Check your connection and retry.',repoNotFound:'User not found.',repoRate:'GitHub API rate limit reached. Try again later.',noRepos:'No public repositories.',addRepo:'Add to Projects',alreadyAdded:'Already added',repoAdded:'Project added',importFailed:'Import failed: browser could not save the data.'});
const backupKeys=['settings','snippets','favorites','progress','tasks','projects','language','htmlCourse','notes','dashboard'];
const bounded=(v,max)=>typeof v==='string'&&v.length<=max;
const unique=items=>new Set(items.map(item=>item.id)).size===items.length;
function validateBackup(value){
 if(!value||value.app!=='Kachan'||![1,2,3,4].includes(value.version)||!value.data)return false;
 const d=value.data;
 if(value.version===4&&!Object.hasOwn(d,'dashboard'))return false;
 if(value.version>=3&&(!Object.hasOwn(d,'notes')||!Object.hasOwn(d,'htmlCourse')))return false;
 if(!backupKeys.filter(k=>!['htmlCourse','notes','dashboard'].includes(k)).every(k=>Object.hasOwn(d,k)))return false;
 if(!['uk','en'].includes(d.language)||!d.settings||!bounded(d.settings.userName,50)||!d.settings.userName.trim()||!Object.hasOwn(palette,d.settings.accent)||!['dark','light'].includes(d.settings.theme))return false;
 if(!Array.isArray(d.tasks)||d.tasks.length>10000||!unique(d.tasks)||!d.tasks.every(s=>s&&validTaskExtras(s)&&bounded(s.id,100)&&typeof s.completed==='boolean'&&(bounded(s.title,160)||['taskFlex','taskArrays','taskPush','taskLayout'].includes(s.translationKey))))return false;
 if(!Array.isArray(d.projects)||d.projects.length>10000||!unique(d.projects)||!d.projects.every(p=>p&&bounded(p.id,100)&&bounded(p.name,100)&&p.name.trim()&&bounded(p.description,1000)&&Array.isArray(p.technologies)&&p.technologies.every(t=>bounded(t,500))&&['planning','inProgress','finished'].includes(p.status)&&Number.isFinite(p.progress)&&p.progress>=0&&p.progress<=100&&bounded(p.github,500)&&bounded(p.live,500)&&validProjectUrl(p.github)&&validProjectUrl(p.live)&&bounded(p.updatedAt,100)&&Number.isFinite(Date.parse(p.updatedAt))))return false;
 if(!Array.isArray(d.snippets)||d.snippets.length>10000||!unique(d.snippets)||!d.snippets.every(s=>s&&bounded(s.id,100)&&bounded(s.name,100)&&s.name.trim()&&bounded(s.description,500)&&bounded(s.code,20000)&&categories.includes(s.category)))return false;
 if(!Array.isArray(d.favorites)||!d.favorites.every(id=>resources.some(r=>r[0]===id)))return false;
 if(!d.progress||typeof d.progress!=='object'||Array.isArray(d.progress))return false;
 const allowed=[...document.querySelectorAll('[data-topic]')].map(input=>input.dataset.topic).concat(['taskFlex','taskArrays','taskPush','taskLayout','htmlStructure','htmlForms','htmlSemantic']);
 if(d.dashboard!==undefined&&!validDashboard(d.dashboard))return false;
 if(d.notes!==undefined&&!validNotes(d.notes))return false;
 if(d.htmlCourse!==undefined&&!validHtmlCourse(d.htmlCourse))return false;
 return Object.entries(d.progress).every(([key,v])=>allowed.includes(key)&&typeof v==='boolean');
}
document.querySelector('#export-data').addEventListener('click',()=>{
 const data={settings,snippets,favorites,progress:savedProgress,tasks,projects,language:document.documentElement.lang,htmlCourse,notes,dashboard:dashboardData};
 const blob=new Blob([JSON.stringify({app:'Kachan',version:4,exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='kachan-backup-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
let pendingBackup=null,importGeneration=0;
function backupPreview(){document.querySelector('#import-preview').textContent=pendingBackup?t().backupReady+': '+pendingBackup.tasks.length+' '+t().tasks+', '+pendingBackup.projects.length+' '+t().projects+', '+pendingBackup.snippets.length+' '+t().snippets+', '+(pendingBackup.notes||[]).length+' '+t().notes:'';}
document.querySelector('#import-file').addEventListener('change',async e=>{
 const generation=++importGeneration;pendingBackup=null;document.querySelector('#confirm-import').hidden=true;backupPreview();const file=e.target.files[0];if(!file)return;
 try{if(file.size>5*1024*1024)throw Error();const parsed=JSON.parse(await file.text());if(generation!==importGeneration)return;if(!validateBackup(parsed))throw Error();pendingBackup=parsed.data;document.querySelector('#confirm-import').hidden=false;backupPreview();}catch{if(generation===importGeneration)document.querySelector('#import-preview').textContent=t().badBackup;}
});
document.querySelector('#confirm-import').addEventListener('click',()=>{
 if(!pendingBackup||!window.confirm(t().importConfirm))return;
 const previous={};try{for(const key of backupKeys)previous[key]=localStorage.getItem('devspace-'+key);for(const key of backupKeys)localStorage.setItem('devspace-'+key,key==='language'?pendingBackup[key]:JSON.stringify(key==='dashboard'?(pendingBackup.dashboard||{version:1,activity:[],goals:{day:{text:'',period:todayInKyiv()},week:{text:'',period:weekStart()}}}):key==='notes'?(pendingBackup.notes||[]):key==='htmlCourse'?(pendingBackup[key]||{version:1,selected:'document',lessons:{}}):pendingBackup[key]));location.reload();}catch{try{for(const key of Object.keys(previous)){if(previous[key]===null)localStorage.removeItem('devspace-'+key);else localStorage.setItem('devspace-'+key,previous[key]);}}catch{}notice(t().importFailed);}
});
let githubRepos=[],githubState='';
function repoExists(repo){return projects.some(p=>p.id==='github-'+repo.id||p.github.replace(/\.git$|\/$/g,'').toLowerCase()===repo.html_url.replace(/\/$/,'').toLowerCase());}
function renderGithub(){
 document.querySelector('#github-status').textContent=githubState?t()[githubState]:'';
 const list=document.querySelector('#github-repos');list.replaceChildren();
 for(const repo of githubRepos){const card=projectElement('article','dashboard-panel');card.append(projectElement('h2','',repo.name),projectElement('p','panel-note',repo.description||''));const b=projectElement('button','secondary-button',repoExists(repo)?t().alreadyAdded:t().addRepo);b.type='button';b.disabled=repoExists(repo);b.addEventListener('click',()=>{if(repoExists(repo))return;projects.push({id:'github-'+repo.id,name:repo.name.slice(0,100),description:(repo.description||'').slice(0,1000),technologies:repo.language?[repo.language]:[],status:'planning',progress:0,github:repo.html_url,live:validProjectUrl(repo.homepage||'')?repo.homepage||'':'',updatedAt:repo.updated_at});saveProjects();renderProjects();renderGithub();notice(projectStorageFailed?t().storageFailed:t().repoAdded);});card.append(b);list.append(card);}
}
document.querySelector('#github-form').addEventListener('submit',async e=>{
 e.preventDefault();const user=document.querySelector('#github-user').value.trim();if(!/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(user))return;
 const button=document.querySelector('#github-load');button.disabled=true;githubRepos=[];githubState='loadingRepos';renderGithub();
 try{const found=[];for(let page=1;page<=100;page++){
 const response=await fetch('https://api.github.com/users/'+encodeURIComponent(user)+'/repos?sort=updated&per_page=100&page='+page,{headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(15000)});
 if(!response.ok){githubState=response.status===404?'repoNotFound':[403,429].includes(response.status)?'repoRate':'repoError';throw Error();}
 const batch=await response.json();if(!Array.isArray(batch)||!batch.every(r=>r&&Number.isSafeInteger(r.id)&&typeof r.name==='string'&&typeof r.html_url==='string'&&r.html_url.startsWith('https://github.com/')&&typeof r.updated_at==='string'&&Number.isFinite(Date.parse(r.updated_at))))throw Error();found.push(...batch);if(batch.length<100)break;}
 githubRepos=found;githubState=found.length?'':'noRepos';
 }catch{if(githubState==='loadingRepos')githubState='repoError';}finally{button.disabled=false;renderGithub();}
});
window.addEventListener('languagechange',()=>{backupPreview();renderGithub();});
setLanguage(document.documentElement.lang);
