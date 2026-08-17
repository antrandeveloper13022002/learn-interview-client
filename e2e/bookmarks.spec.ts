import { test, expect } from "@playwright/test";

// The authenticated bookmark-toggle flow lives in authenticated-flows.spec.ts
// — see that file's top comment for why auth-dependent tests can't each get
// their own fresh storageState-derived context (rotating refresh tokens).
test("a guest never sees the bookmark toggle", async ({ page }) => {
  await page.goto("/vi/questions");
  await expect(page.getByRole("button", { name: "Lưu câu hỏi" })).toHaveCount(0);
});
