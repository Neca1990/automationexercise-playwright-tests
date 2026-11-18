import { expect, test, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  async open(): Promise<void> {
    await this.gotoPath("/login");
  }

  async expectLoaded(): Promise<void> {
    await test.step("Verify login form is loaded", async () => {
      await expect(this.loginEmail).toBeVisible();
      await expect(this.loginPassword).toBeVisible();
    });
  }

  get loginEmail(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  get loginPassword(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  get loginButton(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  async logIn(email: string, password: string): Promise<void> {
    await test.step("Log in with the provided credentials", async () => {
      await this.loginEmail.fill(email);
      await this.loginPassword.fill(password);
      await this.loginButton.click();
    });
  }

  /** The error is shown and the user stays on the login page. */
  async expectLoginRejected(): Promise<void> {
    await test.step("Verify login is rejected and the user stays on the login page", async () => {
      await expect(
        this.page.getByText(/Your email or password is incorrect!/i),
      ).toBeVisible();
      await expect(this.page).toHaveURL(/\/login$/);
    });
  }
}
