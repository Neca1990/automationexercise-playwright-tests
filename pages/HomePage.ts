import { expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/");
  }

  async expectLoaded(): Promise<void> {
    await test.step("Verify home page is loaded", async () => {
      await expect(this.page).toHaveTitle(/Automation Exercise/i);
      await expect(this.navLink("Products")).toHaveCount(1);
      await expect(this.navLink("Cart")).toHaveCount(1);
      await expect(this.navLink("Signup / Login")).toHaveCount(1);
    });
  }

  async goToProducts(): Promise<void> {
    await test.step("Open Products from the header", async () => {
      await this.navLink("Products").click();
    });
  }

  async goToLogin(): Promise<void> {
    await test.step("Open Signup / Login from the header", async () => {
      await this.navLink("Signup / Login").click();
    });
  }
}
