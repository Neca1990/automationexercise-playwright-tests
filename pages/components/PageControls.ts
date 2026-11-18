import { expect, test, type Page } from "@playwright/test";

/** Scroll and viewport actions shared by all pages. */
export class PageControls {
  constructor(private readonly page: Page) {}

  /** Scrolls down with the mouse wheel, the way a user does, by the given number of pixels. */
  async scrollDownWithWheel(pixels: number): Promise<void> {
    await test.step(`Scroll down ${pixels}px with the mouse wheel`, async () => {
      await this.page.mouse.move(640, 400);
      await this.page.mouse.wheel(0, pixels);
    });
  }

  async currentScrollY(): Promise<number> {
    return this.page.evaluate(() => window.scrollY);
  }

  async expectScrolledTo(minimumY: number): Promise<void> {
    await test.step(`Verify page is scrolled below ${minimumY}px`, async () => {
      await expect.poll(() => this.currentScrollY()).toBeGreaterThan(minimumY);
    });
  }

  async clickScrollUp(): Promise<void> {
    await test.step("Click the scroll-up button", async () => {
      await this.page.locator("#scrollUp").click();
    });
  }

  async expectAtTop(): Promise<void> {
    await test.step("Verify page is at the top", async () => {
      await expect.poll(() => this.currentScrollY()).toBe(0);
    });
  }
}
