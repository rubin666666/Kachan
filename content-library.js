// References are reusable content, not automatically inserted into personal data.
const referenceItems=[];
function reference(group,title,uk,en,code){referenceItems.push({id:'ref-'+referenceItems.length,group,title:bi(...title),description:bi(uk,en),code});}
reference('CSS',['Box sizing','Box sizing'],'border-box включає padding і border у задану ширину. Margin залишається зовні.','border-box includes padding and border in the specified width. Margin remains outside.','*, *::before, *::after { box-sizing: border-box; }');
reference('CSS',['Flexbox: вирівнювання','Flexbox alignment'],'justify-content працює вздовж головної осі, align-items — поперек. При flex-direction: column осі змінюються.','justify-content follows the main axis; align-items follows the cross axis. column changes the axes.','.row { display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }');
reference('CSS',['Grid: колонки','Grid columns'],'minmax(0, 1fr) дозволяє трекам стискатися; gap задає відстань без margin на кожній картці.','minmax(0, 1fr) lets tracks shrink; gap creates spacing without margins on every card.','.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }');
reference('CSS',['Розміри й одиниці','Sizes and units'],'rem залежить від кореневого шрифту, % — від контексту властивості. clamp обмежує гнучке значення мінімумом і максимумом.','rem uses the root font size; percentages depend on property context. clamp bounds a flexible value.','h1 { font-size: clamp(2rem, 5vw, 4rem); }\nmain { width: min(100% - 32px, 1100px); margin-inline: auto; }');
reference('CSS',['Позиціонування','Positioning'],'absolute виходить зі звичайного потоку. relative на обгортці задає контекст для розташування дочірнього absolute.','absolute leaves normal flow. A relative wrapper establishes the context for its absolute child.','.card { position: relative; }\n.badge { position: absolute; inset-block-start: 12px; inset-inline-end: 12px; }');
reference('CSS',['Видимий фокус','Visible focus'],'Не прибирай індикатор клавіатурного фокусу. Перевір його контраст із фоном.','Keep a visible keyboard focus indicator and check contrast with its background.',':focus-visible { outline: 3px solid #176c9d; outline-offset: 3px; }');
reference('CSS',['Зменшення руху','Reduced motion'],'Для користувача з відповідним налаштуванням прибирай необов’язкову анімацію.','Remove nonessential animation when the user requests reduced motion.','@media (prefers-reduced-motion: reduce) {\n  .card { animation: none; transition: none; }\n}');
reference('JavaScript',['map: перетворити масив','map: transform an array'],'Повертає новий масив результатів. Для фільтрації використовуй filter.','Returns a new array of results. Use filter to select items.','const names = [{ name: "HTML" }, { name: "CSS" }].map(item => item.name);');
reference('JavaScript',['filter: відібрати елементи','filter: select items'],'Зберігає елементи, для яких callback повертає істинне значення. Порожній результат — [].','Keeps items whose callback returns a truthy value. An empty result is [].','const active = tasks.filter(task => !task.completed);');
reference('JavaScript',['find: один елемент','find: one item'],'Повертає перший збіг або undefined. Перед доступом до поля перевір результат.','Returns the first match or undefined. Check before reading a field.','const item = items.find(item => item.id === selectedId);\nconsole.log(item?.name ?? "Not found");');
reference('JavaScript',['some та every','some and every'],'some перевіряє хоча б один збіг, every — всі. Для порожнього масиву every повертає true.','some checks at least one match; every checks all items. every on an empty array returns true.','const hasDone = tasks.some(task => task.completed);\nconst allDone = tasks.length > 0 && tasks.every(task => task.completed);');
reference('JavaScript',['reduce: підсумок','reduce: aggregate'],'Задавай початкове значення, щоб порожній масив також мав результат.','Provide an initial value so an empty array has a result.','const total = prices.reduce((sum, price) => sum + price, 0);');
reference('JavaScript',['sort: сортування','sort: sorting'],'sort змінює масив; зроби копію, якщо оригінал треба зберегти. Для чисел потрібен comparator.','sort mutates the array; copy it when the original must stay intact. Numbers need a comparator.','const sorted = [...numbers].sort((a, b) => a - b);');
reference('JavaScript',['input та change','input and change'],'input реагує на редагування тексту. change — на підтвердження зміни відповідного поля.','input reacts to text edits; change reacts to a committed change for the control.','search.addEventListener("input", event => filter(event.target.value));\nselect.addEventListener("change", event => choose(event.target.value));');
reference('JavaScript',['submit та preventDefault','submit and preventDefault'],'Слухай форму, щоб працювали і кнопка, і Enter. preventDefault скасовує стандартне відправлення.','Listen on the form so the button and Enter both work. preventDefault cancels default submission.','form.addEventListener("submit", event => {\n  event.preventDefault();\n  const data = new FormData(form);\n});');
reference('JavaScript',['keydown та Escape','keydown and Escape'],'Перевір event.key. Не перехоплюй глобальні клавіші під час введення без потреби.','Check event.key. Avoid intercepting global keys unnecessarily while typing.','dialog.addEventListener("keydown", event => {\n  if (event.key === "Escape") console.log("Escape pressed");\n});');
reference('JavaScript',['try / catch / finally','try / catch / finally'],'catch обробляє помилку, finally повертає інтерфейс у нормальний стан.','catch handles a failure; finally restores interface state.','try {\n  await load();\n} catch (error) {\n  status.textContent = error.message;\n} finally {\n  button.disabled = false;\n}');
reference('Git',['Перевірити зміни','Inspect changes'],'status показує стан файлів, diff — незастейджені зміни, diff --staged — те, що піде в коміт.','status shows file state; diff shows unstaged changes; diff --staged shows the next commit.','git status\ngit diff\ngit diff --staged');
reference('Git',['Додати й закомітити','Stage and commit'],'Додавай конкретні файли та перевір staged-зміни перед комітом.','Stage specific files and inspect staged changes before committing.','git add index.html style.css\ngit diff --staged\ngit commit -m "Add responsive layout"');
reference('Git',['Гілки','Branches'],'Нова гілка відокремлює роботу. Перед перемиканням перевір незбережені зміни.','A branch separates work. Inspect uncommitted changes before switching.','git status\ngit switch -c feature/menu\ngit switch main');
reference('Git',['Отримати зміни','Fetch changes'],'fetch завантажує remote-історію без автоматичного об’єднання з поточною гілкою.','fetch downloads remote history without automatically merging into the current branch.','git fetch origin\ngit log --oneline --graph --all -10');
reference('Git',['Скасувати staging','Unstage a file'],'Прибирає файл зі staging, зберігаючи його робочі зміни. Це не команда видалення файла.','Removes a file from staging while retaining its working changes. It does not delete the file.','git restore --staged index.html');
reference('Git',['Скасувати коміт через revert','Undo a commit with revert'],'Створює новий коміт, який скасовує попередній. Для спільної історії це часто доречніше за переписування.','Creates a new commit undoing an earlier commit, often preferable to rewriting shared history.','git revert COMMIT_SHA');
reference('DevTools',['Інструменти браузера','Browser tools'],'У багатьох настільних браузерах F12 відкриває DevTools. На деяких клавіатурах потрібен Fn.','F12 opens DevTools in many desktop browsers. Some keyboards require Fn.','F12\nWindows/Linux Chromium: Ctrl + Shift + I\nmacOS Chromium: Cmd + Option + I');
reference('Editor',['Пошук і навігація у VS Code','Search and navigation in VS Code'],'Комбінації для стандартного VS Code; користувацькі налаштування можуть змінити їх.','Default VS Code bindings; custom settings may change them.','Windows/Linux: Ctrl+P (file), Ctrl+Shift+F (workspace search), Ctrl+/ (comment)\nmacOS: Cmd+P, Cmd+Shift+F, Cmd+/');
reference('HTML',['Label для поля','Labels for fields'],'for має збігатися з унікальним id. Placeholder не замінює label.','for must match a unique id. A placeholder does not replace a label.','<label for="email">Email</label>\n<input id="email" name="email" type="email" autocomplete="email" required>');
reference('HTML',['Кнопка чи посилання','Button or link'],'Посилання переходить за адресою, кнопка виконує дію. Не використовуй href="#" замість кнопки.','Links navigate to an address; buttons perform actions. Do not use href="#" as a button.','<a href="./about.html">About</a>\n<button type="button">Open dialog</button>');
reference('HTML',['Зображення й alt','Images and alt'],'alt пояснює зміст або призначення. Для декоративного зображення він порожній.','alt describes meaning or purpose; decorative images have empty alt.','<img src="chart.png" alt="Sales increased from 10 to 20 orders" width="800" height="400">\n<img src="decoration.svg" alt="">');

