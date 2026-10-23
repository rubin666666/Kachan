function studioKind(kind){return studioText({lesson:'Урок',tool:'Інструмент',resource:'Ресурс',activity:'Студія'}[kind]||kind,{lesson:'Lesson',tool:'Tool',resource:'Resource',activity:'Studio'}[kind]||kind);}
function studioEntities() { const lang = document.documentElement.lang; return [...lessonCatalog().map(lesson => ({ key: 'lesson:' + lesson.id, kind: 'lesson', id: lesson.id, title: lesson.title[lang], description: lesson.course + ' · ' + studioText('Пояснення, приклад і практика.', 'Explanation, example and practice.'), open: () => openLesson(lesson.id) })), ...resourceRows().map(row => ({ key: 'resource:' + row.id, kind: 'resource', id: row.id, title: row.name, description: row.description, url: row.url, open: () => { if (!validProjectUrl(row.url))
            return; studioRecord('resource', row.id); window.open(row.url, '_blank', 'noopener,noreferrer'); } })), ...toolTabs.map(([id, key]) => ({ key: 'tool:' + id, kind: 'tool', id, title: t()[key], description: toolLearningGuides[id]?.[lang]?.[0] || studioText('Інструмент із живим результатом.', 'A tool with a live result.'), open: () => openTool(id) })), ...studioActivities.map(row => ({ key: 'activity:' + row[0], kind: 'activity', id: row[0], title: studioLabel(row), description: studioDescription(row), open: () => openStudio(row[0]) }))]; }
function studioOpenEntity(entity) { studioWindow.shut(); entity.open(); }
function studioPin(key) { const state = studioState(); if (state.pins.includes(key))
    state.pins = state.pins.filter(value => value !== key);
else if (state.pins.length < 8)
    state.pins.push(key);
else {
    notice(studioText('Можна закріпити до 8 матеріалів.', 'Pin up to 8 materials.'));
    return;
} studioSave(); renderStudioHome(); }
studioRenderers.discover = parent => { const query = studioField(parent, studioText('Знайти урок, ресурс чи інструмент', 'Find a lesson, resource or tool')), tabs = E('div', 'studio-inline-actions'), [list, preview] = studioSplit(parent); query.type = 'search'; query.maxLength = 120; parent.insertBefore(tabs, list.parentElement); let mode = 'all'; function show(entity) { preview.replaceChildren(); preview.append(E('small', 'eyebrow', studioKind(entity.kind).toUpperCase()), E('h3', '', entity.title), E('p', '', entity.description || '')); if (entity.url) {
    const domain = E('p', 'studio-note', new URL(entity.url).hostname);
    preview.append(domain);
} const pin = button(studioState().pins.includes(entity.key) ? studioText('Відкріпити', 'Unpin') : studioText('Закріпити', 'Pin'), () => { studioPin(entity.key); show(entity); if (mode === 'pins')
    draw(); }, 'secondary-button'); pin.setAttribute('aria-pressed', String(studioState().pins.includes(entity.key))); preview.append(button(studioText('Відкрити →', 'Open →'), () => studioOpenEntity(entity), 'primary-button'), pin); } function draw() { list.replaceChildren(); preview.replaceChildren(); const entities = studioEntities(), history = studioState().history; let rows = mode === 'history' ? history.map(item => entities.find(entity => entity.key === item.kind + ':' + item.id)).filter(Boolean) : mode === 'pins' ? entities.filter(entity => studioState().pins.includes(entity.key)) : mode === 'favorites' ? entities.filter(entity => entity.kind === 'resource' && favorites.includes(entity.id)) : entities; const words = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean); rows = rows.filter(entity => words.every(word => (entity.title + ' ' + entity.description).toLocaleLowerCase().includes(word))).slice(0, 30); if (!rows.length) {
    studioEmpty(list, mode === 'pins' ? 'Нічого не закріплено. Знайди матеріал і натисни «Закріпити».' : mode === 'history' ? 'Історія поки порожня. Відкрий урок або інструмент.' : 'Збігів немає. Спробуй коротшу назву.', mode === 'pins' ? 'Nothing pinned. Find a resource and select Pin.' : mode === 'history' ? 'No recent visits. Open a lesson or tool.' : 'No matches. Try a shorter name.', [studioText('Показати все', 'Show all'), () => { mode = 'all'; query.value = ''; draw(); }]);
    return;
} for (const entity of rows) {
    const control = button('', () => show(entity), 'studio-search-result');
    control.append(E('strong', '', entity.title), E('small', '', studioKind(entity.kind)), E('span', '', entity.description?.slice(0, 100) || ''));
    list.append(control);
} show(rows[0]); } for (const [key, uk, en] of [['all', 'Усе', 'All'], ['pins', 'Закріплене', 'Pinned'], ['favorites', 'Обрані ресурси', 'Favorite resources'], ['history', 'Нещодавнє', 'Recent']])
    tabs.append(button(studioText(uk, en), () => { mode = key; draw(); }, 'secondary-button')); tabs.append(button(studioText('Очистити історію', 'Clear history'), () => { if (!confirm(studioText('Очистити лише історію відвідувань?', 'Clear visit history only?')))
    return; studioState().history = []; studioSave(); draw(); renderStudioHome(); }, 'secondary-button')); query.oninput = draw; draw(); };
