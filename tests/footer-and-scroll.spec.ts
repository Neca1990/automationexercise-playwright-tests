import { test } from "./fixtures";
import { HomePage } from "../pages/HomePage";
import { Footer } from "../pages/components/Footer";
import { PageControls } from "../pages/components/PageControls";

test.describe("Scrolling", () => {
  test(
    "scrolling down reaches the footer subscription section",
    { tag: ["@Functional", "@Regression"] },
    async ({ page }) => {
      const home = new HomePage(page);
      const footer = new Footer(page);

      await home.open();
      await footer.scrollIntoView();
      await footer.expectSubscriptionVisible();
    },
  );

  test(
    "the scroll-up button returns the page to the top",
    { tag: ["@Functional", "@Regression"] },
    async ({ page }) => {
      const home = new HomePage(page);
      const controls = new PageControls(page);

      await home.open();
      await controls.scrollDownWithWheel(2000);
      await controls.expectScrolledTo(500);
      await controls.clickScrollUp();
      await controls.expectAtTop();
    },
  );
});
