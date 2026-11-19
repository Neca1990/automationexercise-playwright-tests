# Testing Conventions

## Structure

- `tests/<feature>.spec.ts`: one file per page or feature (home, products, cart, login, contact).
- `pages/`: page objects (POM). Selectors and page actions live here. See `docs/page-objects.md`.
- `tests/helpers/`: shared helpers, added only when two or more specs need the same code.
- `playwright.config.ts`: base URL and reporters. Do not hard-code the URL in specs.
- `tests/global-setup.ts`: runs once before the suite. Checks that the site returns its home page. If it does not, it sets `UI_DOWN=1`: UI tests are skipped with a reason and API tests still run. The run does not fail because of the outage alone, but API tests can fail when the whole host is unreachable. The URL comes from the config (`config.projects[0].use.baseURL`).

## Naming

- `describe` names the page or feature, e.g. `Products page`.
- `test` names describe behavior in plain words, e.g. `lists products and allows a search`.

## Assertions and waits

- Use `await expect(locator).toBeVisible()` and similar web-first assertions.
- Never use `page.waitForTimeout`. Wait for a visible state instead.
- Check one behavior per test. Several assertions for the same behavior are fine.

## Test data

- Generate unique values inside the test (for example a timestamp suffix) when a test creates data.
- Never store real personal data. Do not commit test credentials.

## Running

- `npm test`: all tests.
- `npx playwright test tests/products.spec.ts`: one file.
- `npm run report`: HTML report after a run.
