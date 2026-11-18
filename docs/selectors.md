# Selectors

Prefer locators in this order:

1. `getByRole` with an accessible name, e.g. `page.getByRole("link", { name: "Products" })`.
2. `getByText` for visible text that is stable.
3. Stable element ids or classes that the site uses, e.g. `#search_product`, `#submit_search`, `.features_items`.
4. Avoid long CSS chains and nth-child selectors.

## Rules

- A locator that matches more than one element fails in Playwright. Narrow it with a parent selector or `.first()` only when you have checked the page.
- Check each selector against the live page before you commit it.
- When the site changes, update the selector and note the change in the commit message.
