import { test as base, expect } from "@playwright/test";

/**
 * Shared test fixtures. Every spec imports `test` from here.
 *
 * Third-party ad scripts on automationexercise.com add an overlay (#google_vignette) that
 * intercepts clicks and makes tests flaky. Ad requests are aborted so tests click the page itself.
 */
const AD_REQUESTS =
  /googlesyndication|doubleclick|googleadservices|googletagservices|adservice/;

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(AD_REQUESTS, (route) => route.abort());
    await use(page);
  },
});

export { expect };
