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
