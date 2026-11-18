# Workflow

The flow has five stages. Each stage is a Claude Code session with its own skill.

## 1. Plan (interactive)

- Input: a list of what to automate (for example "signup flow, cart total, contact form").
- The agent asks questions when a step is unclear (URL, expected result, data needed).
- Output: `plans/<topic>.md` with the scenarios, the page each one uses, and the expected results. Approval comes from the user before stage 2.
- Skill: `.agents/skills/plan-tests/SKILL.md`.

## 2. Implement

- Input: an approved plan file.
- The agent writes Playwright specs in `tests/`, runs `npm test`, and fixes failures it caused.
- Output: a branch with the new specs and no failing tests.
- Skill: `.agents/skills/implement-tests/SKILL.md`.

## 3. Review (separate session)

- Started by `scripts/flow.sh review`, which runs Claude Code in a new non-interactive session.
- The reviewer reads the diff against `main` and checks conventions, privacy rules, and test quality.
- Comments are posted to the pull request with `gh`. The reviewer does not change code.
- Skill: `.agents/skills/review-tests/SKILL.md`.

## 4. Fix

- Input: review comments on the pull request.
- The agent reads each comment, fixes what is valid, replies with what was done, and pushes again.
- Skill: `.agents/skills/fix-review/SKILL.md`.

## 5. Gate before push and merge

- `npm run check` (typecheck, format check, privacy guard) and `npm test` must pass locally before every push.
- CI runs typecheck, format, the privacy guard, and the API tests (`npm run test:api`). The browser UI tests run locally (`npm run test:ui`), because the site blocks GitHub-hosted runner IPs. `merge` runs the full local gate before it merges.
- When the site UI is down, the global setup sets `UI_DOWN=1`. UI tests are skipped with a reason, API tests still run, and the run does not fail because of the outage. To check this path: `SIMULATE_SITE_DOWN=1 npm test`.

## Commands

- `npm run flow -- plan`: planning session.
- `npm run flow -- implement`: implement the plan on a feature branch, commit, no push.
- `npm run flow -- gate`: typecheck, format, privacy guard, tests.
- `npm run flow -- pr`: gate, push, open a PR into `main`.
- `npm run flow -- review <PR>`: one review session that posts comments.
- `npm run flow -- fix <PR>`: fix comments, gate, push.
- `npm run flow -- loop <PR>`: review and fix until the review reports `Review findings: 0` (max 5 rounds).
- `npm run flow -- merge <PR>`: runs the live gate locally, waits for CI checks, and merges into `main` when findings are 0. Asks for `yes` first.

## Branches

- Each change goes on its own branch (`tests/<topic>`), then a pull request into `main`.
- `main` is never committed to directly.
