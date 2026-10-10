// Settings keep existing forms and handlers, with less information shown at once.
Object.assign(translations.uk,{settingsAccount:'Акаунт',settingsData:'Резервні копії',settingsSimpleIntro:'Вигляд, акаунт і твої дані — усе в одному місці.',settingsLocal:'Локальна копія',settingsLocalInfo:'Завантаж файл для збереження або перенесення даних.',settingsImport:'Відновити з файлу',settingsStorage:'Сховище браузера',settingsDanger:'Скинути локальні дані',settingsDangerInfo:'Відкривай лише якщо хочеш почати з чистого аркуша.',settingsCloudInfo:'Збережи копію своїх даних або отримай її на іншому пристрої. Синхронізація ручна.',settingsCloudMore:'Історія та вихід',settingsConnected:'Підключено',settingsSignedOut:'Увійди, щоб зберігати дані в хмарі',settingsAuto:'Ці параметри зберігаються автоматично.',settingsBackupInfo:'Хмарні копії доступні у вкладці «Акаунт». Тут можна працювати з файлами.'});
Object.assign(translations.en,{settingsAccount:'Account',settingsData:'Backups',settingsSimpleIntro:'Appearance, account and your data in one place.',settingsLocal:'Local backup',settingsLocalInfo:'Download a file to keep or transfer your data.',settingsImport:'Restore from file',settingsStorage:'Browser storage',settingsDanger:'Reset local data',settingsDangerInfo:'Open only if you want to start fresh.',settingsCloudInfo:'Save a copy of your data or fetch it on another device. Sync is manual.',settingsCloudMore:'History and sign out',settingsConnected:'Connected',settingsSignedOut:'Sign in to back up your data in the cloud',settingsAuto:'These preferences save automatically.',settingsBackupInfo:'Cloud backups are in Account. Use this tab for backup files.'});
const settingsRoot=Q('settings-view');
purposeText.settings=['Обери вигляд сайту, увійди в акаунт для ручних хмарних копій або збережи дані файлом. Додаткові параметри відкриваються окремо.','Choose the site appearance, sign in for manual cloud backups, or save your data as a file. Additional preferences open separately.'];
translations.uk.settingsMore='Додаткові параметри';translations.en.settingsMore='More preferences';
function settingsDisclosure(id,panel,key){const details=E('details','settings-disclosure');details.id=id;details.append(E('summary','',t()[key]),panel);panel.hidden=false;return details;}
const backupPanel=settingsRoot.querySelector('.backup-panel');
const restoreBox=E('details','settings-disclosure settings-import');restoreBox.id='settings-import';
restoreBox.append(E('summary','',t().settingsImport));
for(const child of [...backupPanel.children])if(!child.matches('h2,.panel-note,#export-data'))restoreBox.append(child);
backupPanel.append(restoreBox);
const storageDisclosure=settingsDisclosure('settings-storage',storagePanel,'settingsStorage');settingsRoot.append(storageDisclosure);
const resetDisclosure=settingsDisclosure('settings-reset',settingsRoot.querySelector('.reset-panel'),'settingsDanger');settingsRoot.append(resetDisclosure);
const simplifyCloudBefore=renderCloud;
renderCloud=function(){simplifyCloudBefore();cloudPanel.id='settings-account';cloudPanel.querySelector('h2').textContent=t().settingsAccount;cloudPanel.querySelector('.panel-note').textContent=t().settingsCloudInfo;
 const setup=Q('cloud-setup-form').closest('details');setup.classList.add('settings-disclosure');
 const badge=E('p','settings-account-state',cloudSession?t().settingsConnected:t().settingsSignedOut);cloudPanel.querySelector('h2').after(badge);
 if(cloudSession){const actions=cloudPanel.querySelector('.editor-actions');const more=E('details','settings-disclosure');more.id='settings-cloud-more';more.append(E('summary','',t().settingsCloudMore));const secondary=E('div','editor-actions');for(const b of [...actions.children].slice(2))secondary.append(b);more.append(secondary);for(const b of [...cloudPanel.children])if(b.tagName==='BUTTON')more.append(b);if(cloudHistory.length)more.open=true;cloudPanel.append(more);}cloudPanel.append(setup);
};
const stageCloudBeforeSettings=stageCloudBackup;
stageCloudBackup=function(row){stageCloudBeforeSettings(row);settingsTab='data';restoreBox.open=true;arrangeSettings();backupPanel.scrollIntoView({block:'center'});};
arrangeSettings=function(){if(settingsTab==='board')settingsTab='look';Q('settings-tabs')?.remove();const heading=settingsRoot.querySelector('.page-heading');let intro=heading.querySelector('.settings-intro');if(!intro){intro=E('p','settings-intro');heading.append(intro);}intro.textContent=t().settingsSimpleIntro;
 heading.after(compositionTabs('settings-tabs',[['look','settingsLook'],['account','settingsAccount'],['data','settingsData'],['alerts','settingsAlerts']],settingsTab,value=>{settingsTab=value;arrangeSettings();}));
 for(const panel of settingsRoot.children){if(panel===heading||panel.id==='settings-tabs')continue;const group=panel===cloudPanel?'account':panel.id==='settings-form'||panel===comfortPanel?'look':panel.id==='dashboard-settings'?'board':panel===alertsPanel?'alerts':'data';panel.hidden=group!==settingsTab;}
 storagePanel.hidden=false;resetDisclosure.querySelector('.reset-panel').hidden=false;
 backupPanel.querySelector('h2').textContent=t().settingsLocal;backupPanel.querySelector('.panel-note').textContent=t().settingsLocalInfo;
 restoreBox.querySelector('summary').textContent=t().settingsImport;storageDisclosure.querySelector('summary').textContent=t().settingsStorage;resetDisclosure.querySelector('summary').textContent=t().settingsDanger;
 if(pendingBackup)restoreBox.open=true;
 comfortPanel.querySelector('h2').textContent=t().appearance;
 let preferences=comfortPanel.querySelector('#settings-more-preferences');if(!preferences){preferences=E('details','settings-disclosure');preferences.id='settings-more-preferences';preferences.append(E('summary','',t().settingsMore));const sizeField=[...comfortPanel.children].find(el=>el.querySelector('select'));if(sizeField){let extra=sizeField.nextElementSibling;while(extra){const next=extra.nextElementSibling;preferences.append(extra);extra=next;}}comfortPanel.append(preferences);}preferences.querySelector('summary').textContent=t().settingsMore;
 let auto=comfortPanel.querySelector('.settings-auto');if(!auto){auto=E('p','panel-note settings-auto');comfortPanel.append(auto);}auto.textContent=t().settingsAuto;
 scheduleSectionNavigation();
};
const settingsMenuBefore=renderMenuPreferences;
renderMenuPreferences=function(){settingsMenuBefore();const more=Q('settings-more-preferences');if(more&&Q('menu-preferences'))more.append(Q('menu-preferences'));};
window.addEventListener('languagechange',()=>{renderCloud();arrangeSettings();renderMenuPreferences();});
renderCloud();arrangeSettings();
renderMenuPreferences();
