# Перевірка перед публікацією

Публічна адреса: https://rubin666666.github.io/Kachan/. Статичний сайт публікується з main, без збірки. `.nojekyll` залишає файли без обробки Jekyll.

## Автоматичні перевірки

- `tests/learning-expansion.cjs`: 18 докладних тем двома мовами, чотири негативні/позитивні проєкти, підказки, запуск меню/API, ZIP/CRC, автономний експорт, збережені чернетки й reload.
- `tests/practice-expansion.cjs`: вісім нових задач, три рівні підказок та фактичні CSS-значення у звичайному уроці.
- `tests/learning-project-layout.cjs` та `tests/learning-explanation-layout.cjs`: 48 варіантів проєктів і 108 варіантів пояснень.
- `tests/learning-project-export.cjs`: чотири автономні сайти в підкаталозі, runtime-помилка з поясненням, поведінка компонентів, відсутність переповнення на телефоні, старі копії та офлайн-чернетка.
- `tests/redesign.cjs`: скорочена головна, єдиний каталог 35 інструментів, спільний пошук/фільтри/очищення, повернення з активності та звичайного інструмента, пояснення поруч зі збереженням коду, телефон і англійська.
- `tests/redesign-reading.cjs`: 48 варіантів практики з поясненням — шість напрямків, чотири ширини, дві мови.
- `tests/studio-workflows.cjs`: позитивні та негативні перевірки шести задач, відтворення макета, форма, diff, безпечний HTML-експорт, переставляння блоків/панелей, виконання JS, закріплене/історія, теми, reload та збереження старих чернеток.
- `tests/studio-design.cjs`: значення контрасту/типографіки/інспектора, reduced motion, керування галереєю, карта, модель браузера, компоненти, комікси, відкриття карток навичок після практики, повторення завершених тем та глобальний пошук.
- `tests/studio-layout.cjs`: 528 поєднань 22 активностей, двох мов, чотирьох варіантів теми та трьох ширин.
- `tests/studio-storage.cjs`: старі копії без Studio, відхилення некоректних даних, повний snapshot, збережені чернетки/тема, офлайн-запуск та скасування застарілої компіляції.
- `tests/workspace-finish.cjs`: Fit/390/900 у чотирьох CSS-інструментах, скасування повернення до прикладу, увімкнення/вимкнення читання, прокручування та закриття utility-вікон на чотирьох ширинах, відгук без анімацій у reduced motion.
- `tests/live-demos.cjs`: підсвічування головної через наведення/фокус/дотик, окремі перемикачі Grid/Flexbox, reduced motion, приклади шести напрямків двома мовами, робочий лічильник JavaScript. Підтримує `KACHAN_TEST_URL`.
- `tests/catalog-clarity.cjs`: приклади в каталозі інструментів, робочий перехід до Grid, орієнтир усіх трьох етапів уроку та домен/додаткові метадані ресурсів двома мовами. Іншу адресу локального перегляду можна передати через `KACHAN_TEST_URL`.
- `tests/portfolio-course.cjs`: чотири етапи зі спільним кодом, справжні CSS/DOM-перевірки, скасування завершення після змін, ZIP із перевіркою CRC та запуском експортованого сайту, окрема чернетка, резервна копія, перезавантаження й офлайн.
- `tests/portfolio-layout.cjs`: 128 поєднань ширини, мови, теми, етапу та режиму; незавершені CSS/JS, обмеження циклів і захист від застарілої відповіді перевірки.
- `tests/connected-workspace.cjs`: стабільна головна, маршрут до першого сайту, відповідні інструменти й ресурси, повернення до уроку після оновлення вкладки, збереження чернетки.
- `tests/lesson-orientation.cjs`: вступні пояснення шести напрямків двома мовами, безпечне відображення HTML у тексті, одна головна дія в тесті.
- `tests/data-confidence.cjs`: статус локального запису, остання успішна копія, наступні зміни, невдале завантаження й прив’язка індикатора до акаунта.
- `tests/fallback-save-status.cjs`: помилки запису й видалення у LocalStorage, збереження робочої копії та повторні спроби.
- `tests/study-workspace.cjs`: практика HTML/CSS/JS, чернетки, перевірка з клавіатури, пояснення помилок, фільтр мети ресурсів, підтвердження заміни прикладів.
- `tests/account-recovery.cjs`: тестовий лист відновлення, точна адреса повернення, перевірка токена, видалення токена з URL, повтор пароля, недійсне посилання й читання копій без запису.
- `tests/cloud.cjs`: вхід, збереження, конфлікт версій, отримання, об’єднання, історія та вихід із тестовим API.
- `tests/practice-runtime.cjs`: ізоляція коду, обмеження циклів і рекурсії, справжній TypeScript-компілятор, DOM-прев’ю й офлайн.
- `tests/academy.cjs`: розв’язки вправ, неправильний код, тести, збереження, імпорт, великі записи та адаптивність.
- `tests/resource-topics.cjs`: теми, пошук, обране, створення власного ресурсу, дві мови й теми.
- `tests/layout-stability.cjs`: всі сім розділів, дві мови, дві теми й різні ширини екрана.
- `tests/mobile-menu.cjs`: мобільна навігація та керування клавіатурою.

