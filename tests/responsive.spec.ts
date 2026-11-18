import { test } from "./fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { blueTop } from "./data/testData";

test.describe("Small screen", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test(
    "product cards are still visible on a phone-sized screen",
    { tag: ["@Functional", "@Regression"] },
    async ({ page }) => {
      const products = new ProductsPage(page);
      await products.open();
      await products.expectLoaded();
      await products.hoverProduct(blueTop.name);
    },
  );
});
