function studioLessonExtras(body) { if (!body)
    return; let extrasNode = body.querySelector('.studio-lesson-extras'); if (!extrasNode) {
    extrasNode = E('div', 'studio-lesson-extras');
    for (const [id, uk, en] of [['glossary', 'Словник і шпаргалка', 'Glossary and reference'], ['map', 'Карта тем', 'Topic map'], ['debug', 'Знайти помилку', 'Find a bug'], ['desk', 'Робочий стіл', 'Workbench']])
        extrasNode.append(button(studioText(uk, en), () => openStudio(id), 'secondary-button'));
    body.querySelector('.lesson-connections')?.append(extrasNode);
} extrasNode.hidden = learningStep === 'test'; if (learningStep !== 'theory')
    return; let added = 0; for (const paragraph of body.querySelectorAll('.beginner-explanation p,.learning-theory p,.learning-reader>p')) {
    if (paragraph.dataset.studioTerms)
        continue;
    paragraph.dataset.studioTerms = 'true';
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode())
        if (!walker.currentNode.parentElement.closest('button,code,pre,a'))
            texts.push(walker.currentNode);
    for (const text of texts) {
        if (added >= 6)
            break;
        const match = text.textContent.match(/\b(DOM|API|padding|margin|selector|scope)\b/i);
        if (!match)
            continue;
        const fragment = document.createDocumentFragment(), label = match[0], id = /padding|margin/i.test(label) ? 'box' : label.toLowerCase(), term = studioTerms.find(item => item[0] === id);
        if (!term)
            continue;
        fragment.append(document.createTextNode(text.textContent.slice(0, match.index)));
        const control = button(label, () => { openStudio('glossary'); const input = studioBody.querySelector('input[type=search]'); if (input) {
            input.value = term[0];
            input.dispatchEvent(new Event('input'));
        } }, 'studio-inline-term');
        control.title = term[document.documentElement.lang === 'uk' ? 2 : 3];
        control.setAttribute('aria-label', studioText('Пояснити термін: ', 'Explain term: ') + label);
        fragment.append(control, document.createTextNode(text.textContent.slice(match.index + label.length)));
        text.replaceWith(fragment);
        added++;
    }
} }
const studioConnectionsBefore = renderLessonConnections;
renderLessonConnections = function (body) { studioConnectionsBefore(body); studioLessonExtras(body);if(typeof simplifyLesson==='function')simplifyLesson(body); };
function studioCourseArt(course) { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 120 52'); svg.setAttribute('class', 'studio-course-art'); svg.setAttribute('aria-hidden', 'true'); const paths = { HTML: 'M8 8H112V44H8ZM20 18H70M20 26H96M20 34H80', CSS: 'M8 8H38V23H8ZM45 8H75V23H45ZM82 8H112V23H82ZM8 30H38V45H8ZM45 30H75V45H45ZM82 30H112V45H82Z', JavaScript: 'M12 26H45L57 10H80M45 26L57 42H100M82 5L92 10L82 15M102 37L112 42L102 47', TypeScript: 'M20 8H100V44H20ZM37 18H65M51 18V35M76 30L82 36L94 21', Git: 'M25 8V44M25 15C25 30 75 8 75 30V44M18 8H32M18 44H32M68 44H82', Figma: 'M35 8H65V24H35ZM65 8H95V24H65ZM35 24H65V40H35ZM65 24H95V40H65ZM35 40H65V48H35Z' }; const path = document.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', paths[course] || paths.HTML); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.5'); svg.append(path); return svg; }
function studioLearningLaunch() { if (!learningLibrary)
    return; for (const [index, card] of [...learningLibrary.querySelectorAll('.learning-course-card')].entries())
    if (!card.querySelector('.studio-course-art'))
        card.querySelector('.learning-card-top')?.append(studioCourseArt(learningModules()[index]?.id)); if (learningLibrary.querySelector('.studio-learning-entry'))
    return; const entry = E('div', 'studio-learning-entry'); for (const [id, uk, en] of [['', 'Інструменти для навчання', 'Learning tools'], ['map', 'Маршрут і карта знань', 'Route and knowledge map'], ['review', 'Повторення', 'Review'], ['comic', 'Вебкомікси', 'Web comics']])
    entry.append(button(studioText(uk, en), () => openStudio(id), 'secondary-button')); learningLibrary.prepend(entry); }
const studioLibraryBefore = renderLearningLibrary;
renderLearningLibrary = function () { const result = studioLibraryBefore(); studioLearningLaunch();if(typeof renderLearningProjectEntry==='function')renderLearningProjectEntry(); return result; };
const studioToolsBefore = renderTools;
renderTools = function () { const result = studioToolsBefore(); const body = toolsView.querySelector('.tool-body');if(typeof renderUnifiedCatalog==='function'){if(toolCatalogOpen)renderUnifiedCatalog();else body?.querySelector('.studio-tools-entry')?.remove();return result;} if (body && !body.querySelector('.studio-tools-entry')) {
    const entry = E('div', 'studio-tools-entry');
    entry.append(E('span', '', studioText('Більше можливостей', 'More to explore')));
    for (const [id, uk, en] of [['', 'Студія', 'Studio'], ['palette', 'Палітри', 'Palettes'], ['type', 'Типографіка', 'Typography'], ['motion', 'Анімації', 'Animations'], ['builder', 'Полотно', 'Canvas']])
        entry.append(button(studioText(uk, en), () => openStudio(id), 'secondary-button'));
    body.append(entry);
} return result; };
function studioSettingsLaunch() { const form = Q('settings-form'); if (!form)
    return; const existing = form.querySelector('.studio-theme-launch'); if (existing) {
    existing.textContent = studioText('Візуальні теми: студія / папір / термінал', 'Visual themes: studio / paper / terminal');
    return;
} const control = button(studioText('Візуальні теми: студія / папір / термінал', 'Visual themes: studio / paper / terminal'), () => openStudio('themes'), 'secondary-button'); control.classList.add('studio-theme-launch'); form.append(control); }
const studioSettingsBefore = arrangeSettings;
arrangeSettings = function () { const result = studioSettingsBefore(); studioSettingsLaunch(); return result; };
window.addEventListener('languagechange', () => { studioApplySkin(); renderStudioHome(); if (studioWindow.dialog.open)
    renderStudio(); studioLearningLaunch(); studioSettingsLaunch(); studioProfileFinish(); });
// A data reset or cloud restore reconstructs optional data on the next render.
studioApplySkin();
renderStudioHome();
studioLearningLaunch();
studioSettingsLaunch();
studioProfileFinish();
