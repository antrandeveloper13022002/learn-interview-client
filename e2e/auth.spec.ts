import { test, expect } from "@playwright/test";
import { E2E_FIXTURES } from "./support/fixtures";

test.describe("Auth (behavior + error states)", () => {
  test("register shows the check-your-email success screen", async ({ page }) => {
    await page.goto("/vi/register");
    const uniqueEmail = `e2e-register-${Date.now()}@example.com`;

    await page.locator("#register-email").fill(uniqueEmail);
    await page.locator("#register-password").fill("SomePassword123!");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();

    await expect(page.getByRole("status")).toBeVisible();
  });

  test("login with the seeded test user succeeds and reaches an authenticated state", async ({ page }) => {
    await page.goto("/vi/login");

    await page.getByLabel("Email").fill(E2E_FIXTURES.testUserEmail);
    await page.getByLabel("Mật khẩu").fill(E2E_FIXTURES.testUserPassword);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // FU-28: "Đăng xuất" is collapsed inside the header's account-menu
    // dropdown, not a standalone header link/button anymore — open it first.
    await page.getByRole("button", { name: "Menu tài khoản" }).click();
    await expect(page.getByRole("menuitem", { name: "Đăng xuất" })).toBeVisible();
  });

  test("wrong password shows the INVALID_CREDENTIALS alert, not a generic error", async ({ page }) => {
    await page.goto("/vi/login");

    await page.getByLabel("Email").fill(E2E_FIXTURES.testUserEmail);
    await page.getByLabel("Mật khẩu").fill("DefinitelyWrongPassword!");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("an invalid verify-email token shows the distinct invalid-token state", async ({ page }) => {
    await page.goto("/vi/verify-email?token=e2e-garbage-token");
    await expect(page.getByRole("status")).toBeVisible();
  });
});
