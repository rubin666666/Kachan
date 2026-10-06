/* Apply the requested visual update once, retaining subsequent user choices. */
if(extras.preferences.visualRevision!=='blue-square-v1'){
 settings.accent='blue';writeData('devspace-settings',settings);
 extras.preferences.visualRevision='blue-square-v1';persistExtras();
}
const settingsBeforeBlueSquare=applySettings;
const comfortBeforeBlueSquare=applyComfort;
applyComfort=function(){comfortBeforeBlueSquare();palette.blue=document.documentElement.dataset.theme==='light'?'#176c9d':'#79caff';document.documentElement.style.setProperty('--accent',palette[settings.accent]);document.querySelector('meta[name="theme-color"]').content=palette[settings.accent];};
applySettings=function(){settingsBeforeBlueSquare();applyComfort();};
for(const id of ['theme-select','accent-color'])Q(id).addEventListener('change',()=>applySettings());
Object.assign(translations.uk,{blue:'Блакитний'});Object.assign(translations.en,{blue:'Sky blue'});
const blueOption=Q('accent-color').querySelector('[value=blue]');blueOption.textContent=t().blue;
applySettings();