Для запуску браузерних перевірок потрібні Node, Playwright і Edge. Тестові API не надсилають справжніх листів і не змінюють дані користувача.

## Перевірки у своєму Supabase

1. Дозволити адреси повернення із SUPABASE.md.
2. Отримати справжній лист відновлення й змінити пароль свого тестового акаунта.
3. Зберегти копію на одному пристрої, отримати й прийняти на іншому.
4. Перевірити конфлікт старої версії та ізоляцію двох різних акаунтів.

Збереження в хмару залишається ручним: сайт не завантажує локальні дані без натискання й підтвердження.

- `tests/organization.cjs`: чотири навчальні вкладки, вікна маршруту й тем, доступ до проєктів та коду, категорії інструментів, пошук/скидання і двомовна адаптивність.

- `tests/minimal-reading.cjs`: вікно ресурсу, живі коментарі після закриття/повторного рендеру/перезавантаження, згруповані допоміжні матеріали уроку, одна кнопка Copy, дві мови й три ширини.

- `tests/workspace-redesign.cjs`: список курсів, плоский каталог ресурсів, додаткові 8 результатів, категорії/теми/пошук/обране, вікно старту та повернення з уроку.

- `tests/practice-reference.cjs`: режими практики, стан чернетки, клавіатура/пошук/глибокі посилання довідника, каталог інструментів і ширини 320/768/1440. `tests/content.cjs` перевіряє копіювання реального коду й офлайн-відновлення.

- `tests/atelier.cjs`: двомовна головна у світлій/темній темі, читабельність заголовка та акцентного слова, один canvas і контраст кнопок у восьми комбінаціях теми/акценту.

- `tests/mobile-portals.cjs`: WebKit і Edge з мобільною емуляцією, дев’ять ширин, дві мови/теми. Перевіряти не лише scrollWidth, а й фактичну ширину заголовка, кількість рядків та висоту картки. Для запуску потрібен WebKit Playwright; службові браузери зберігаються в ігнорованій `.qa/browsers`.

- `tests/orbit-visibility.cjs`: WebKit/Edge, чотири ширини, дві мови й теми; перевіряється видимість і розмір canvas, наявність намальованих пікселів, темні поверхні головної й відсутність горизонтального переповнення.

- `tests/desktop-workspace.cjs`: ширини 1280/1440/1920 і дві мови; верхня панель практики, зміст, прев’ю, збереження чернетки, живі контроли інструментів та клавіатурний фокус обраного.

- `tests/desktop-alignment.cjs`: центр семи розділів відносно вікна, колонки ресурсів, відсутність перекриття sidebar та обрізаного тексту на 1280/1440/1920/2560, дві мови; окремо центр відфільтрованих інструментів.

- `tests/accent-consistency.cjs`: живе перемикання чотирьох акцентів через налаштування в темній/світлій темах, колір головної кнопки/заголовка/планети/підписів, відтінки карток, контраст тексту, збереження після перезавантаження та відсутність примусового акценту в термінальній темі.

- `tests/text-readability.cjs`: перевірка фактичного контрасту тексту з урахуванням прозорих фонових шарів та `color-mix` у семи розділах і прикладах уроку, дві мови × дві теми × чотири акценти. Додатково перевіряти системну тему в `tests/accent-consistency.cjs`; вибрана назва кольору має зберігатися.

