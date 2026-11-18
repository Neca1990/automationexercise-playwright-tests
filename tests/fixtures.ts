import { test as base, expect } from "@playwright/test";

/**
 * Shared test fixtures. Every spec imports `test` from here.
 *
 * - Third-party ad scripts on automationexercise.com add an overlay (#google_vignette) that
 *   intercepts clicks. Ad requests are aborted so tests click the page itself.
 * - When the global setup finds the site's UI down (UI_DOWN=1), every UI test is skipped with a
 *   reason. API tests are not affected.
 */
const AD_REQUESTS =
  /googlesyndication|doubleclick|googleadservices|googletagservices|adservice/;

export const test = base.extend<{ uiGate: void }>({
  uiGate: [
    async ({}, use, testInfo) => {
      if (testInfo.project.name === "ui" && process.env.UI_DOWN === "1") {
        testInfo.skip(
          true,
          "automationexercise.com UI is not available right now; see global setup",
        );
      }
      await use();
    },
    { auto: true },
  ],

  page: async ({ page }, use) => {
    await page.route(AD_REQUESTS, (route) => route.abort());
    await use(page);
  },
});

export { expect };
