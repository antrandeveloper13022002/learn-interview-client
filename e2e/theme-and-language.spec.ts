import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("toggling dark mode persists data-theme across a reload", async ({ page }) => {
    await page.goto("/vi");

    await page.getByRole("button", { name: "Chuyển sang chế độ tối" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Leave it back the way this test found it.
    await page.getByRole("button", { name: "Chuyển sang chế độ sáng" }).click();
  });
});
