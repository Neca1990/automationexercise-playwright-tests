import type { FullConfig } from "@playwright/test";

/**
 * Runs once before the suite. Checks that the site returns its normal home page.
 *
 * automationexercise.com sometimes answers with a protection page ("One moment, please...")
 * instead of the site. Tests cannot pass on that page, so the run stops here with one clear message
 * instead of failing many tests one by one. The check does not try to get around the protection.
 *
 * The URL comes from playwright.config.ts, so the check and the tests always use the same host.
 */
const CHECK_TIMEOUT_MS = 15_000;

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) {
    throw new Error(
      "Site check failed: use.baseURL is not set in playwright.config.ts.",
    );
  }

  let response: Response;
  let body: string;
  try {
    response = await fetch(baseURL, {
      redirect: "follow",
      signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
    });
    body = await response.text();
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    const detail = timedOut
      ? `did not answer within ${CHECK_TIMEOUT_MS / 1000} seconds`
      : "could not be reached";
    throw new Error(
      `Site check failed: ${baseURL} ${detail}. No tests were run. Try again later.`,
      {
        cause: error,
      },
    );
  }

  if (!response.ok || !/Automation Exercise/i.test(body)) {
    throw new Error(
      `Site check failed: ${baseURL} returned HTTP ${response.status} without the expected home page ` +
        `(protection or maintenance page). No tests were run. Try again later.`,
    );
  }
}
