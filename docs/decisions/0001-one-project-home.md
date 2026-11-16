# 0001 — One project home

- Date: 2026-11-15 · Status: Accepted · Decided by: Edu (DC Cruz)

## Context
Work on DC Cruz projects happens across many machines, people and AI tools. Duplicate
folders and missing history led an AI session to rebuild a feature that already existed.

## Decision
This repo (https://github.com/educrvz/brazil-open-data-index) and its local clone are the only home of Brazil Open Data Index.
`AGENTS.md` holds the rules for every AI tool; `docs/CONTEXT.md`, `docs/RUNBOOK.md`,
`docs/decisions/` and `PROGRESS.md` hold the knowledge. Secrets live in the vault
none (no secrets). The project is listed in the `dccrvz/project-kit` registry and has a Notion
page linked both ways. Collaborators deploy directly; safety comes from
`scripts/check.sh` before every deploy, a documented rollback and backups.

## Consequences
Every change updates PROGRESS.md and, when needed, the docs, in the same commit. Any
other copy of the code is stale and is marked with `STALE_COPY.md`.
