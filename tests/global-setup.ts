/**
 * Runs once before the suite. Checks that the site returns its normal home page.
 *
 * automationexercise.com sometimes answers with a protection page ("One moment, please...")
 * instead of the site. Tests cannot pass on that page, so the run stops here with one clear message
 * instead of failing many tests one by one. The check does not try to get around the protection.
 */
export default async function globalSetup(): Promise<void> {
  const baseURL = "https://automationexercise.com/";
  const response = await fetch(baseURL, { redirect: "follow" });
  const body = await response.text();

  if (!response.ok || !/Automation Exercise/i.test(body)) {
    throw new Error(
      `Site check failed: ${baseURL} returned HTTP ${response.status} without the expected home page ` +
        `(protection or maintenance page). No tests were run. Try again later.`,
    );
  }
}
