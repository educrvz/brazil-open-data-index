# 0002 — Keep the repo public under `educrvz`

- Date: 2026-11-15
- Status: Accepted

## Context
The project-kit rule is "one private repo in the `dccrvz` org per project". This project
is different: it is a public, contribution-friendly catalog. Its value comes from people
reading the data, opening pull requests and linking to the GitHub repo, which already
lives at `educrvz/brazil-open-data-index` and is linked from the live site's header.

## Decision
Keep the repo **public** at `educrvz/brazil-open-data-index`. Register it in project-kit
with `--repo educrvz/brazil-open-data-index` (same as `ilha-do-sul-inteligencia`).

## Consequences
- Every commit is public: no secrets, personal data or internal notes ever (see AGENTS.md).
- Outside contributors work through pull requests; only Edu deploys (push to `main`).
- If it ever moves to `dccrvz`, GitHub's transfer keeps redirects, but the header link and
  this ADR must be updated (supersede this one).
