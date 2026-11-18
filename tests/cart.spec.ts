import { test } from "./fixtures";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { blueTop } from "./data/testData";

test.describe("Cart", () => {
  test(
    "a product added from the products page shows its name and price in the cart",
    { tag: "@smoke" },
    async ({ page }) => {
      const products = new ProductsPage(page);
      const cart = new CartPage(page);

      await products.open();
      await products.expectLoaded();
      const product = await products.readProduct(blueTop.name);
      await products.addProductToCart(product.name);

      await cart.open();
      await cart.expectItemCount(1);
      await cart.expectProductInCart(product);
    },
  );
});

test.describe("Cart removal", () => {
  test(
    "deleting the only product empties the cart",
    { tag: "@regression" },
    async ({ page }) => {
      const products = new ProductsPage(page);
      const cart = new CartPage(page);

      await products.open();
      await products.expectLoaded();
      await products.addProductToCart(blueTop.name);

      await cart.open();
      await cart.deleteProduct(blueTop);
      await cart.expectEmpty();
    },
  );
});
