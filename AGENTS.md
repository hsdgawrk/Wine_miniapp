# Repository Guidelines

Except your answer and docs you write must in Chinese, the other step must use English, including thinking, coding, etc. The norm is: all your output which intent to communicate with user using Chinese, but your internal thougut or temperory artifects are free to use English.

## Project Structure & Module Organization

This repository is a native WeChat Mini Program for cocktail recipes. Root files define app-wide behavior: `app.js` for lifecycle and data, `app.json` for page registration, tab bar, permissions, and window settings, and `app.wxss` for shared styles. Feature pages live under `pages/<page-name>/`, with each page keeping its `.js`, `.json`, `.wxml`, and `.wxss` files together. Current pages include `index`, `cocktail-detail`, `steps`, `add-cocktail`, and `share`. Static icons and SVG sources are in `images/`; architecture notes are in `docs/`.

## Build, Test, and Development Commands

Open the project root in WeChat Developer Tools to run, preview, upload, and debug the Mini Program. The project has no `package.json`, npm scripts, or automated build pipeline.

- `WeChat Developer Tools -> Compile`: runs the current Mini Program locally.
- `WeChat Developer Tools -> Preview`: generates a QR code for device testing.
- `WeChat Developer Tools -> Upload`: uploads a release candidate using `project.config.json`.
- `git status`: check pending work before editing or submitting changes.

## Coding Style & Naming Conventions

Use JavaScript ES6+ in page logic and update bound state through `this.setData(...)`. Keep each page's files named after the page directory, for example `pages/share/share.js` and `pages/share/share.wxml`. Use two-space indentation in JSON, WXML, WXSS, and JavaScript. Prefer descriptive camelCase names, such as `filteredCocktails`, `navigateToCocktailDetail`, and `shareImageUrl`. Add JSDoc or short comments for non-obvious lifecycle, validation, or error-handling logic. Reuse global styles from `app.wxss` before adding duplicate page-level styles.

## Testing Guidelines

There is no automated test framework yet. Validate changes manually in WeChat Developer Tools and on a real device when UI, navigation, storage, or sharing changes. For every page touched, test initial load, navigation entry and exit, empty/error states, and form validation. Before submitting, verify `app.json` page paths and tab icon paths still match actual files.

## Commit & Pull Request Guidelines

Recent commits use concise Chinese summaries focused on user-visible changes, for example `完善添加配方页面` and `首页推荐动态效果更新`. Keep commit subjects short, imperative or descriptive, and scoped to one change. Pull requests should include a brief summary, affected pages, manual test notes, linked issue or task if available, and screenshots or screen recordings for visual changes.

## Security & Configuration Tips

Do not commit private credentials or local-only developer settings. Review changes to `project.private.config.json` before committing. Keep permissions in `app.json` minimal and update the permission description whenever adding a new WeChat capability.
