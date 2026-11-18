import { test, type Locator, type Page } from "@playwright/test";

/** Shared page-object base: holds the Playwright page and common helpers. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Header navigation link by its visible text. Callers assert the count is 1, so a renamed
   * or duplicated link fails the test instead of matching the wrong element.
   */
  protected navLink(text: string): Locator {
    return this.page.locator(".nav.navbar-nav a").filter({ hasText: text });
  }

  async gotoPath(path: string): Promise<void> {
    await test.step(`Open ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  async goBack(): Promise<void> {
    await test.step("Go back in the browser", async () => {
      await this.page.goBack();
    });
  }
}
