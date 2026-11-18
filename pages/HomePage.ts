import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    await expect(this.navLink("Products")).toHaveCount(1);
    await expect(this.navLink("Cart")).toHaveCount(1);
    await expect(this.navLink("Signup / Login")).toHaveCount(1);
  }

  async goToProducts(): Promise<void> {
    await this.navLink("Products").click();
  }

  async goToLogin(): Promise<void> {
    await this.navLink("Signup / Login").click();
  }
}