const exampleItems=[];
function example(id,group,title,uk,en,code){exampleItems.push({id,group,title:bi(...title),description:bi(uk,en),code});}
example('form','HTML',['Форма з перевіркою','Form with validation'],'Цілий HTML-приклад. Працює через submit і зберігає ввід. Серверної перевірки та відправлення тут немає.','A complete HTML example using submit and preserving input. No server validation or sending is included.',`<form id="contact">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Check</button>
</form>
<p id="status" role="status"></p>
<script>
const form = document.querySelector('#contact');
form.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#status').textContent = 'Valid email: ' + new FormData(form).get('email');
});
</script>`);
example('menu','HTML',['Меню з розгортанням','Expandable menu'],'Цілий HTML-приклад: кнопка синхронізує aria-expanded і hidden; Escape закриває меню та повертає фокус.','Complete HTML: the button synchronizes aria-expanded and hidden; Escape closes and restores focus.',`<button id="toggle" type="button" aria-controls="nav" aria-expanded="false">Menu</button>
<nav id="nav" aria-label="Main" hidden><a href="#home">Home</a> <a href="#about">About</a></nav>
<script>
const toggle = document.querySelector('#toggle');
const nav = document.querySelector('#nav');
function setOpen(open) {
  nav.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setOpen(nav.hidden));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !nav.hidden) { setOpen(false); toggle.focus(); }
});
</script>`);
example('dialog','HTML',['Модальне вікно','Modal dialog'],'Цілий HTML-приклад із native dialog: відкриття, Escape, кнопка закриття та повернення фокусу.','Complete HTML with native dialog, opening, Escape, closing and focus restoration.',`<button id="open" type="button">Open dialog</button>
<dialog id="info" aria-labelledby="title">
  <h2 id="title">Information</h2>
  <p>Dialog content</p>
  <form method="dialog"><button>Close</button></form>
</dialog>
<script>
const open = document.querySelector('#open');
const dialog = document.querySelector('#info');
open.addEventListener('click', () => dialog.showModal());
dialog.addEventListener('close', () => open.focus());
</script>`);
example('search','HTML',['Пошук у списку','List search'],'Цілий HTML-приклад. Порожній запит показує всі записи, текст із розміткою виводиться безпечно.','Complete HTML. Empty input shows every item and text containing markup is rendered safely.',`<label for="search">Search</label><input id="search" type="search">
<ul id="results"></ul><p id="count" role="status"></p>
<script>
const names = ['HTML', 'CSS', 'JavaScript'];
function render(query = '') {
  const matches = names.filter(name => name.toLowerCase().includes(query.trim().toLowerCase()));
  const list = document.querySelector('#results');
  list.replaceChildren();
  for (const name of matches) { const li = document.createElement('li'); li.textContent = name; list.append(li); }
  document.querySelector('#count').textContent = matches.length ? matches.length + ' results' : 'No results';
}
document.querySelector('#search').addEventListener('input', event => render(event.target.value));
render();
</script>`);
example('date','JavaScript',['Безпечне форматування дати','Safe date formatting'],'JavaScript-функція: ISO-момент, явний часовий пояс і перевірка неправильного значення.','JavaScript function with an ISO instant, explicit time zone and invalid-input check.',`function formatDate(value, locale = 'uk-UA') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Europe/Kyiv' }).format(date);
}
console.log(formatDate('2026-10-06T12:00:00Z'));
console.log(formatDate('invalid'));`);
example('number','JavaScript',['Валідація числового вводу','Numeric input validation'],'Не приймай порожній рядок як нуль. Перевір число та межі окремо.','Do not accept an empty string as zero. Check the number and bounds separately.',`function parseQuantity(raw) {
  if (typeof raw !== 'string' || !raw.trim()) throw new Error('Enter a quantity');
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 100) throw new Error('Use an integer from 1 to 100');
  return value;
}
try { console.log(parseQuantity('3')); } catch (error) { console.error(error.message); }`);
example('json','JavaScript',['Обробка неправильного JSON','Handling invalid JSON'],'Повертає зрозумілий результат замість неконтрольованого винятку. Далі треба перевірити структуру даних.','Returns a clear result rather than an uncontrolled exception. Validate the data structure afterward.',`function readJSON(text) {
  try { return { ok: true, value: JSON.parse(text) }; }
  catch { return { ok: false, error: 'Invalid JSON' }; }
}
console.log(readJSON('{"name":"Kachan"}'));
console.log(readJSON('{broken}'));`);
example('grid','CSS',['Адаптивні картки','Responsive cards'],'CSS для контейнера .cards і його .card: колонки підлаштовуються, довгі слова переносяться.','CSS for .cards and .card: columns adapt and long words wrap.',`.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
}
.card { min-width: 0; padding: 20px; border: 1px solid #888; overflow-wrap: anywhere; }
.card img { display: block; max-width: 100%; height: auto; }`);

