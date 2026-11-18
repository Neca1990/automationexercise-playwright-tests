import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ProductDetails } from "../tests/data/testData";

export class CartPage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/view_cart");
  }

  get cartRows(): Locator {
    return this.page.locator("#cart_info_table tbody tr");
  }

  /** The cart row for the product, matched by name. */
  rowFor(product: ProductDetails): Locator {
    return this.cartRows.filter({
      has: this.page.locator(".cart_description h4 a", {
        hasText: product.name,
      }),
    });
  }

  /** Checks the product is in the cart with the expected name and price. */
  async expectProductInCart(product: ProductDetails): Promise<void> {
    const row = this.rowFor(product);
    await expect(row).toHaveCount(1);
    await expect(row.locator(".cart_price p")).toHaveText(product.price);
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartRows).toHaveCount(count);
  }

  /** Removes the product's row with the delete button. */
  async deleteProduct(product: ProductDetails): Promise<void> {
    await this.rowFor(product).locator(".cart_quantity_delete").click();
  }

  async expectEmpty(): Promise<void> {
    await expect(this.page.locator("#empty_cart")).toBeVisible();
  }

  async expectQuantity(
    product: ProductDetails,
    quantity: number,
  ): Promise<void> {
    await expect(
      this.rowFor(product).locator(".cart_quantity button"),
    ).toHaveText(String(quantity));
  }
}
