# Kachan

При відкритті головної показується стартовий екран із швидкими переходами та продовженням навчання. Детальна статистика доступна у «Робочому дні». Фрагменти коду, власні ресурси, деталі проєкту, фільтри задач, прогрес навчання та параметри нотатки відкриваються в окремих вікнах; дані й автозбереження використовують ті самі моделі.

Каталог Resources містить 47 вбудованих ресурсів у 13 тематичних добірках, двомовні описи, пошук, обране та особисті коментарі. Показується по 12 карток на сторінку. Каталог зберігається офлайн; зовнішні матеріали потребують інтернету. Власні посилання додаються окремо й входять у резервну копію.

Інтерфейс має вкладки Dashboard «Робочий день / Фокус / Історія / Календар», навчання «Теорія / Практика / Тест» та налаштувань «Вигляд / Dashboard / Дані / Сповіщення». Для HTML вкладка «Тест» запускає структурні перевірки вправи. Дії задач доступні через меню «⋯»; панель масових дій з’являється після вибору задач. Закріплена панель переходів показує лише видимі блоки поточної вкладки.

Personal developer workspace built with HTML, CSS, and vanilla JavaScript.

## Features

- Dashboard with project, task, and learning statistics.
- Projects: create, edit, delete, progress, GitHub and website links.
- Tasks: create, complete, delete, and filter.
- Learning: six technologies, topic checklists, automatic progress.
- Snippets: categories, editor, and clipboard copying.
- Resources: curated links, categories, and favorites.
- Settings: name, accent color, dark/light theme, confirmed reset.
- Ukrainian and English interface; responsive layouts.

Data stays in LocalStorage in the current browser and site origin. It does not sync between devices or between localhost and the published website. Reset clears only this application's keys.

## Run locally

Serve this folder with any static web server, for example VS Code Live Server, or:

```sh
python -m http.server 5173
```

Open http://localhost:5173. No package installation or build step is required. Clipboard copying needs HTTPS or localhost; manual selection is available as a fallback.

## Files

- `index.html`: semantic page sections and forms.
- `style.css`: responsive styles and themes.
- `script.js`: translations, navigation, tasks, projects, and learning.
- `features.js`: snippets, resources, and settings.

## Publish

GitHub Pages serves the `main` branch from the repository root. The site is expected at https://rubin666666.github.io/Kachan/ once Pages is enabled.

## Validation

Browser checks cover navigation, task and project CRUD, persistence, learning progress, snippets and clipboard copying, favorites, translations, settings, mobile widths, and reset confirmation.

## Branding

Kachan uses a custom SVG corn cob icon (`corn.svg`) for the logo and favicon. Existing `devspace-*` storage keys are retained for compatibility with saved user data.

## Backup and GitHub import

Settings can export a versioned `kachan-backup-YYYY-MM-DD.json` file containing projects, tasks, learning progress, snippets, favorites, language, and settings. Import accepts a validated Kachan backup up to 5 MB, previews record counts, and replaces current data only after confirmation. Download a backup first if you want to keep both sets of data.

Projects can list public repositories for a GitHub username through the GitHub REST API, with pagination. Add repositories individually; matching GitHub URLs are not duplicated. Imported projects start in Planning with 0% progress because GitHub does not provide learning progress. Existing project details are preserved. No token is requested; private repositories are unavailable and GitHub's unauthenticated rate limit applies. Errors and retry states appear in the interface.

API reference: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user

## Task planning and design verification

Tasks now support editing, project links, priority, deadlines, and sorting. Overdue dates use Europe/Kyiv. Project cards calculate progress from linked tasks and allow checking them off; projects without tasks keep manual progress. Deleting a project keeps its tasks and removes their project link. New task fields are included in JSON backup validation; older tasks and backups remain supported.

Design checks covered all seven pages in Ukrainian and English, dark and light themes, at 320, 390, 768, and 1440 pixel widths. Mobile navigation uses a collapsible menu. Search spacing, form order, contrast, light progress tracks, control sizes, and temporary status messages were adjusted after screenshot review.

Future work, including practice-based lessons and a notebook, is listed in [ROADMAP.md](ROADMAP.md).

## HTML course

Learning includes an original bilingual foundational HTML module with 10 lessons: document structure, text, links, lists, images, semantics, forms, tables, accessibility, and a portfolio project. Each lesson includes theory, a syntax example, an exercise, three progressive hints, structural checks, and a reference solution unlocked after the first attempt.

Drafts are saved immediately. Passing an exercise records completion and updates the HTML progress on Dashboard. A previously passed lesson stays complete while you experiment. Preview uses an isolated sandbox iframe; scripts, form submission, and external navigation are disabled. Checks use DOMParser and assess the listed structural conditions, not full HTML conformance or visual quality.