- `tests/wide-desktop.cjs`: 1600/1920/2560/3440px, дві мови; геометрія курсів/категорій/результатів, фактичне закріплення фільтрів та кнопок практики, парні редактор і результат, межі довідника та відсутність переповнення. Високий екран може вмістити контент без прокручування — не вимагати штучного скролу.

- `tests/code-workspaces.cjs`: HTML/JS на 1440/1920/2560/3440px двома мовами, запуск Ctrl+Enter, перевірка вправ, зміна вправи, розгортання без втрати коду, iframe-прев’ю, збереження після перезавантаження й повернення до каталогу з фокусом на пошуку. При перебудові DOM також запускати `tests/code-editors.cjs`, `tests/tool-downloads.cjs`, `tests/developer-tools.cjs`.

- `tests/guided-learning.cjs`: усі 46 уроків двома мовами; незалежність прикладу від відповіді, живий DOM, strict-діагностика TS, пояснення помилок усіх шести напрямків, коректне завершення/повторна перевірка HTML, маршрут із шести курсів, відновлення етапу/файла/місця читання, валідність копій та робота без інтернету.
- `tests/guided-learning-layout.cjs`: 144 комбінації уроків/етапів/мов/тем на 1280/1920/2560; ширина прикладів, вирівнювання читання й відсутність обрізання. Також `tests/text-readability.cjs`, `tests/connected-workspace.cjs` та `tests/practice-runtime.cjs` для контрасту, переходів і виконання DOM.

- `tests/navigation-stability.cjs`: звичайний режим анімації (no-preference), 15 кадрів після переходів, геометрія карток/вікон/налаштувань, сталий пошук, клавіатурна навігація, обране без зміни висоти, відновлення читання без першого ривка. Параметри KACHAN_TEST_WIDTH, KACHAN_TEST_LANG, KACHAN_TEST_THEME, KACHAN_TEST_URL дозволяють повторити перевірку на великих екранах і опублікованому сайті. Перевірки лише з reducedMotion: reduce не виявляють проблем звичайних переходів.

- `tests/desktop-ui-consistency.cjs`: двомовні деталі ресурсу й основне посилання, однакові заголовки/позиції трьох вікон, повернення фокуса, скидання порожнього пошуку, розкривні дії інструмента, живий CSS-контрол і підтверджене/скасоване скидання; локальна симуляція loading/error/success без зовнішніх запитів.

- `tests/form-windows.cjs`: форми проєкту, ресурсу й профілю на 1440×680 та 1920×1080 у двох мовах; заголовки нерухомі, дії видно до й після прокрутки, одна панель кнопок, немає горизонтального обрізання. Перевіряється справжнє додавання ресурсу та збереження після перезавантаження.

- `tests/mobile-resource-layout.cjs`: Edge та WebKit з емуляцією iPhone, десять ширин 320–1024px і дві мови. Перевіряються справжні координати тексту та всіх дій картки, їхні взаємні перетини й вихід за межі; одного scrollWidth недостатньо. Також розгорнуте вікно ресурсу й шість інших розділів.

- `tests/mobile-controls.cjs`: Edge/WebKit з iPhone-емуляцією, 320/393/600px і дві мови. Справжні touch-натискання перевіряють меню, Escape/фокус, перехід розділу, етапи уроку, живий CSS-контрол і ширину прев’ю; також геометрію шапки, ряд вкладок і розмір шрифту нативних полів.

- `tests/general-workspace.cjs`: реальні JSON/текстові операції, Ctrl+Enter, помилки й копіювання, дві колонки, повернення прокрутки/фокуса до інструмента, перегортання ресурсів зі збереженням коментаря й робоче збереження налаштувань. Дві мови; KACHAN_TEST_WIDTH і KACHAN_TEST_THEME для додаткових перевірок ПК.

- `tests/layout-library.cjs`: усі 98 матеріалів та 50 живих прев’ю, дев’ять категорій, точні значення копіювання через загальний clipboard helper, повний HTML, SVG-розмір/колір, пошук/порожній результат/Escape, повтор анімації, англійський UI, п’ять ширин, відсутність зовнішніх запитів та офлайн-використання. KACHAN_TEST_ENGINE=webkit для другого браузера з локальним WebKit.

