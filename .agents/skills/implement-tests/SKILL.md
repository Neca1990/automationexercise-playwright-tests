---
name: implement-tests
description: Implements an approved test plan as Playwright specs for automationexercise.com, runs the suite, and fixes failures it caused. Use after a plan file in plans/ has been approved.
---

# Implement tests

## Steps

1. Read `AGENTS.md`, `docs/testing-conventions.md`, `docs/page-objects.md`, `docs/quality-rules.md`, `docs/selectors.md`, and the approved plan in `plans/`.
2. Create a branch named `tests/<topic>`.
3. For each scenario, add or update page objects in `pages/` (one class per page, extending `BasePage`), then write the spec in `tests/` that uses them. Check each locator on the live page first. Specs must not contain selectors.
4. Run `npm test`. Fix failures that come from your code. If a failure comes from the site behaving differently than the plan, stop and report it to the user.
5. Run `npm run check` (typecheck, format check, guard). Fix every finding.
6. Commit with a short message. Do not push until the user asks, or until `scripts/flow.sh` says the gate passed.

## Rules

- Do not weaken assertions to make tests pass.
- Do not add `waitForTimeout`.
- Keep commit messages free of personal data and project names.
- Follow the Page Object Model rules in `docs/page-objects.md`.
- Follow every rule in `docs/quality-rules.md`. Tags come only from its fixed vocabulary (`@Smoke`, `@Functional`, `@E2E`, `@Negative`, `@Regression`). Wrap each page action in `test.step`. Navigate through page objects, never `page.goto` in a spec. In particular: no hard-coded data in specs (use `tests/data/`), no `.first()` or `.nth()` to pick elements, each locator asserted with `toHaveCount(1)`, assertions on the business result, and a tag (`@smoke` or `@regression`) on every test.
- Before reporting done, run `npm run check` and `npm test`. Both must pass.
