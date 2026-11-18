import { test, expect } from "@playwright/test";

test.describe("Products page", () => {
  test("lists products and allows a search", async ({ page }) => {
    await page.goto("/products");

    await expect(page.getByRole("heading", { name: /All Products/i })).toBeVisible();
    await expect(page.locator(".features_items .product-image-wrapper").first()).toBeVisible();

    await page.locator("#search_product").fill("top");
    await page.locator("#submit_search").click();

    await expect(page.getByRole("heading", { name: /Searched Products/i })).toBeVisible();
    await expect(page.locator(".features_items .product-image-wrapper").first()).toBeVisible();
  });
});
