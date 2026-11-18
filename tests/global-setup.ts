/**
 * Runs once before the suite. Checks whether the site's HTML pages are available.
 *
 * When the site answers with an error or a protection page ("One moment, please...", HTTP 502/520),
 * the UI tests cannot run. The run does not stop: UI tests are skipped (see tests/fixtures.ts) and
 * the API tests still run. The check does not try to get around any protection.
 */
export default async function globalSetup(): Promise<void> {
  const baseURL = "https://automationexercise.com/";
  let uiAvailable = false;
  let reason = "";

  if (process.env.SIMULATE_SITE_DOWN === "1") {
    // Lets the skip path be checked on demand: SIMULATE_SITE_DOWN=1 npm test
    process.env.UI_DOWN = "1";
    console.warn("Site check: simulated outage. UI tests will be skipped.");
    return;
  }

  try {
    const response = await fetch(baseURL, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.text();
    uiAvailable = response.ok && /Automation Exercise/i.test(body);
    if (!uiAvailable) {
      reason = `HTTP ${response.status}, no expected home page`;
    }
  } catch (error) {
    reason = `request failed: ${(error as Error).message}`;
  }

  process.env.UI_DOWN = uiAvailable ? "0" : "1";
  if (!uiAvailable) {
    console.warn(
      `Site check: UI tests will be skipped (${reason}). API tests still run.`,
    );
  }
}
