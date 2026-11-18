import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { invalidPassword, unknownEmail } from "./data/testData";

test.describe("Login page", () => {
  test(
    "rejects an unknown account and stays on the login page",
    { tag: "@regression" },
    async ({ page }) => {
      const login = new LoginPage(page);
      await login.open();
      await login.expectLoaded();

      await login.logIn(unknownEmail(), invalidPassword);
      await login.expectLoginRejected();
    },
  );
});
