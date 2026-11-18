import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Home page", () => {
  test("loads and shows the main navigation", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.expectLoaded();
  });
});
