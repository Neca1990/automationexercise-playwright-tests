import { test } from "./fixtures";
import { HomePage } from "../pages/HomePage";

test.describe("Home page", () => {
  test(
    "loads and shows the main navigation",
    { tag: ["@Smoke", "@Regression"] },
    async ({ page }) => {
      const home = new HomePage(page);
      await home.open();
      await home.expectLoaded();
    },
  );
});
