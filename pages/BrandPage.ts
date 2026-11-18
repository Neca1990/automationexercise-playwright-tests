import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ProductDetails } from "../tests/data/testData";

export class BrandPage extends BasePage {
  /** Opens the brand from the left sidebar, as a user does. */
  async openFromSidebar(path: string): Promise<void> {
    const link = this.page.locator(`.left-sidebar a[href='${path}']`);
    await expect(link).toHaveCount(1);
    await link.click();
  }

  async expectOnBrandPage(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${path}$`));
  }

  productCardByName(name: string): Locator {
    return this.page
      .locator(".features_items .product-image-wrapper")
      .filter({ has: this.page.locator(".productinfo p", { hasText: name }) });
  }

  async expectProductListed(product: ProductDetails): Promise<void> {
    await expect(this.productCardByName(product.name)).toHaveCount(1);
  }
}
