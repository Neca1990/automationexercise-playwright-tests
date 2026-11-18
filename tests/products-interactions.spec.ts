import { test } from "./fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { blueTop } from "./data/testData";

test.describe("Products interactions", () => {
  test(
    "hovering a product card reveals its overlay",
    { tag: ["@Functional", "@Regression"] },
    async ({ page }) => {
      const products = new ProductsPage(page);
      await products.open();
      await products.expectLoaded();
      await products.hoverProduct(blueTop.name);
    },
  );

  test(
    "a search with no matching product shows no results",
    { tag: ["@Functional", "@Negative", "@Regression"] },
    async ({ page }) => {
      const products = new ProductsPage(page);
      await products.open();
      await products.expectLoaded();
      await products.search("zzqqxx_no_such_product");
      await products.expectNoSearchResults();
    },
  );
});
