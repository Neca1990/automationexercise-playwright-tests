# Page Object Model (POM)

## Structure

- `pages/<Name>Page.ts`: one class per page or major component (HomePage, ProductsPage, LoginPage, CartPage).
- `pages/BasePage.ts`: shared base class with the Playwright `page` and helpers used by all pages.
- `tests/<feature>.spec.ts`: tests only. A test creates page objects and calls their methods. It does not use raw selectors.

## Rules

1. Selectors live only in page objects. A spec file never contains `locator(...)` or CSS strings.
2. Page objects expose actions (`logIn`, `search`, `addProductToCart`) and checks (`expectLoaded`, `expectLoginError`).
3. Assertions go in page objects when they describe the page state (`expectLoaded`). Assertions about the business result stay in the spec (for example, the cart count after adding an item).
4. Getters return `Locator`, not strings, so Playwright waits and retries work.
5. No `waitForTimeout` in page objects either.
6. A page object does not depend on another page object. A test that moves between pages creates each page object it uses.
7. Keep one page class per file. Add a new page object only when a second spec needs the same page.

## Example

```ts
// pages/CartPage.ts
export class CartPage extends BasePage {
  async open(): Promise<void> { await this.gotoPath("/view_cart"); }
  get cartRows(): Locator { return this.page.locator("#cart_info_table tbody tr"); }
  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartRows).toHaveCount(count);
  }
}

// tests/cart.spec.ts
const cart = new CartPage(page);
await cart.open();
await cart.expectItemCount(1);
```
