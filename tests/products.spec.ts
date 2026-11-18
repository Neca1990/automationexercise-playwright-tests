import { test } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";

test.describe("Products page", () => {
  test("lists products and allows a search", async ({ page }) => {
    const products = new ProductsPage(page);
    await products.open();
    await products.expectLoaded();

    await products.search("top");
    await products.expectSearchResults();
  });
});
