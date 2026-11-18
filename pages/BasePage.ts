import type { Page, Locator } from "@playwright/test";

/** Shared page-object base: holds the Playwright page and common navigation helpers. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigation link in the top header (e.g. "Products", "Cart", "Signup / Login"). */
  protected navLink(name: string | RegExp): Locator {
    return this.page.getByRole("link", { name }).first();
  }

  async gotoPath(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
