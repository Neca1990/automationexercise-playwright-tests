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

14. Every spec has a tag: `@smoke` for the quick core checks, `@regression` for the rest.
15. One page class per file in `pages/`, extending `BasePage`.

## Before every push

16. `npm run check` passes: typecheck, format check, and privacy guard.
17. `npm test` passes.
18. CI passes on the pull request before merge.