const contentResourceInfo={};
function contentResource(id,name,category,url,group,uk,en,access){
 const row=resources.find(r=>r[0]===id||r[3]===url);
 if(row){row[4]=uk;row[5]=en;row[6]=group;}else resources.push([id,name,category,url,uk,en,group]);
 contentResourceInfo[(row||[id])[0]]=bi(...access);
}
resourceCollections.typography=['Шрифти й типографіка','Fonts and typography'];
resourceCollections.references=['Дизайн-референси','Design references'];
resourceCollections.ukrainian=['Українською','In Ukrainian'];
contentResource('git-uk','Pro Git · Українською','Docs','https://git-scm.com/book/uk/v2','ukrainian','Український переклад книги: основи, гілки, remote й робочі процеси.','Ukrainian translation covering foundations, branches, remotes and workflows.',['Безкоштовне онлайн-читання · UK','Free online reading · UK']);
contentResource('javascript-info-uk','JavaScript.info українською','Docs','https://uk.javascript.info/','ukrainian','Українські пояснення JavaScript, DOM, подій та async/await із завданнями.','Ukrainian explanations of JavaScript, DOM, events and async/await with exercises.',['Безкоштовне онлайн-читання; EPUB/PDF окремо · UK','Free online reading; EPUB/PDF sold separately · UK']);
contentResource('js-uk-dom','JavaScript.info · DOM','Docs','https://uk.javascript.info/dom-nodes','ukrainian','Почни тут, щоб зрозуміти дерево документа й зв’язок між HTML та DOM.','Start here to understand the document tree and how HTML relates to DOM.',['Безкоштовно · UK','Free · UK']);
contentResource('js-uk-async','JavaScript.info · async/await','Docs','https://uk.javascript.info/async-await','ukrainian','Українське пояснення очікування Promise, async-функцій і помилок.','Ukrainian explanation of Promise waiting, async functions and errors.',['Безкоштовно · UK','Free · UK']);
contentResource('npm-docs','npm Docs','Docs','https://docs.npmjs.com/','JavaScript','Довідка про пакети, package.json, scripts і встановлення залежностей.','Package, package.json, script and dependency installation documentation.',['Документація безкоштовна · EN','Free documentation · EN']);
contentResource('chrome-devtools','Chrome DevTools','Docs','https://developer.chrome.com/docs/devtools/','quality','Розбір Console, Sources, Network і пошуку причин помилок.','Console, Sources, Network and debugging guides.',['Документація та інструмент безкоштовні · EN','Free documentation and tool · EN']);
contentResource('playwright-writing','Playwright · Writing tests','Docs','https://playwright.dev/docs/writing-tests','quality','Приклади перевірки інтерфейсу: ролі елементів, дії та очікування результату.','UI test examples using element roles, actions and assertions.',['Документація та бібліотека безкоштовні · EN','Free documentation and library · EN']);
contentResource('fontshare','Fontshare','Design','https://www.fontshare.com/','typography','Добірка шрифтів для сайтів. Перевір кирилицю й ліцензію конкретного сімейства перед використанням.','Website font collection. Check Cyrillic coverage and the specific family license before use.',['Безкоштовні шрифти; умови в ліцензії · EN','Free fonts; terms in the license · EN']);
contentResource('fonts-knowledge','Google Fonts · Knowledge','Docs','https://fonts.google.com/knowledge','typography','Пояснення типографіки, вибору шрифтів, читабельності й поєднання гарнітур.','Typography, font selection, readability and pairing explanations.',['Безкоштовне читання · EN','Free reading · EN']);
contentResource('svg-repo','SVG Repo','Design','https://www.svgrepo.com/','design','Пошук SVG-іконок та ілюстрацій. Обирай послідовний стиль і перевір ліцензію кожного набору.','Find SVG icons and illustrations. Keep a consistent style and check each set’s license.',['Безкоштовні матеріали з різними ліцензіями · EN','Free assets with varying licenses · EN']);
contentResource('heroicons','Heroicons','Design','https://heroicons.com/','design','Узгоджений набір SVG-іконок із контурними та заповненими варіантами.','A consistent SVG icon set with outline and solid variants.',['Безкоштовно, MIT · EN','Free, MIT · EN']);
contentResource('unsplash','Unsplash','Design','https://unsplash.com/license','images','Ліцензія безкоштовних фотографій: прочитай умови перед пошуком зображення для проєкту.','License for free photos: read the terms before selecting a project image.',['Безкоштовна колекція; Unsplash+ окремо · EN','Free collection; Unsplash+ is separate · EN']);
contentResource('pexels','Pexels','Design','https://www.pexels.com/license/','images','Фото й відео для макетів; ця сторінка пояснює дозволене використання та обмеження.','Photos and videos for layouts; this page explains permitted uses and restrictions.',['Безкоштовно за ліцензією Pexels · EN','Free under the Pexels license · EN']);
contentResource('lapa','Lapa Ninja','Design','https://www.lapa.ninja/','references','Добірка landing pages. Вивчай композицію, типографіку й структуру, а не копіюй чужий бренд.','Landing page collection. Study composition, typography and structure rather than copying brands.',['Добірка доступна безкоштовно; товари окремо · EN','Free browsing; products sold separately · EN']);
contentResource('http-cat','HTTP Cats','Tools','https://http.cat/','API','Візуальна шпаргалка HTTP-статусів: 200, 404, 500 та інших.','Visual reference for HTTP statuses such as 200, 404 and 500.',['Безкоштовно · EN','Free · EN']);
contentResource('open-meteo','Open-Meteo','Docs','https://open-meteo.com/en/docs','API','Погодний API: сформуй запит із координатами та вивчи відповідь. Перевір умови перед комерційним використанням.','Weather API: build a coordinates-based request and inspect its response. Check terms before commercial use.',['Безкоштовний API для некомерційного використання з лімітами · EN','Free non-commercial API with limits · EN']);
contentResource('dummyjson','DummyJSON','Practice','https://dummyjson.com/docs','API','Тестові товари, користувачі й пошук для fetch. Запити змін імітуються та не створюють постійних записів.','Mock products, users and search for fetch. Write requests are simulated and do not create persistent records.',['Безкоштовний тестовий API · EN','Free mock API · EN']);
