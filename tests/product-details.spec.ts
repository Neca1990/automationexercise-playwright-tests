import { test } from "./fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { blueTop, blueTopDetailPath, purchaseQuantity } from "./data/testData";

test.describe("Product details", () => {
  test(
    "opening a product shows its name and price",
    { tag: ["@Smoke", "@Regression"] },
    async ({ page }) => {
      const detail = new ProductDetailPage(page);
      await detail.open(blueTopDetailPath);
      await detail.expectDetails(blueTop);
    },
  );

  test(
    "a chosen quantity is kept in the cart",
    { tag: ["@E2E", "@Regression"] },
    async ({ page }) => {
      const detail = new ProductDetailPage(page);
      const cart = new CartPage(page);

      await detail.open(blueTopDetailPath);
      await detail.setQuantity(purchaseQuantity);
      await detail.addToCartAndViewCart();

      await cart.expectProductInCart(blueTop);
      await cart.expectQuantity(blueTop, purchaseQuantity);
    },
  );

  test(
    "browser back returns from a product to the product list",
    { tag: ["@Functional", "@Regression"] },
    async ({ page }) => {
      const products = new ProductsPage(page);
      const detail = new ProductDetailPage(page);

      await products.open();
      await products.expectLoaded();
      await detail.open(blueTopDetailPath);
      await detail.goBack();
      await products.expectLoaded();
    },
  );
});
