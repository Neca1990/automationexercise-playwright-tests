import { expect, test, type Page } from "@playwright/test";

export class Footer {
  constructor(private readonly page: Page) {}

  /** Scrolls the footer into view the way a user reaches it. */
  async scrollIntoView(): Promise<void> {
    await test.step("Scroll to the footer", async () => {
      await this.page.locator("#footer").scrollIntoViewIfNeeded();
    });
  }

  /** Checks the subscription field is visible. The form is not submitted. */
  async expectSubscriptionVisible(): Promise<void> {
    await test.step("Verify footer subscription field is visible", async () => {
      await expect(this.page.locator("#susbscribe_email")).toBeVisible();
      await expect(this.page.locator("#subscribe")).toBeVisible();
    });
  }
}