- `tests/library-workflow.cjs`: обране й чернетки після перезавантаження, сумісність старих копій, відхилення некоректних даних, 24 іконки зі швидким копіюванням, реальні SVG/HTML-файли, ізольований редактор без виконання скриптів, збереження коду майстерні, відновлення оригіналу, 4 узгоджені набори й дії в малих вікнах. Підтримує KACHAN_TEST_ENGINE, KACHAN_TEST_LANG і KACHAN_TEST_THEME.

- `tests/content-alignment.cjs`: 348 компонувань уроків (усі 46 на 1920px, шість напрямків на 1440/2560px, дві мови й три етапи). Фактичні координати читача, заголовків, прози, списків, вкладок, прикладу, редактора, підсумку й нижніх дій порівнюються зі спільним полотном. Окремо вкладені сторінки проєктів/навчання та сітки Grid/Flexbox/градієнтів.

- tests/lesson-support.cjs: один додатковий блок, три збережені групи, справжня позначка прочитання, одна основна дія, відсутність дубльованого попереднього уроку після повторного компонування, реальний перехід до практики без передчасного завершення; обидві мови. tests/connected-workspace.cjs відкриває пов’язані інструменти/ресурси через цей блок і перевіряє повернення до чернетки.

- tests/progressive-disclosure.cjs: три ширини ПК і дві мови, згорнуті фільтри ресурсів та активна тема, очищення пошуку, архів/вигляд/імпорт проєктів без втрати поля чи дублікатів, видима мета уроку й згруповані технічні примітки; справжня зміна прев’ю в чотирьох інструментах та позначення ширини після згортання. desktop-workspace і mobile-controls відкривають додаткові параметри через їхній summary перед перевіркою живих дій.

- tests/quiet-interface.cjs: обидві мови; живий canvas головної після повторного рендера, розгортання додаткового, справжній HTML-download/презентація/редактор профілю, вибір стилів, довідники, обране та режим бібліотеки коду, категорії інструментів. Сім розділів перевіряються на 1440/1920/2560px у темній і світлій темах; перевіряються клавіатурний фокус підказок, відсутність горизонтального переповнення й помилок сторінки. navigation-stability та general-workspace перевіряють стабільність і живі операції після спрощення.

- tests/quiet-card-actions.cjs: обидві мови, назва відкриває ресурс/проєкт без другої дії, Enter/Escape та відновлення фокуса, доступність зовнішнього посилання/обраного, живий режим прогресу з видимим ручним станом після згортання, збережений фокус, один запуск прикладу, робоче скидання й незмінні файли практики. mobile-resource-layout порівнює незалежні області картки: вкладена кнопка назви та її заголовок становлять одну ціль, але всі інші елементи перевіряються на перетини та вихід тексту.

- tests/compact-desktop.cjs: 1280/1440/1920/2560px, дві мови та дві теми. Фактичні висоти типових карток, читабельний текст, незалежні колонки рядка проєкту, розгорнуте меню в його межах, дві колонки груп коду без втрати записів, видима планета й футер унизу. Довга нерозривна назва та реальне перемикання картки/список перевіряються окремо. desktop-alignment і navigation-stability перевіряють спільне центрування та відсутність стрибків після ущільнення.

- tests/quiet-project-workspaces.cjs: дві мови, контекстні основні дії, один прапорець завершення, справжнє створення/редагування задач із додатковими полями, явний масовий вибір/завершення, Kanban, живе збереження нотаток, папки/шаблони, повернення до проєктів, відсутність дублікатів та дані після перезавантаження. Геометрія кнопок на 393/768/1440/2560px і розгорнута форма задачі на екрані 1440×680 перевіряються окремо. form-windows, quiet-interface, desktop-alignment і navigation-stability залишаються перевірками спільних форм/розділів.

