// Stable IDs preserve favorites, comments and project links across catalog updates.
const resourceCollections={foundation:['Основи вебу','Web foundations'],HTML:['HTML','HTML'],CSS:['CSS','CSS'],JavaScript:['JavaScript','JavaScript'],TypeScript:['TypeScript','TypeScript'],Git:['Git і GitHub','Git and GitHub'],accessibility:['Доступність','Accessibility'],quality:['Перевірка й якість','Testing and quality'],practice:['Практика та курси','Practice and courses'],design:['Дизайн та іконки','Design and icons'],images:['Зображення та SVG','Images and SVG'],API:['API та запити','APIs and requests'],hosting:['Публікація сайтів','Deployment']};
Object.assign(translations.uk,{resourcePages:'Сторінки ресурсів',resourcePrev:'← Назад',resourceNext:'Далі →',resourceCount:'ресурсів'});
Object.assign(translations.en,{resourcePages:'Resource pages',resourcePrev:'← Previous',resourceNext:'Next →',resourceCount:'resources'});
function resourceCollectionName(key){return resourceCollections[key]?.[document.documentElement.lang==='uk'?0:1]||key;}
const existingResourceCollections={mdn:'foundation',github:'Git',caniuse:'quality',fonts:'design',figma:'design',mentor:'practice',csstricks:'CSS'};
for(const row of resources)row[6]=existingResourceCollections[row[0]]||'foundation';
resources.push(
 ['mdn-learn','MDN Learn','Docs','https://developer.mozilla.org/en-US/docs/Learn_web_development','Послідовний маршрут з основ веброзробки. Почни тут, якщо потрібен план навчання.','A structured web development learning path. Start here for a study plan.','foundation'],
 ['webdev-learn','web.dev Learn','Docs','https://web.dev/learn/','Курси про HTML, CSS, JavaScript, доступність і швидкість сайтів.','Courses covering HTML, CSS, JavaScript, accessibility and performance.','foundation'],
 ['mdn-html','MDN HTML','Docs','https://developer.mozilla.org/en-US/docs/Web/HTML','Довідник елементів, атрибутів, форм і семантики HTML.','Reference for HTML elements, attributes, forms and semantics.','HTML'],
 ['html-validator','W3C HTML Validator','Tools','https://validator.w3.org/','Перевірка HTML за адресою сайту, файлом або вставленим кодом.','Validate HTML by URL, file upload or pasted markup.','HTML'],
 ['mdn-css','MDN CSS','Docs','https://developer.mozilla.org/en-US/docs/Web/CSS','Властивості CSS, селектори, компонування й приклади.','CSS properties, selectors, layout and examples.','CSS'],
 ['css-validator','W3C CSS Validator','Tools','https://jigsaw.w3.org/css-validator/','Перевірка синтаксису CSS та пояснення помилок.','CSS syntax validation and error explanations.','CSS'],
 ['flexbox-froggy','Flexbox Froggy','Practice','https://flexboxfroggy.com/','Тренуй Flexbox у грі: розмісти жаб за допомогою CSS.','Practice Flexbox by positioning frogs with CSS.','CSS'],
 ['grid-garden','Grid Garden','Practice','https://cssgridgarden.com/','Практика CSS Grid: колонки, рядки та розташування елементів.','Practice CSS Grid columns, rows and item placement.','CSS'],
 ['mdn-javascript','MDN JavaScript','Docs','https://developer.mozilla.org/en-US/docs/Web/JavaScript','Довідник JavaScript: масиви, об’єкти, функції та вбудовані методи.','JavaScript reference for arrays, objects, functions and built-in methods.','JavaScript'],
 ['javascript-info','JavaScript.info','Docs','https://javascript.info/','Підручник JavaScript від основ до DOM, подій і асинхронності.','JavaScript tutorial from fundamentals to DOM, events and asynchronous code.','JavaScript'],
 ['javascript-info-uk','JavaScript.info українською','Docs','https://uk.javascript.info/','Українська версія підручника з поясненнями та вправами.','Ukrainian edition of the JavaScript tutorial with explanations and exercises.','JavaScript'],
 ['typescript-docs','TypeScript Docs','Docs','https://www.typescriptlang.org/docs/','Офіційні матеріали про типи, інтерфейси, generics і звуження типів.','Official guides to types, interfaces, generics and narrowing.','TypeScript'],
 ['typescript-playground','TypeScript Playground','Tools','https://www.typescriptlang.org/play/','Перевіряй типи та переглядай згенерований JavaScript у браузері.','Check types and inspect generated JavaScript in the browser.','TypeScript'],
 ['pro-git','Pro Git','Docs','https://git-scm.com/book/en/v2','Книга про коміти, гілки, злиття та роботу з віддаленими репозиторіями.','A book covering commits, branches, merges and remote repositories.','Git'],
 ['github-docs','GitHub Docs','Docs','https://docs.github.com/en','Офіційні інструкції для репозиторіїв, pull requests і GitHub Pages.','Official repository, pull request and GitHub Pages guides.','Git'],
 ['learn-git-branching','Learn Git Branching','Practice','https://learngitbranching.js.org/','Інтерактивні вправи з візуалізацією гілок і Git-команд.','Interactive exercises with visualized branches and Git commands.','Git'],
 ['learn-accessibility','web.dev Accessibility','Docs','https://web.dev/learn/accessibility/','Доступні форми, клавіатура, фокус, семантика та допоміжні технології.','Accessible forms, keyboard input, focus, semantics and assistive technology.','accessibility'],
 ['contrast-checker','WebAIM Contrast Checker','Tools','https://webaim.org/resources/contrastchecker/','Перевіряй контраст тексту та фону за вимогами WCAG.','Check text and background contrast against WCAG requirements.','accessibility'],
 ['learn-performance','web.dev Performance','Docs','https://web.dev/learn/performance/','Як зображення, шрифти й завантаження ресурсів впливають на швидкість.','How images, fonts and resource loading affect performance.','quality'],
 ['chrome-devtools','Chrome DevTools','Docs','https://developer.chrome.com/docs/devtools/','Налагодження JavaScript, мережевих запитів, стилів та продуктивності.','Debug JavaScript, network requests, styles and performance.','quality'],
 ['pagespeed','PageSpeed Insights','Tools','https://pagespeed.web.dev/','Аналіз швидкості опублікованої сторінки та підказки для покращення.','Analyze published page performance and explore improvement suggestions.','quality'],
 ['prettier','Prettier','Tools','https://prettier.io/','Автоматичне форматування HTML, CSS, JavaScript та інших файлів.','Automatic formatting for HTML, CSS, JavaScript and other files.','quality'],
 ['eslint','ESLint','Docs','https://eslint.org/docs/latest/','Пошук проблем у JavaScript і налаштування правил якості коду.','Find JavaScript problems and configure code quality rules.','quality'],
 ['playwright','Playwright','Docs','https://playwright.dev/docs/intro','Автоматизовані перевірки сайту в браузері: кліки, форми й адаптивність.','Automated browser checks for clicks, forms and responsive layouts.','quality'],
 ['regex101','Regex101','Tools','https://regex101.com/','Перевіряй регулярні вирази, обравши режим JavaScript.','Test regular expressions using the JavaScript flavor.','JavaScript'],
 ['odin','The Odin Project','Practice','https://www.theodinproject.com/','Навчальний маршрут із практичними вебпроєктами.','A learning curriculum built around practical web projects.','practice'],
 ['freecodecamp','freeCodeCamp','Practice','https://www.freecodecamp.org/learn/','Курси й вправи для розвитку навичок програмування.','Courses and exercises for building programming skills.','practice'],
 ['exercism-js','Exercism JavaScript','Practice','https://exercism.org/tracks/javascript','Вправи на функції, масиви, об’єкти та інші можливості JavaScript.','Exercises on functions, arrays, objects and other JavaScript features.','practice'],
 ['codepen','CodePen','Tools','https://codepen.io/','Онлайн-редактор для експериментів із HTML, CSS та JavaScript.','An online editor for HTML, CSS and JavaScript experiments.','practice'],
 ['lucide','Lucide','Design','https://lucide.dev/','Єдина бібліотека SVG-іконок для акуратних інтерфейсів.','A consistent SVG icon library for clean interfaces.','design'],
 ['heroicons','Heroicons','Design','https://heroicons.com/','SVG-іконки для навігації, кнопок і карток.','SVG icons for navigation, buttons and cards.','design'],
 ['squoosh','Squoosh','Tools','https://squoosh.app/','Стискання зображень із порівнянням якості й розміру.','Compress images while comparing quality and file size.','images'],
 ['svgomg','SVGOMG','Tools','https://jakearchibald.github.io/svgomg/','Оптимізація SVG: прибери зайві дані перед додаванням у проєкт.','Optimize SVG files by removing unnecessary data.','images'],
 ['mdn-web-api','MDN Web APIs','Docs','https://developer.mozilla.org/en-US/docs/Web/API','DOM, Fetch, Storage та інші браузерні API.','DOM, Fetch, Storage and other browser APIs.','API'],
 ['jsonplaceholder','JSONPlaceholder','Practice','https://jsonplaceholder.typicode.com/','Тестовий REST API для практики fetch, JSON і HTTP-запитів.','A fake REST API for practicing fetch, JSON and HTTP requests.','API'],
 ['dummyjson','DummyJSON','Practice','https://dummyjson.com/','Тестові дані товарів та інших сутностей для навчальних застосунків.','Mock product and other data for learning applications.','API'],
 ['hoppscotch','Hoppscotch','Tools','https://hoppscotch.io/','Надсилай API-запити й перевіряй відповіді у браузері.','Send API requests and inspect responses in the browser.','API'],
 ['github-pages','GitHub Pages','Docs','https://pages.github.com/','Публікація статичного сайту з GitHub-репозиторію.','Publish a static website from a GitHub repository.','hosting'],
 ['vercel-docs','Vercel Docs','Docs','https://vercel.com/docs','Інструкції з публікації проєктів і налаштування доменів.','Project deployment and domain configuration guides.','hosting'],
 ['netlify-docs','Netlify Docs','Docs','https://docs.netlify.com/','Публікація сайтів, налаштування збірки та доменів.','Website deployment, build settings and domain guides.','hosting']
);
