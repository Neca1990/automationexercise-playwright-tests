import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    await expect(this.navLink(/Products/i)).toBeVisible();
    await expect(this.navLink(/Cart/i)).toBeVisible();
    await expect(this.navLink(/Signup \/ Login/i)).toBeVisible();
  }

  async goToProducts(): Promise<void> {
    await this.navLink(/Products/i).click();
  }

  async goToLogin(): Promise<void> {
    await this.navLink(/Signup \/ Login/i).click();
  }
}
