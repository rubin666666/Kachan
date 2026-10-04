# Kachan

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
