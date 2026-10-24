/* Apply the requested visual update once, retaining subsequent user choices. */
if(extras.preferences.visualRevision!=='blue-square-v1'){
 settings.accent='blue';writeData('devspace-settings',settings);
 extras.preferences.visualRevision='blue-square-v1';persistExtras();
}
const settingsBeforeBlueSquare=applySettings;
const comfortBeforeBlueSquare=applyComfort;
applyComfort=function(){comfortBeforeBlueSquare();palette.blue=document.documentElement.dataset.theme==='light'?'#356348':'#bdd5aa';document.documentElement.style.setProperty('--accent',palette[settings.accent]);const channels=palette[settings.accent].slice(1).match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4),luminance=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;document.documentElement.style.setProperty('--accent-ink',(luminance+.05)/.058>(1.02/(luminance+.05))?'#101810':'#fffaf0');document.querySelector('meta[name="theme-color"]').content=palette[settings.accent];};
applySettings=function(){settingsBeforeBlueSquare();applyComfort();};
for(const id of ['theme-select','accent-color'])Q(id).addEventListener('change',()=>applySettings());
Object.assign(translations.uk,{blue:'Шавлієвий'});Object.assign(translations.en,{blue:'Sage'});
const blueOption=Q('accent-color').querySelector('[value=blue]');blueOption.textContent=t().blue;
applySettings();
