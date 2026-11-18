import { expect, type Page } from "@playwright/test";

/** Scroll and viewport actions shared by all pages. */
export class PageControls {
  constructor(private readonly page: Page) {}

  /** Scrolls down with the mouse wheel, the way a user does, by the given number of pixels. */
  async scrollDownWithWheel(pixels: number): Promise<void> {
    await this.page.mouse.move(640, 400);
    await this.page.mouse.wheel(0, pixels);
  }

  async currentScrollY(): Promise<number> {
    return this.page.evaluate(() => window.scrollY);
  }

  async expectScrolledTo(minimumY: number): Promise<void> {
    await expect.poll(() => this.currentScrollY()).toBeGreaterThan(minimumY);
  }

  async clickScrollUp(): Promise<void> {
    await this.page.locator("#scrollUp").click();
  }

  async expectAtTop(): Promise<void> {
    await expect.poll(() => this.currentScrollY()).toBe(0);
  }
}
