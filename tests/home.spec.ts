import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads and shows the main navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Automation Exercise/i);
    await expect(page.getByRole("link", { name: /Products/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Cart/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Signup \/ Login/i })).toBeVisible();
  });
});
