// Keep secondary content available without repeating it on every first screen.
function quietFold(owner,className,title,nodes){
 const items=nodes.filter(Boolean);if(!owner||!items.length)return null;
 let fold=owner.querySelector(':scope>.'+className);
 if(!fold){fold=E('details',className+' quiet-disclosure');fold.append(E('summary'),E('div','quiet-disclosure-body'));items[0].before(fold);}
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

 for(const card of toolsView.querySelectorAll('.organization-tool-categories .organization-grid .organization-card')){
  const description=card.querySelector('.organization-description');if(!description)continue;
  const count=description.textContent.match(/\d+$/)?.[0];if(count){description.title=text('Інструментів: ','Tools: ')+count;description.setAttribute('aria-label',description.title);description.textContent=count;}
 }
}
// Run after existing renderers, preserving their original nodes and event handlers.
for(const name of ['renderHome','renderProfile','renderSnippets','renderComfort','arrangeSettings','organizeLearning','renderUnifiedCatalog','setupCollectionViews','showView']){
 const previous=window[name];if(typeof previous!=='function')continue;
 window[name]=function(...args){const result=previous.apply(this,args);quietWorkspace();return result;};
}
document.documentElement.classList.add('quiet-interface');
window.addEventListener('languagechange',quietWorkspace);
window.addEventListener('kachan-ready',quietWorkspace);
quietWorkspace();