- tests/home-balanced-layout.cjs: шість розмірів ПК від 1280×800 і 1440×680 до 2560×1440, дві мови й теми. Фактичний grid, заповнення нижнього рядка без порожнього треку, проміжок до футера, однакові картки, вміст тексту/планети в hero, відсутність переповнення та контраст тексту карток ≥4.5:1. Окремо перевіряються розгортання додаткового, збереження canvas, продовження уроку й три основні переходи. compact-desktop зберігає перевірки компактних робочих розділів із новою адаптивною висотою головної.

- tests/filter-recovery.cjs: дві мови, скидання ресурсів/нотаток/задач, постійна геометрія рядка стану, точна остання неповна порція, клавіатурний фокус на першому новому матеріалі та збереження фокуса після миші, live-лічильник, одна дія порожнього стану, сортування й пошук нотаток без зміни вмісту, вихід зі scope проєкту. general-workspace, navigation-stability, desktop-alignment і mobile-resource-layout перевіряють сумісність із рештою інтерфейсу.

- Run tests/menu-navigation.cjs: both languages; exclusive project menus; outside click and Escape return; task edit return; nested-menu-before-modal Escape; resource previous/next, disabled boundaries, focus and top navigation. Also run form-windows.cjs, quiet-card-actions.cjs and navigation-stability.cjs.

- Run tests/icon-alignment.cjs: sidebar icon geometry and shared title rail across six sections, profile action heights and expanded sharing stability, all six course marks, tool category title/count centers, create-window header/icons; widths 1280/1440/1920/2560, Ukrainian/English and dark/light themes. Also verify desktop-alignment.cjs and form-windows.cjs.

- Run tests/panel-spacing.cjs: no outside hero gradient, long CTA label non-overlap, equal look-settings panels with expanded options, backup title and import guidance placement, button/text gaps, real JSON export and file validation; four desktop sizes in both themes/languages. Run home-balanced-layout.cjs and navigation-stability.cjs for layout regressions.

- Run tests/text-contrast.cjs: visible text over composited app surfaces across eight screens, four accents, both languages and themes. Review screenshots for gradients, preview/code colors and form borders. Run icon-alignment.cjs and navigation-stability.cjs after typography or control-style changes.

- Run tests/mobile-home-flow.cjs in Edge and WebKit: widths 320/360/375/390/414/430/600/700, both languages and normal/larger text; label natural height, button-to-label gap, no blank action track, orbit directly below text, no horizontal overflow, real lesson/resource navigation. Run home-balanced-layout.cjs to guard the desktop composition.

- Run tests/empty-recovery.cjs: Ukrainian/English real project search/archive controls and task search/trash controls, one recovery action, reset/focus, tool empty search/reset/live count and exact project/task record preservation. Run filter-recovery.cjs and quiet-project-workspaces.cjs for related regressions.

- Run tests/catalog-style.cjs for computed style parity across resources/courses/tool categories, bilingual descriptions, two desktop columns and actual category/back actions at 1280/1440/1920/2560 in dark/light. Also run icon-alignment.cjs, desktop-alignment.cjs and mobile-resource-layout.cjs.

- Run tests/catalog-color-motion.cjs: distinct course hues, real gradient styles, tool-category pointer light/sheens, unchanged card/title geometry, reduced-motion suppression, tone preservation after resource search/reset and one retained orbit in dark/light. catalog-style.cjs compares shared geometry/background base while allowing category border hues. Check navigation-stability.cjs and text-contrast.cjs.

- Run tests/utility-readability.cjs: JSON/text operations and keyboard shortcut, Unicode character and line counts, invalid/stale output, copy disabled states, paired panel heights and contained controls at 320/390/768 in both themes/languages. Run general-workspace.cjs and text-contrast.cjs, which now includes JSON/text workspaces among ten screens.

- Larger refinement checks: tests/dialog-edit-return.cjs (real task/project saves, recreated-row focus, drag preservation, true backdrop dismissals); tests/secondary-learning-polish.cjs (practice feature/text rails and two-column layout, real project window, successful/denied clipboard, snippet save-focus, unique search/favorites recovery, four widths/two languages; KACHAN_BROWSER_ENGINE=webkit for Safari engine); tests/mobile-dialog-dismissal.cjs (Edge/WebKit actual touch in forms/search/outlines). Run form-windows, quiet-project-workspaces, menu-navigation, desktop-alignment, and text-contrast (now thirteen screens).
