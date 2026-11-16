# Brazil Open Data Index — instructions for AI tools and people

Read natively by Codex. `CLAUDE.md` and `GEMINI.md` import this file, so Claude Code
and Gemini CLI follow the same rules. Edit the rules here, nowhere else.

<!-- project-kit:start -->
## This folder is the one home of Brazil Open Data Index

- Repo: https://github.com/educrvz/brazil-open-data-index · Notion: https://app.notion.com/p/41aeeae1044a81518b0bfe8f8acf767a · Secrets vault: none (no secrets)
- Registry entry: `brazil-open-data-index` in `dccrvz/project-kit` → `projects.json`

## Before you change anything

1. Confirm this is the live copy: `.project-home.json` is here and its `repo` matches
   `git remote get-url origin`. If you find `STALE_COPY.md`, stop and go to the path it names.
2. Run `git pull`. Other people and other AI sessions also work here.
3. Read `docs/CONTEXT.md`, `docs/RUNBOOK.md` and the latest entries at the top of
   `PROGRESS.md`. Skim the titles in `docs/decisions/`.
4. Before you build something, search `PROGRESS.md` and the code. It may already exist.

## Rules

- **Never commit secrets.** Real values live only in the vault (none (no secrets)) and in the local,
  git-ignored `.env`. If you need a new secret: add the key (no value) to `.env.example`,
  add a row to the secrets table in `docs/RUNBOOK.md`, and ask the human to store the value.
- Never put real client or personal data in git, tests, fixtures, logs, screenshots or issues.
- **Check before every deploy:** `./scripts/check.sh` must pass. Never deploy a red check.
- **Deploy and roll back only as `docs/RUNBOOK.md` describes.** Take a backup first when a
  change touches production data or the database schema.
- **Log every change.** Add a new entry to the top of `PROGRESS.md` (format below) in the
  same commit as the change, then push.
- **Keep the docs true.** When reality changes, update them in the same commit:
  `docs/CONTEXT.md` (what, who, architecture, data, integrations), `docs/RUNBOOK.md`
  (run, test, deploy, rollback, logs, secrets, common issues), and a new ADR in
  `docs/decisions/` for any lasting choice. Never rewrite an old ADR; supersede it.
- If the docs and the code disagree, trust the code, fix the docs and note it in PROGRESS.
- Ask the human first before anything irreversible or outward-facing: deleting data,
  production schema changes, messaging real customers, spending money, changing access.
- If the expected product behavior is unclear, ask. Do not invent it.
- Keep changes small. Commit messages say why. Code and commits in English; user-facing
  copy in the client's language.
- Notion: when the Notion connector works, copy the PROGRESS entry into the project's
  Notion maintenance log. If it does not, write `Notion: pending` in the entry.

## Browser and screen policy (never hijack Edu's browser/screen)

When you need web or browser access, use this order and stop at the first that works:

1. **No browser:** fetch/curl, CLI tools, APIs, built-in web fetch/search.
2. **Headless browser:** Playwright/Puppeteer in headless mode. No visible window, never take focus.
3. **Your own sandboxed/built-in browser**, running in the background, never switching the
   human's active screen, Space or app.
4. **Edu's real browser (Chrome) or computer use: last resort only. Ask first and wait for a yes.**
   Never switch apps, Spaces or windows on the human's machine without approval.

## PROGRESS.md entry format (newest first)

```
## YYYY-MM-DD — short title (name + AI tool)
What changed and why. Checks run and their results.
Deployed: yes/no (commit, where). Rollback: how, if not the standard one.
Open items, risks, Notion: done/pending.
```
<!-- project-kit:end -->

## Rules specific to this project

- The catalog lives in `data/sources.csv` (English) and `data/sources-pt.csv` (Portuguese
  overrides by `Name`). Never edit `src/sources.json` or `public/data/sources.csv` by hand:
  `npm run build:data` generates them.
- Only add a source with a real, official (or clearly labelled community) URL that you
  opened yourself. Never invent sources, URLs, licenses or coverage.
- When you change a link, run `npm run check:links` and set `Last Verified` to today only
  for rows you actually checked.
- The repo is public: no personal data, no internal notes, no client names in commits.
- UI copy is bilingual. Any new UI text needs both English and Portuguese.
