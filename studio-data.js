// Authored exercises and demonstrations. No external account or generated claims.
const studioText = (uk, en) => document.documentElement.lang === 'uk' ? uk : en;
const studioActivities = [
    ['discover', 'discover', 'Пошук і швидкий доступ', 'Search and quick access', 'Пошук із попереднім переглядом, закріплене й історія.', 'Preview search, pins and recent visits.'],
    ['map', 'learn', 'Карта знань', 'Knowledge map', 'Маршрут і сузір’я пов’язаних тем.', 'A route and constellation of connected topics.'],
    ['trace', 'learn', 'JavaScript по кроках', 'JavaScript step by step', 'Масиви, цикли й події зі станом після кожного кроку.', 'Arrays, loops and events with state after every step.'],
    ['debug', 'practice', 'Знайди помилку', 'Find the bug', 'Виправ HTML, CSS та JavaScript і перевір результат.', 'Repair HTML, CSS and JavaScript and check the result.'],
    ['replica', 'practice', 'За макетом', 'Build from a reference', 'Відтвори картку за зразком у власному CSS.', 'Recreate a card from a reference using your own CSS.'],
    ['access', 'practice', 'Доступна форма', 'Accessible form', 'Підписи, фокус і клавіатура на робочому прикладі.', 'Labels, focus and keyboard use in a working example.'],
    ['review', 'practice', 'Повторення', 'Review', 'Короткі питання за напрямками, які вже проходив.', 'Short questions based on tracks you have studied.'],
    ['component', 'learn', 'Розбери компонент', 'Build a component', 'Склади картку, меню чи форму крок за кроком.', 'Build a card, menu or form step by step.'],
    ['browser', 'learn', 'Як браузер малює сайт', 'How browsers render', 'HTML → DOM → стилі → розміри → пікселі.', 'HTML → DOM → styles → layout → pixels.'],
    ['glossary', 'learn', 'Словник і шпаргалки', 'Glossary and reference', 'Пояснення термінів і синтаксис поруч із редактором.', 'Terms and syntax beside the editor.'],
    ['palette', 'design', 'Палітри', 'Palettes', 'Кольори, контраст і експорт CSS-змінних.', 'Colors, contrast and CSS variable export.'],
    ['type', 'design', 'Типографіка', 'Typography', 'Шкала заголовків і живий текстовий зразок.', 'A heading scale and live text specimen.'],
    ['inspect', 'design', 'Інспектор CSS', 'CSS inspector', 'Обери елемент і розбери box model та стилі.', 'Select an element and inspect its box model and styles.'],
    ['motion', 'design', 'Конструктор анімацій', 'Animation builder', 'Тривалість, рух і easing з готовим кодом.', 'Duration, movement and easing with usable code.'],
    ['gallery', 'showcase', 'Галерея експериментів', 'Experiment gallery', 'Інтерактивні CSS-постери з відкритим кодом.', 'Interactive CSS posters with source code.'],
    ['comic', 'showcase', 'Вебкомікси', 'Web comics', 'Історії браузера, сервера та CSS.', 'Stories about browsers, servers and CSS.'],
    ['cards', 'showcase', 'Картки навичок', 'Skill cards', 'Картки відкриваються після справжньої практики.', 'Cards unlock after completed practice.'],
    ['present', 'showcase', 'Презентація проєкту', 'Project presentation', 'Робота на весь екран і рамки пристроїв.', 'Fullscreen work presentation and device frames.'],
    ['desk', 'workshop', 'Робочий стіл', 'Workbench', 'Пояснення, редактор і результат у спільному просторі.', 'Instructions, editor and output in one space.'],
    ['builder', 'workshop', 'Полотно інтерфейсу', 'Interface canvas', 'Додавай і переміщуй блоки, отримуй HTML і CSS.', 'Add and reorder blocks, then export HTML and CSS.'],
    ['diff', 'workshop', 'Порівняння коду', 'Code comparison', 'Покажи додані й видалені рядки.', 'See added and removed lines.'],
    ['themes', 'design', 'Візуальні теми', 'Visual themes', 'Графітова студія, папір і термінал.', 'Graphite studio, paper and terminal.']
];
const studioTerms = [
    ['DOM', 'DOM', 'Дерево елементів, яке браузер будує з HTML. JavaScript може читати й змінювати це дерево.', 'The element tree a browser builds from HTML. JavaScript can read and change it.', 'document.querySelector("h1").textContent = "Hello";'],
    ['selector', 'Селектор / Selector', 'Шаблон вибору елементів: .card шукає клас card, #menu — ID menu.', 'A pattern selecting elements: .card matches a class, #menu matches an ID.', '.card { padding: 16px; }'],
    ['box', 'Box model', 'Вміст, внутрішній відступ padding, рамка border і зовнішній відступ margin утворюють коробку елемента.', 'Content, padding, border and margin form an element’s box.', '* { box-sizing: border-box; }'],
    ['event', 'Подія / Event', 'Повідомлення про дію: click, input або submit. Обробник — функція, яку запускають у відповідь.', 'A notification such as click, input or submit. A handler is the function that responds.', 'button.addEventListener("click", () => { count++; });'],
    ['array', 'Масив / Array', 'Впорядкований список значень. Індекси починаються з нуля. map створює новий масив.', 'An ordered list of values. Indexes start at zero. map creates a new array.', '[1, 2, 3].map(number => number * 2);'],
    ['scope', 'Область видимості / Scope', 'Визначає, де доступна змінна. let і const усередині блоку не доступні поза цим блоком.', 'Determines where a variable is available. Block-scoped let and const are not available outside that block.', 'if (ready) { const message = "Ready"; }'],
    ['async', 'Асинхронність / Async', 'Операція може завершитися пізніше. await чекає Promise всередині async-функції, не блокуючи весь інтерфейс.', 'An operation can complete later. await waits for a Promise inside an async function without blocking the whole interface.', 'const response = await fetch(url);'],
    ['git', 'Коміт / Commit', 'Знімок підготовлених змін із повідомленням. git add готує зміни, git commit записує їх в історію.', 'A snapshot of staged changes with a message. git add stages changes and git commit records them.', 'git add .\ngit commit -m "Build page"'],
    ['focus', 'Фокус / Focus', 'Елемент, який зараз отримує клавіатурні події. Tab переміщує фокус; видима рамка допомагає його знайти.', 'The element receiving keyboard events. Tab moves focus; a visible outline helps people find it.', 'button:focus-visible { outline: 2px solid blue; }'],
    ['responsive', 'Адаптивність / Responsive', 'Компонування пристосовується до доступного місця. Media query перевіряє умови, наприклад ширину viewport.', 'A layout adapts to available space. Media queries test conditions such as viewport width.', '@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }'],
    ['api', 'API', 'Узгоджений спосіб обміну даними між програмами. HTTP API може повертати JSON; помилки також потрібно обробляти.', 'An agreed way for programs to exchange data. An HTTP API can return JSON; failures need handling too.', 'if (!response.ok) throw new Error("Request failed");'],
    ['semantic', 'Семантика / Semantics', 'Назва елемента пояснює його призначення: button запускає дію, a веде за посиланням, nav містить навігацію.', 'Element names convey purpose: button triggers an action, a navigates, nav contains navigation.', '<nav aria-label="Main"><a href="#about">About</a></nav>']
];
const studioBugs = [
    { id: 'html-label', kind: 'html', name: ['Підпис поля', 'Field label'], task: ['Зв’яжи label з email через for та id. Збережи type="email".', 'Connect the label to the email input with for and id. Keep type="email".'], start: '<label>Email</label>\n<input id="email" type="email">', hint: ['Атрибут for має дорівнювати id поля.', 'The for attribute must equal the input ID.'] },
    { id: 'html-button', kind: 'html', name: ['Кнопка замість div', 'A real button'], task: ['Заміни div на button із type="button" та текстом Save.', 'Replace the div with a button with type="button" and text Save.'], start: '<div class="button">Save</div>', hint: ['Семантична кнопка вже підтримує клавіатуру.', 'A semantic button already supports the keyboard.'] },
    { id: 'css-grid', kind: 'css', name: ['Зламана сітка', 'Broken grid'], task: ['Зроби .grid сіткою з двох колонок та gap 16px.', 'Make .grid a two-column grid with a 16px gap.'], start: '.grid { display: block; grid-template-columns: 1fr 1fr; gap: 16px; }', hint: ['grid-template-columns працює, коли display дорівнює grid.', 'grid-template-columns works when display is grid.'] },
    { id: 'css-box', kind: 'css', name: ['Ширина з padding', 'Width with padding'], task: ['Залиш width 200px і padding 20px. Зроби так, щоб повна ширина .card була 200px.', 'Keep width 200px and padding 20px. Make the total .card width equal 200px.'], start: '.card { width: 200px; padding: 20px; box-sizing: content-box; }', hint: ['border-box включає padding і border у задану ширину.', 'border-box includes padding and borders in the declared width.'] },
    { id: 'js-double', kind: 'js', name: ['Загублений return', 'Missing return'], task: ['Функція double має повернути новий масив подвоєних чисел.', 'The double function should return a new array of doubled numbers.'], start: 'function double(values) {\n  return values.map(n => { n * 2; });\n}', hint: ['Блок стрілкової функції з {} потребує return.', 'An arrow function block using {} needs return.'] },
    { id: 'js-total', kind: 'js', name: ['Сума чисел', 'Sum numbers'], task: ['Функція total має повертати суму масиву; для порожнього — 0.', 'The total function must return the sum; for an empty array return 0.'], start: 'function total(values) {\n  return values.reduce((sum, n) => sum + n);\n}', hint: ['Передай початкове значення 0 другим аргументом reduce.', 'Pass an initial value of 0 as reduce’s second argument.'] }
];
const studioQuestions = [
    ['HTML', 'Що робить label for="email"?', 'What does label for="email" do?', ['Пов’язує підпис із полем id="email"', 'Надсилає лист', 'Задає колір'], ['Connects the label to id="email"', 'Sends an email', 'Sets a color'], 0, 'html-forms'],
    ['CSS', 'Що входить у width при border-box?', 'What does border-box width include?', ['Лише текст', 'Вміст, padding і border', 'Зовнішній margin'], ['Only text', 'Content, padding and borders', 'Outer margins'], 1, 'css-box'],
    ['JavaScript', 'Що повертає map?', 'What does map return?', ['Новий масив', 'Той самий масив', 'Завжди число'], ['A new array', 'The same array', 'Always a number'], 0, 'javascript-arrays'],
    ['Git', 'Що готує зміни до коміту?', 'What stages changes for a commit?', ['git push', 'git status', 'git add'], ['git push', 'git status', 'git add'], 2, 'git-commit'],
    ['TypeScript', 'Що означає name: string?', 'What does name: string mean?', ['name має бути рядком', 'name — CSS-клас', 'name має бути числом'], ['name must be a string', 'name is a CSS class', 'name must be a number'], 0, 'typescript-types'],
    ['Figma', 'Навіщо Auto Layout?', 'What is Auto Layout for?', ['Запуск JS', 'Розташування й відступи елементів', 'Публікація backend'], ['Running JS', 'Element layout and spacing', 'Publishing a backend'], 1, 'figma-auto-layout']
];