HTML course data is included in version 2 JSON backups. Version 1 backups remain importable and start the new course from zero. Browser verification covers all 10 solutions and incomplete examples, persistence, hints, feedback, progress, backup compatibility, preview isolation, both languages, and responsive widths.

## Notes

The notebook supports immediate autosave, categories, tags, search, pinning, sorting, project links, and blank/study/idea/daily/bug templates. A safe lightweight Markdown preview supports headings, unordered lists, read-only checklists, quotes, bold text, inline code, and fenced code; raw HTML is displayed as text. Individual notes export as UTF-8 TXT or Markdown.

Deleting a note moves it to Trash; it can be restored or permanently deleted after confirmation. Notes, including Trash, are included in version 3 JSON backups. Backups from versions 1 and 2 remain supported and restore an empty notebook. Storage remains local to the browser/site origin. When saving fails, the editor reports the failure and allows downloading the current note.

Browser checks cover editing and autosave, template creation, tags/search/pinning, project links, safe preview, export, Trash restore/delete confirmation, backup import/export, both languages, and responsive widths.

## Daily Dashboard

Dashboard now highlights overdue tasks, tasks due today, and deadlines within the next seven days. Quick actions open a task/project form or create a blank note. Resume continues the current unfinished HTML lesson or the next unfinished lesson. Recent notes prioritize pinned entries.

Day and week goals are saved locally with calendar periods in Europe/Kyiv. Activity tracking records new task actions, project creation, note creation/edits, and HTML lesson completion from this release onward; it does not fabricate historical events. The seven-day chart counts unique completed tasks and lessons per day. History is retained up to 1,000 entries. Version 4 backups include goals and history, while older backups remain supported.

## Projects and task workspace

Projects include a details view with linked tasks and notes, attachable snippets/resources, stage checklists, archive/unarchive, and automatic or manual progress. Task completion drives automatic progress; stage and subtask checklists are independent of the parent task completion state. Archived projects keep their data and remain available through the archive toggle.

Tasks include project/priority filters, multi-selection with bulk completion/move/priority changes, a Kanban board with explicit state controls, subtasks, and a recoverable Trash. Daily/weekly recurrence creates the next task exactly once on completion, using the existing deadline or today's date. Reopening and completing the same occurrence does not create another duplicate. Future recurring occurrences are editable independent records.

Version 5 JSON backups include Trash and all extended project/task fields; older backups remain importable. Browser checks cover recurrence, subtasks, filters, Kanban, bulk actions, recovery, details, manual progress, stages, archives, persistence, backups, both languages, and mobile widths.

## Materials, focus, comfort and offline support

Snippets have safe DOM-based syntax coloring, tags, favorites, pinning, lesson/project links, and file downloads. Resources support custom HTTPS/HTTP links, editing/removal, personal autosaved comments, search, favorites, and topic collections. Custom resources can also be attached to project details.

Dashboard includes work/break timers, adjustable durations, task/lesson associations, recorded session history, and user-created review cards. Remembered cards are scheduled after 3 days and then double their interval (up to 365 days); difficult cards return tomorrow. Time is measured using timestamps and persisted across reloads. Notification reminders require an explicit browser permission and work only while the site is open; there are no background push reminders.

Ctrl+K opens a native-dialog global search/command palette; Alt+N creates a note. Comfort settings include system theme, larger text, compact spacing and notification preferences. Keyboard focus, a skip link, reduced-motion rules, and an unsaved-form close guard are included. This is not a formal accessibility certification.

Version 6 JSON backups include all productivity data and support versions 1–5. Merge import adds new IDs, keeps existing IDs and local preferences, and rolls back storage on write errors. Backup exports do not transfer a running timer. The manifest and service worker support installation and offline use after the first successful online visit. Network APIs and external resources still require a connection. Service worker caches are scoped to this site.

Supabase connection, email/password sign-in, manual cloud transfer, 10 backup revisions and conflict detection are prepared. See [SUPABASE.md](SUPABASE.md) and [supabase/schema.sql](supabase/schema.sql). A real project must be configured before cloud features work; no production credentials are bundled.

## Regression checks

Start a static server, install Playwright locally or point `KACHAN_PLAYWRIGHT` at an available Playwright package, then run `node tests/productivity.cjs` and `node tests/cloud.cjs`. Default browser is installed Edge; set `KACHAN_BROWSER` and `KACHAN_URL` to override. Tests use fresh browser contexts and do not modify your normal browser data. Cloud tests mock HTTP responses; they do not verify live SQL or RLS. Screenshots are saved under ignored `.qa/`.

## Current release: learning, connections, custom dashboard and IndexedDB

This section supersedes the earlier LocalStorage-only and version-6 notes.

