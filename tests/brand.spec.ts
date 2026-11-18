import { test } from "./fixtures";
import { HomePage } from "../pages/HomePage";
import { BrandPage } from "../pages/BrandPage";
import { blueTop, brandPolo } from "./data/testData";

test.describe("Brand filter", () => {
  test(
    "selecting a brand in the sidebar lists its products",
    { tag: "@regression" },
    async ({ page }) => {
      const home = new HomePage(page);
      const brand = new BrandPage(page);

      await home.open();
      await brand.openFromSidebar(brandPolo.path);
      await brand.expectOnBrandPage(brandPolo.path);
      await brand.expectProductListed(blueTop);
    },
  );
});
