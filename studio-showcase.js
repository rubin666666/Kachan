studioRenderers.comic = parent => { const select = studioSelect(parent, studioText('Історія', 'Story'), [['request', studioText('Подорож сторінки', 'A page’s journey')], ['css', studioText('Хто вирішує колір?', 'Who decides the color?')], ['event', studioText('Один клік', 'One click')]], 'request'), grid = E('div', 'studio-comic'); parent.append(grid); const stories = { request: [['Браузер', 'Потрібна сторінка /about. Надсилаю HTTP-запит.', 'Browser', 'I need /about. Sending an HTTP request.'], ['Сервер', 'Ось HTML і посилання на CSS та JS.', 'Server', 'Here is HTML with CSS and JS links.'], ['Браузер', 'Завантажую файли й будую сторінку. Помилки мережі також можливі.', 'Browser', 'I load the files and build the page. Network requests can fail too.']], css: [['HTML', 'У мене є h1 з класом title.', 'HTML', 'I have an h1 with class title.'], ['CSS', 'Порівнюємо селектори, порядок і походження правил.', 'CSS', 'We compare selectors, order and rule origins.'], ['Браузер', 'Застосовую результат каскаду. Специфічність — лише одна з його частин.', 'Browser', 'I apply the cascade result. Specificity is just one part of the cascade.']], event: [['Кнопка', 'Мене натиснули. Створюється click.', 'Button', 'I was pressed. A click event is created.'], ['JavaScript', 'Зареєстрований обробник змінює стан count.', 'JavaScript', 'The registered handler changes count.'], ['DOM', 'Оновлений текст стає видимим. Сам HTML не збільшує лічильник.', 'DOM', 'The updated text becomes visible. HTML alone does not increment a counter.']] }; function draw() { grid.replaceChildren(); for (const [index, panel] of stories[select.value].entries()) {
    const card = E('article', 'studio-comic-panel');
    card.append(E('small', '', String(index + 1).padStart(2, '0')), index === 0 ? studioMascot() : E('span', 'studio-comic-avatar', index === 1 ? '{ }' : '</>'), E('h3', '', panel[document.documentElement.lang === 'uk' ? 0 : 2]), E('p', '', panel[document.documentElement.lang === 'uk' ? 1 : 3]));
    grid.append(card);
} } select.onchange = draw; draw(); };
studioRenderers.cards = parent => { const grid = E('div', 'studio-skill-cards'); for (const module of learningModules()) {
    const earned = module.lessons.some(lesson => { if (lesson.id.startsWith('html-'))
        return !!htmlCourse.lessons[lesson.id.slice(5)]?.completed; return !!academy.states[lesson.id]?.practicePassed; }), card = E('article', 'studio-skill-card' + (earned ? ' earned' : ''));
    card.append(E('small', '', earned ? studioText('ВІДКРИТО', 'UNLOCKED') : studioText('ПОКИ ЗАКРИТО', 'LOCKED')), E('span', 'studio-skill-symbol', ({ HTML: '</>', CSS: '{ }', JavaScript: 'JS', TypeScript: 'TS', Git: '↗', Figma: '◈' })[module.id]), E('h3', '', module.id), E('p', '', earned ? studioText('Ти пройшов практику цього напряму.', 'You completed practice in this track.') : studioText('Заверши практику хоча б одного уроку, щоб відкрити картку.', 'Complete at least one lesson’s practice to unlock this card.')));
    card.append(button(studioText('До уроків', 'Go to lessons'), () => { studioWindow.shut(); openLesson((module.lessons.find(lesson => !learningDone(lesson)) || module.lessons[0]).id); }, 'secondary-button'));
    grid.append(card);
} parent.append(grid); studioNote(parent, 'Це особиста колекція прогресу, не сертифікат професійної кваліфікації.', 'This is a personal progress collection, not a professional qualification certificate.'); };
studioRenderers.present = parent => { if (!projects.length) {
    studioEmpty(parent, 'Додай свій перший проєкт, щоб оформити презентацію.', 'Add your first project to create a presentation.', [studioText('До проєктів', 'Go to projects'), () => { studioWindow.shut(); location.hash = 'projects'; showView(); }]);
    return;
} const controls = E('div', 'studio-inline-actions'), select = studioSelect(controls, studioText('Проєкт', 'Project'), projects.map(project => [project.id, project.name]), projects[0].id), device = studioSelect(controls, studioText('Пристрій', 'Device'), [['laptop', studioText('Ноутбук', 'Laptop')], ['phone', studioText('Телефон', 'Phone')]], 'laptop'), stage = E('section', 'studio-presentation'); parent.append(controls, stage); function draw() { stage.replaceChildren(); stage.className = 'studio-presentation ' + device.value; const project = projects.find(item => item.id === select.value); stage.append(E('p', 'eyebrow', 'KACHAN / PROJECT'), E('h2', '', project.name), E('p', '', project.descriptionKey === 'projectDescription' ? t().projectDescription : project.description), E('p', 'studio-note', project.technologies.join(' · '))); const shell = E('div', 'studio-device'); shell.append(E('div', 'studio-device-bar', '● ● ●')); const area = E('div', 'studio-device-screen'); shell.append(area); stage.append(shell); if (project.live && validProjectUrl(project.live)) {
    const load = button(studioText('Завантажити сайт у рамці', 'Load website in frame'), () => { const frame = E('iframe'); frame.title = project.name; frame.setAttribute('sandbox', 'allow-scripts'); frame.referrerPolicy = 'no-referrer'; frame.src = project.live; area.replaceChildren(frame); }, 'primary-button');
    area.append(load, E('p', 'studio-note', studioText('Зовнішній сайт завантажиться після натискання. Деякі сайти забороняють вбудовування.', 'The external site loads after you select this button. Some sites block embedding.')));
    const link = E('a', 'secondary-button', studioText('Відкрити окремо ↗', 'Open separately ↗'));
    link.href = project.live;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    stage.append(link);
}
else
    area.append(E('h3', '', project.name), E('p', '', studioText('Додай live-посилання в деталях проєкту, щоб показати справжній сайт. Це рамка презентації, не скриншот твоєї роботи.', 'Add a live URL in project details to show the actual site. This is a presentation frame, not a screenshot of your work.'))); if (project.github && validProjectUrl(project.github)) {
    const github = E('a', 'secondary-button', 'GitHub ↗');
    github.href = project.github;
    github.target = '_blank';
    github.rel = 'noopener noreferrer';
    stage.append(github);
} } controls.append(button(studioText('На весь екран', 'Fullscreen'), async () => { try {
    if (!document.fullscreenElement)
        await stage.requestFullscreen();
    else
        await document.exitFullscreen();
}
catch {
    notice(studioText('Браузер не дозволив повний екран. Презентація доступна у вікні.', 'The browser blocked fullscreen. Use the windowed presentation.'));
} }, 'secondary-button')); select.onchange = device.onchange = draw; studioDisposers.push(() => { if (document.fullscreenElement === stage)
    document.exitFullscreen().catch(() => { }); }); draw(); };
function studioProfileFinish() { const root = Q('profile-view'); root.classList.add('studio-profile'); const hero = root.querySelector('.profile-hero'); if (hero && !hero.querySelector('.studio-profile-mark')) {
    const mark = E('span', 'studio-profile-mark', '</>');
    mark.setAttribute('aria-hidden', 'true');
    hero.prepend(mark);
} const controls = root.querySelector('.profile-controls'); if (controls && !controls.querySelector('.studio-present-profile')) {
    const control = button(studioText('Презентувати роботу', 'Present a project'), () => openStudio('present'), 'secondary-button');
    control.classList.add('studio-present-profile');
    controls.append(control);
} }
const studioProfileBefore = renderProfile;
renderProfile = function () { const result = studioProfileBefore(); studioProfileFinish(); return result; };
