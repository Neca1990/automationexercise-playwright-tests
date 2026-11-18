import { expect, test, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ProductDetails } from "../tests/data/testData";

export class ProductDetailPage extends BasePage {
  async open(path: string): Promise<void> {
    await this.gotoPath(path);
  }

  get productName(): Locator {
    return this.page.locator(".product-information h2");
  }

  get productPrice(): Locator {
    return this.page.locator(".product-information span span");
  }

  get quantityInput(): Locator {
    return this.page.locator("#quantity");
  }

  async expectDetails(product: ProductDetails): Promise<void> {
    await test.step(`Verify details of "${product.name}"`, async () => {
      await expect(this.productName).toHaveText(product.name);
      await expect(this.productPrice).toHaveText(product.price);
    });
  }

  /** Clears the quantity field and types the new value. */
  async setQuantity(quantity: number): Promise<void> {
    await test.step(`Set quantity to ${quantity}`, async () => {
      await this.quantityInput.fill(String(quantity));
    });
  }

  /** Clicks "Add to cart" and continues to the cart from the confirmation modal. */
  async addToCartAndViewCart(): Promise<void> {
    await test.step("Add product to the cart and open the cart", async () => {
      await this.page.locator("button.cart").click();
      await this.page.getByRole("link", { name: "View Cart" }).click();
    });
  }
}
