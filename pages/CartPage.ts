import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/view_cart");
  }

  get cartRows(): Locator {
    return this.page.locator("#cart_info_table tbody tr");
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartRows).toHaveCount(count);
  }
}
