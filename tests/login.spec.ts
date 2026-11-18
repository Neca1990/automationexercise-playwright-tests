import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login page", () => {
  test("shows an error for an unknown account", async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.expectLoaded();

    // Generated, unique address: no real account or personal data is used.
    await login.logIn(`unknown_${Date.now()}@example.test`, "WrongPassword123");
    await login.expectLoginError();
  });
});
