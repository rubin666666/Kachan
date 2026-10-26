/* Apply the requested visual update once, retaining subsequent user choices. */
if(extras.preferences.visualRevision!=='blue-square-v1'){
 settings.accent='blue';writeData('devspace-settings',settings);
 extras.preferences.visualRevision='blue-square-v1';persistExtras();
}
const settingsBeforeBlueSquare=applySettings;
const comfortBeforeBlueSquare=applyComfort;
applyComfort=function(){
 comfortBeforeBlueSquare();
 const root=document.documentElement;
 // Use darker hues on light surfaces so links and active tabs stay readable.
 Object.assign(palette,root.dataset.theme==='light'
  ?{red:'#b92332',violet:'#7042bd',blue:'#1c5fb9',green:'#06633d'}
  :{red:'#ff5555',violet:'#a38bfa',blue:'#91bfff',green:'#28bd80'});
 const accent=palette[settings.accent];
 root.style.setProperty('--accent',accent);
 const channels=accent.slice(1).match(/../g).map(value=>parseInt(value,16)/255)
  .map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
 const luminance=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
 root.style.setProperty('--accent-ink',(luminance+.05)/.058>(1.02/(luminance+.05))?'#101810':'#fffaf0');
 document.querySelector('meta[name="theme-color"]').content=accent;
};
applySettings=function(){settingsBeforeBlueSquare();applyComfort();};
for(const id of ['theme-select','accent-color'])Q(id).addEventListener('change',()=>applySettings());
Object.assign(translations.uk,{blue:'Блакитний'});Object.assign(translations.en,{blue:'Sky blue'});
const blueOption=Q('accent-color').querySelector('[value=blue]');blueOption.textContent=t().blue;
applySettings();
