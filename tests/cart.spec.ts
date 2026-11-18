import { test } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";

test.describe("Cart", () => {
  test("a product added from the products page appears in the cart", async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await products.open();
    await products.expectLoaded();
    await products.addProductToCart(0);

    await cart.open();
    await cart.expectItemCount(1);
  });
});
