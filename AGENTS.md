# Agent Instructions: automationexercise Playwright tests

This repository holds Playwright UI tests for https://automationexercise.com, a public site made for automation practice.

## Required reading before any change

Before you write or change code, read the file in `docs/` that matches the task:

- `docs/testing-conventions.md`: structure, naming, assertions, waits.
- `docs/selectors.md`: how to pick locators on the site.
- `docs/workflow.md`: plan, implement, review, fix, and the test gate before push.
- `docs/page-objects.md`: Page Object Model rules. Every new spec uses page objects in `pages/`.
- `docs/quality-rules.md`: mandatory quality rules: test data in `tests/data/`, unique locators, strong assertions, tags, and the pre-push checks.

## Privacy rules (mandatory)

- Never put personal data in the repository: no email addresses, phone numbers, real names, or addresses. Test users are created with generated values inside the test.
- Never commit secrets (`.env`, tokens, passwords). Read configuration from environment variables only.
- Never mention other projects, clients, or course material by name in code, comments, commit messages, or PR text.
- Run `npm run guard` before every commit and push. Fix every finding; do not bypass it.

## Scope

- Automate only the public pages of automationexercise.com.
- Keep requests light: no load tests, no loops that hammer the site, no scraping beyond what a test checks.

## Code standards

- TypeScript, one `*.spec.ts` per feature under `tests/`.
- Use Playwright's role and test-id based locators; avoid brittle CSS chains.
- Assertions use `expect` with web-first matchers; do not use fixed `waitForTimeout`.
- Each test is independent and does not rely on the order of other tests.

## Before push or merge

1. `npm test` passes locally.
2. `npm run guard` passes.
3. CI checks (`.github/workflows/tests.yml`) pass on the branch. Live browser tests run locally, because the site blocks CI runners.
   Do not merge if any of these fail.