The learning path has 40 foundation lessons: 10 HTML and 6 each for CSS, JavaScript, Git, TypeScript and Figma. New modules include theory, practice, hints, quizzes and mini projects. See [LEARNING.md](LEARNING.md) for coverage and limits. CSS uses sandbox previews and computed-style checks. JavaScript pure functions run in a time-limited Worker inside an opaque-origin iframe. DOM exercises execute in an isolated preview; TypeScript uses the bundled strict compiler and runtime checks. Git is simulated. Figma practice happens in Figma, with a JSON report and required manual review in Kachan.

Notes link independently to projects, tasks and lessons. Task lists and lessons show linked notes. Review cards link to lessons and appear on a calendar. Dashboard block visibility and order are configurable; at least one block stays visible. Resume follows the current module.

Boot hydrates a synchronous working cache from IndexedDB before loading classic scripts sequentially. Atomic per-key transactions check revisions. The topbar reports pending, saved or failed states. LocalStorage migrates once and legacy records are removed only after successful commit. First launches without IndexedDB fall back to LocalStorage. If an already migrated database is unavailable, boot stops instead of replacing data with stale defaults. Browser storage remains origin-scoped and can be cleared; keep backups.

Another tab's writes warn and block stale writes. Download current drafts before reloading that tab. Import, merge and reset await storage completion. Version 7 backups include academy and personalization; versions 1–6 remain accepted. Import limit: 50 MB. Reset does not resurrect migration records. Supabase is postponed: cloud.js is retained but not loaded and no cloud requests run.

Run `node tests/productivity.cjs`, `node tests/academy.cjs` and `node tests/storage.cjs` with Playwright available (`KACHAN_PLAYWRIGHT` can specify its path). Checks cover reference solutions, wrong code, runaway execution, isolation, completion, links, settings, >5 MB persistence/import, older backups, concurrent tabs, offline, 128 route/language/theme/width combinations, and keyboard search. Storage tests cover aborted transactions, reset and fallback. Cloud tests are reserved for reconnection and do not prove live SQL/RLS correctness.

Зручність: глобальне створення, клавіатурний пошук, картки/список, закріплення проєктів, головна задача дня й останні матеріали. Після видалення можна скасувати дію протягом 10 секунд; остаточне очищення корзини не скасовується. Налаштування інтерфейсу входять до наявної резервної копії.

Блокнот: власні папки, закріплені записи та швидке збереження думки. Видалення папки зберігає нотатки. У проєкті є переходи до задач, коду й нотаток; додаткові списки розгортаються за потреби.

Фокус дня — згорнутий додатковий блок. Задачі мають окреме вікно з описом, підзадачами та нотатками. Блокнот підтримує форматування Markdown, перегляд і повноекранне редагування. Ресурси розділено за типами й темами.

Підказки «?» пояснюють призначення розділів і основних блоків українською та англійською. Бібліотека коду згрупована за мовами; приклади можна відкрити, змінити й зберегти як власні фрагменти.

Узгоджені верхні панелі розділів, підказки біля заголовків, компактні картки та спокійніші вкладені поверхні. Червоний акцент виділяє головні дії й активні стани. Перевірено темну/світлу тему, обидві мови та мобільні розміри.

Мінімальний інтерфейс: коротка головна, додаткові блоки за розгортанням, пояснення бібліотеки коду та другорядні дії під «Ще». Декор і постійні успішні сповіщення зменшено; помилки збереження залишаються видимими.

Розділи меню можна приховати у Вигляд і повернути; пошук залишається доступним. Проєкти за замовчуванням компактні, назви задач відкривають деталі. Створення задачі з проєкту одразу встановлює прив’язку; код із прив’язкою до проєкту відображається в його матеріалах.

Інструменти: Пісочниця HTML/CSS/JavaScript з ізольованим DOM-прев’ю й консоллю; власні розбори сайтів; 12 ідей проєктів за рівнями; 18 шпаргалок із пошуком; лабораторія стилів із CSS та контрастом. Усі записи входять у JSON-копії та працюють офлайн. JavaScript прев’ю обмежує цикли й виклики, мережа та зовнішні ресурси недоступні.

## Detailed lesson guides

All 40 lessons include expandable explanations, a working sequence, common mistakes, extra practice and self-check prompts. The 34 code lessons include short annotated concept examples distinct from the full reference solution; full academy solutions remain locked until the first check. Six Figma lessons cover frames, Auto Layout, components, typography, prototypes and a responsive Kachan design. Figma report checks validate only reported values, never the actual Figma file. Existing code-lesson IDs and learner records remain stable. Both languages and offline cache include the additions. Run node tests/learning-depth.cjs for lesson, report, persistence and responsive coverage.
