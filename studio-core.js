const studioRenderers = {}, studioDisposers = [];
function studioCleanup() { for (const dispose of studioDisposers.splice(0))
    dispose(); }
let studioActive = '', studioGeneration = 0;
function studioState() { if (validStudio(extras.preferences.studio))
    return extras.preferences.studio; return extras.preferences.studio = { version: 1, skin: 'graphite', pins: [], history: [], solved: [], drafts: {}, blocks: [], colors: ['#101923', '#edf4f8', '#79caff'], typeSize: 16, typeScale: 1.25, typeLine: 1.7, typeFont: 'system' }; }
function studioSave() { return persistExtras(); }
function studioRecord(kind, id) { const state = studioState(); state.history = [{ kind, id, at: new Date().toISOString() }, ...state.history.filter(item => item.kind !== kind || item.id !== id)].slice(0, 30); studioSave(); }
function studioSolved(id) { const state = studioState(); if (!state.solved.includes(id)) {
    state.solved.push(id);
    studioSave();
} }
function studioLabel(row) { return row[document.documentElement.lang === 'uk' ? 2 : 3]; }
function studioDescription(row) { return row[document.documentElement.lang === 'uk' ? 4 : 5]; }
function studioNote(parent, uk, en) { const note = E('p', 'studio-note', studioText(uk, en)); parent.append(note); return note; }
function studioField(parent, label, tag = 'input', value = '') { const field = E('label', 'studio-field'), control = E(tag); field.append(E('span', '', label), control); control.value = value; parent.append(field); return control; }
function studioSelect(parent, label, rows, value) { const select = studioField(parent, label, 'select'); selectOptions(select, rows, value); return select; }
function studioRange(parent, label, min, max, step, value, change) { const input = studioField(parent, label); input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = value; const output = E('output', '', String(value)); input.after(output); input.oninput = () => { output.textContent = input.value; change(Number(input.value)); }; return input; }
function studioCode(parent, value) { const shell = E('div', 'studio-source'), pre = E('pre', 'studio-code', value), copy = button(studioText('Копіювати код', 'Copy code'), () => copyToolText(pre.textContent), 'secondary-button'); shell.append(pre, copy); parent.append(shell); return pre; }
function studioEditor(parent, label, value, save) { const input = studioField(parent, label, 'textarea', value); input.classList.add('studio-editor'); input.spellcheck = false; input.maxLength = 20000; input.oninput = () => save?.(input.value); return input; }
function studioStatus(parent) { const status = E('p', 'studio-status'); status.setAttribute('role', 'status'); parent.append(status); return status; }
function studioEmpty(parent, uk, en, action) { const empty = E('div', 'studio-empty'); empty.append(E('p', '', studioText(uk, en))); if (action)
    empty.append(button(action[0], action[1], 'secondary-button')); parent.append(empty); }
function studioSplit(parent) { const split = E('div', 'studio-split'), left = E('section'), right = E('section'); split.append(left, right); parent.append(split); return [left, right]; }
function studioFrame(parent, files) { const frame = E('iframe', 'studio-frame'); frame.title = studioText('Результат прикладу', 'Example result'); frame.setAttribute('sandbox', ''); frame.srcdoc = safeToolDocument(files); parent.append(frame); return frame; }
function studioMascot() { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 120 120'); svg.setAttribute('class', 'studio-mascot'); svg.setAttribute('aria-hidden', 'true'); for (let row = 0; row < 5; row++)
    for (let col = 0; col < 3; col++) {
        const cell = document.createElementNS(svg.namespaceURI, 'rect');
        for (const [key, val] of Object.entries({ x: 40 + col * 14, y: 18 + row * 13, width: 11, height: 10, rx: 3, fill: 'currentColor', opacity: 1 - row * .08 }))
            cell.setAttribute(key, val);
        svg.append(cell);
    } for (const [d, opacity] of [['M58 106Q12 88 22 54Q47 62 58 106', .45], ['M58 106Q104 83 100 45Q70 57 58 106', .7]]) {
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('opacity', opacity);
    svg.append(path);
} return svg; }
Object.assign(translations.uk, { studioTitle: 'Студія Kachan' });
Object.assign(translations.en, { studioTitle: 'Kachan Studio' });
const studioBody = E('div', 'studio-body'), studioWindow = utilityWindow('studio-window', 'studioTitle', studioBody);
studioWindow.dialog.addEventListener('close', () => { studioGeneration++; studioCleanup(); for (const frame of studioBody.querySelectorAll('iframe'))
    frame.srcdoc = ''; if (typeof renderStudioHome === 'function')
    renderStudioHome(); });