function renderStudioHome() { if (!homeSurface.querySelector('.focus-portals'))
    return; homeSurface.querySelector('.studio-home')?.remove(); const section = E('section', 'studio-home'), teaser = E('div', 'studio-home-teaser'), copy = E('div'); copy.append(E('p', 'eyebrow', 'KACHAN / STUDIO'), E('h2', '', studioText('Не просто читай. Спробуй.', 'Don’t just read. Try it.')), E('p', '', studioText('Тренажери, візуальні пояснення й власні експерименти.', 'Exercises, visual explanations and your own experiments.'))); teaser.append(studioMascot(), copy, button(studioText('Відкрити студію →', 'Open Studio →'), () => openStudio(), 'primary-button')); section.append(teaser); const entities = studioEntities(), pins = studioState().pins.map(key => entities.find(entity => entity.key === key)).filter(Boolean), recent = studioState().history.map(item => entities.find(entity => entity.key === item.kind + ':' + item.id)).filter(Boolean).slice(0, 4), fold = E('details', 'studio-home-shortcuts'); fold.append(E('summary', '', studioText('Закріплене й нещодавнє', 'Pinned and recent'))); for (const [title, rows] of [[studioText('Закріплене', 'Pinned'), pins], [studioText('Нещодавнє', 'Recent'), recent]]) {
    const group = E('section');
    group.append(E('h3', '', title));
    if (!rows.length)
        group.append(E('p', 'studio-note', studioText('Знайди й закріпи матеріал у Студії.', 'Find and pin materials in Studio.')));
    for (const entity of rows)
        group.append(button(entity.title, () => entity.open(), 'secondary-button'));
    fold.append(group);
} fold.append(button(studioText('Знайти матеріал', 'Find a material'), () => openStudio('discover'), 'secondary-button')); section.append(fold); const quick = homeSurface.querySelector('.home-quick-start'); if (quick)
    quick.before(section);
else
    homeSurface.append(section); }
const studioHomeBefore = renderHome;
renderHome = function () { const result = studioHomeBefore(); renderStudioHome(); studioApplySkin(); return result; };
const studioLessonBefore = openLesson;
openLesson = function (id) { const result = studioLessonBefore(id); const lesson = lessonCatalog().find(item => item.id === id); if (lesson)
    studioRecord('lesson', id); return result; };
const studioToolBefore = openTool;
openTool = function (id) { const result = studioToolBefore(id); if (toolTabs.some(row => row[0] === id))
    studioRecord('tool', id); return result; };
const studioSearchBefore = searchItems;
searchItems = function () { const lang = document.documentElement.lang, rows = studioSearchBefore(); for (const lesson of lessonCatalog())
    if (!rows.some(row => row.id === lesson.id || row.kind === 'learning' && row.name === lesson.title[lang]))
        rows.push({ name: lesson.title[lang], body: lesson.course + ' ' + studioText('Пояснення, практика й перевірки', 'Explanation, practice and checks'), kind: 'learning', id: lesson.id, action: () => openLesson(lesson.id) }); for (const row of studioActivities)
    rows.push({ name: studioLabel(row), body: studioDescription(row), kind: 'tools', id: 'studio-' + row[0], action: () => openStudio(row[0]) }); return rows; };
function studioSearchDescription(item) { const entity = studioEntities().find(entity => entity.id === item.id || entity.title === item.name); return entity?.description || item.body || ''; }
document.addEventListener('click', event => { const link = event.target.closest('.resource-card a[href]'), card = link?.closest('.resource-card'); if (card?.dataset.resourceId)
    studioRecord('resource', card.dataset.resourceId); });
