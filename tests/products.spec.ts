import { test } from "./fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { blueTop, searchTerms } from "./data/testData";

test.describe("Products page", () => {
  test(
    "lists products and finds one by search",
    { tag: ["@Smoke", "@Regression"] },
    async ({ page }) => {
      const products = new ProductsPage(page);
      await products.open();
      await products.expectLoaded();

      await products.search(searchTerms.blueTop);
      await products.expectSearchResultsFor(blueTop.name);
    },
  );
});
