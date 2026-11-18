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
- CI must pass before merge. The merge does not happen while any check fails.
