# Dev Dashboard

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
