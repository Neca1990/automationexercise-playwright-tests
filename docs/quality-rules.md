# Quality Rules (mandatory)

These rules apply to every spec, page object, and data file. Review checks them, and so does the agent before it commits.

## Test data

1. No hard-coded values in specs. Search terms, product names, prices, passwords, and messages come from `tests/data/`.
2. Generated values (unique emails, timestamps) are created by functions in `tests/data/`, never typed inline.
3. Only public, non-personal values go in `tests/data/`. Never store real accounts, real addresses, or real personal data.

## Locators

4. Selectors live only in `pages/`. Specs never contain `locator(...)` or CSS strings.
5. Each locator must match exactly one element. Assert it with `toHaveCount(1)` before using it.
6. Never use `.first()` or `.nth()` to pick an element out of several matches. Select by a stable property instead, such as the product name.
7. Select by visible text, role, `data-qa`, or a stable id, in that order.

## Assertions

8. Assert the business result, not only that something is visible. For example, the cart test checks the product name and price, not only the row count.
9. Every test has at least one assertion that would fail if the feature broke.
10. Do not weaken an assertion to make a test pass. If it fails, the bug is reported, not hidden.

## Waits and stability

11. No `waitForTimeout`. Wait for a visible state or a response.
12. Retries are only for CI. A test that needs a retry to pass is flaky: fix it, do not hide it.
13. Each test starts from a clean browser context and does not depend on another test.

## Organization

- Specs import `test` and `expect` from `tests/fixtures.ts`, never from `@playwright/test` directly. The fixture blocks third-party ad requests that cover buttons.

14. Every test has tags from this fixed vocabulary. Do not invent new tags.
    - `@Smoke`: core checks that must pass before anything else.
    - `@Functional`: one feature's behavior (text, navigation, a single action).
    - `@E2E`: a flow across several pages.
    - `@Negative`: invalid input or error handling. Add it next to the kind tag.
    - `@Regression`: every test has it.
      Typical sets: `@Smoke @Regression`, `@Functional @Regression`, `@E2E @Regression`, `@Functional @Negative @Regression`.
15. One page class per file in `pages/`, extending `BasePage`.

## Site outages

22. API tests (`tests/api/`) do not depend on the browser UI. They run in CI and when the UI is down.
23. A UI test never runs against a site that is down. Skips come from `tests/fixtures.ts` when `UI_DOWN=1`, with a reason. Do not add `test.skip` in individual specs for outages.
24. Tests never try to get around a site's protection pages. If the site blocks a runner, use a local run, not a workaround.

## Steps and navigation

19. Every page action and verification is wrapped in `test.step` with a readable name. The name says what the user does, for example `Add "Blue Top" to the cart`. It does not include secrets.
20. Tests navigate through page objects (`open`, `goBack`, `openFromSidebar`). A spec does not call `page.goto` itself.
21. Each feature branch covers one topic. Work is never committed to `main` directly.

## Before every push

16. `npm run check` passes: typecheck, format check, and privacy guard.
17. `npm test` passes. A test that fails once and then passes is flaky: report it and fix it.
18. CI checks (typecheck, format, guard) pass on the pull request, and the live tests pass locally (`merge` runs them).
