import { test, expect } from "@playwright/test";

test.describe("Locale routing (FU-19)", () => {
  test("an unprefixed request redirects to the VN-first default", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/vi(\/)?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("the footer language switcher round-trips /vi <-> /en on the same page", async ({ page }) => {
    await page.goto("/vi/questions");

    const switcher = page.getByRole("button", { name: "Tiếng Việt" });
    await switcher.click();
    await page.getByRole("option", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/questions/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("option", { name: "Tiếng Việt" }).click();

    await expect(page).toHaveURL(/\/vi\/questions/);
  });

  test("a nonexistent slug renders the localized not-found page, not a raw error", async ({ page }) => {
    const res = await page.goto("/vi/questions/this-slug-does-not-exist-e2e");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
