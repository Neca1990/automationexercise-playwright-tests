import { expect, test, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ProductDetails } from "../tests/data/testData";

export class ProductsPage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/products");
  }

  async expectLoaded(): Promise<void> {
    await test.step("Verify products page is loaded", async () => {
      await expect(
        this.page.getByRole("heading", { name: /All Products/i }),
      ).toBeVisible();
      await expect(this.productCards.first()).toBeVisible();
    });
  }

  get productCards(): Locator {
    return this.page.locator(".features_items .product-image-wrapper");
  }

  /** The product card for the named product. Callers assert the count is 1. */
  productCardByName(name: string): Locator {
    return this.productCards.filter({
      has: this.page.locator(".productinfo p", { hasText: name }),
    });
  }

  async search(term: string): Promise<void> {
    await test.step(`Search for "${term}"`, async () => {
      await this.page.locator("#search_product").fill(term);
      await this.page.locator("#submit_search").click();
    });
  }

  async expectNoSearchResults(): Promise<void> {
    await test.step("Verify search returns no products", async () => {
      await expect(
        this.page.getByRole("heading", { name: /Searched Products/i }),
      ).toBeVisible();
      await expect(this.productCards).toHaveCount(0);
    });
  }

  async expectSearchResultsFor(name: string): Promise<void> {
    await test.step(`Verify search results include "${name}"`, async () => {
      await expect(
        this.page.getByRole("heading", { name: /Searched Products/i }),
      ).toBeVisible();
      await expect(this.productCardByName(name)).toHaveCount(1);
    });
  }

  /** Hover reveals the overlay with the "Add to cart" action on the named card. */
  async hoverProduct(name: string): Promise<void> {
    await test.step(`Hover over "${name}"`, async () => {
      const card = this.productCardByName(name);
      await expect(card).toHaveCount(1);
      await card.hover();
      await expect(card.locator(".product-overlay")).toBeVisible();
    });
  }

  /** Reads name and price from the card with the given name. */
  async readProduct(name: string): Promise<ProductDetails> {
    return test.step(`Read details of "${name}"`, async () => {
      const card = this.productCardByName(name);
      await expect(card).toHaveCount(1);
      const price = (await card.locator(".productinfo h2").innerText()).trim();
      return { name, price };
    });
  }

  /** Adds the named product to the cart and closes the confirmation modal. */
  async addProductToCart(name: string): Promise<void> {
    await test.step(`Add "${name}" to the cart`, async () => {
      const card = this.productCardByName(name);
      await expect(card).toHaveCount(1);
      await card.hover();
      await card.locator(".productinfo .add-to-cart").click();
      await this.page
        .getByRole("button", { name: /Continue Shopping/i })
        .click();
    });
  }
}
