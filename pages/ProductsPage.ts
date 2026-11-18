import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/products");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: /All Products/i })).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  get productCards(): Locator {
    return this.page.locator(".features_items .product-image-wrapper");
  }

  async search(term: string): Promise<void> {
    await this.page.locator("#search_product").fill(term);
    await this.page.locator("#submit_search").click();
  }

  async expectSearchResults(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: /Searched Products/i })).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  /** Adds the product at the given position (0-based) to the cart and closes the confirmation modal. */
  async addProductToCart(index: number): Promise<void> {
    await this.productCards.nth(index).hover();
    await this.productCards.nth(index).locator(".add-to-cart").first().click();
    await this.page.getByRole("button", { name: /Continue Shopping/i }).click();
  }
}