function openStudio(id = '') { studioGeneration++; studioActive = studioActivities.some(row => row[0] === id) ? id : ''; if (studioActive)
    studioRecord('activity', studioActive); renderStudio(); studioWindow.open(); studioWindow.dialog.scrollTop = 0; }
function renderStudio() { studioCleanup(); studioBody.replaceChildren(); const lang = document.documentElement.lang; if (!studioActive) {
    const hero = E('header', 'studio-intro');
    hero.append(studioMascot(), E('div'));
    hero.lastChild.append(E('p', 'eyebrow', 'KACHAN / STUDIO'), E('h2', '', studioText('Спробуй. Зрозумій. Збери.', 'Try. Understand. Build.')), E('p', '', studioText('Обери одну дію. Решта інструментів залишиться поруч.', 'Pick one activity. The other tools will stay nearby.')));
    studioBody.append(hero);
    const nav = E('div', 'studio-section-filters'), grid = E('div', 'studio-activity-grid');
    let group = 'all';
    const draw = () => { grid.replaceChildren(); for (const row of studioActivities.filter(row => group === 'all' || row[1] === group)) {
        const card = button('', () => openStudio(row[0]), 'studio-activity');
        card.append(E('small', '', studioText({discover:'МАТЕРІАЛИ',learn:'НАВЧАННЯ',practice:'ПРАКТИКА',design:'ДИЗАЙН',workshop:'МАЙСТЕРНЯ',showcase:'ГАЛЕРЕЯ'}[row[1]],row[1].toUpperCase())), E('strong', '', studioLabel(row)), E('span', '', studioDescription(row)));
        grid.append(card);
    } };
    for (const [key, uk, en] of [['all', 'Усе', 'All'], ['learn', 'Розібратися', 'Understand'], ['practice', 'Практика', 'Practice'], ['design', 'Дизайн', 'Design'], ['workshop', 'Створити', 'Build'], ['showcase', 'Натхнення', 'Explore'], ['discover', 'Мої матеріали', 'My materials']]) {
        const control = button(studioText(uk, en), () => { group = key; for (const item of nav.children)
            item.setAttribute('aria-pressed', String(item === control)); draw(); }, 'secondary-button');
        control.setAttribute('aria-pressed', String(key === 'all'));
        nav.append(control);
    }
    studioBody.append(nav, grid);
    draw();
    return;
} const row = studioActivities.find(row => row[0] === studioActive), bar = E('div', 'studio-activity-heading'); bar.append(button(studioText('← Уся студія', '← Studio'), () => openStudio(), 'learning-back'), E('h2', '', studioLabel(row))); studioBody.append(bar); studioNote(studioBody, row[4], row[5]); const content = E('div', 'studio-activity-body'); studioBody.append(content); const renderer = studioRenderers[studioActive]; if (renderer)
    renderer(content);
else
    studioEmpty(content, 'Цей інструмент не завантажився. Онови сторінку.', 'This tool did not load. Reload the page.'); }
function studioDownload(name, text, type = 'text/plain') { const link = E('a'), url = URL.createObjectURL(new Blob([text], { type })); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function studioDiff(before, after) { const a = before.split('\n').slice(0, 200), b = after.split('\n').slice(0, 200), table = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1)); for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
        table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]); let i = 0, j = 0; const out = []; while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j])
        out.push([' ', a[i++]]), j++;
    else if (j < b.length && (i === a.length || table[i][j + 1] >= table[i + 1][j]))
        out.push(['+', b[j++]]);
    else
        out.push(['−', a[i++]]);
} return out; }
studioRenderers.diff = parent => { const [left, right] = studioSplit(parent), before = studioEditor(left, studioText('До', 'Before'), studioState().drafts.diffBefore || '<h1>Hello</h1>', value => { studioState().drafts.diffBefore = value; studioSave(); draw(); }), after = studioEditor(left, studioText('Після', 'After'), studioState().drafts.diffAfter || '<h1>Hello, Kachan</h1>\n<p>Keep building.</p>', value => { studioState().drafts.diffAfter = value; studioSave(); draw(); }), out = E('pre', 'studio-diff'); right.append(out); function draw() { out.replaceChildren(); for (const [kind, text] of studioDiff(before.value, after.value))
    out.append(E('span', kind === '+' ? 'diff-add' : kind === '−' ? 'diff-remove' : '', kind + ' ' + text + '\n')); } studioNote(right, '+ додано, − видалено. Порівнюються перші 200 рядків кожного тексту.', '+ added, − removed. The first 200 lines of each text are compared.'); draw(); };
