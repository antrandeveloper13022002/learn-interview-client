import { test, expect } from "@playwright/test";
import { E2E_FIXTURES } from "./support/fixtures";

test.describe("Questions — browse, filter, free reveal, premium lock", () => {
  test("applying a difficulty filter reflects in the URL and updates the list", async ({ page }) => {
    await page.goto("/vi/questions");

    // Accessible name comes from the associated <label> ("Độ khó"), not the
    // trigger's own visible text ("Tất cả độ khó") — the <label>
    // association wins accessible-name computation.
    await page.getByRole("button", { name: "Độ khó" }).click();
    await page.getByRole("option", { name: "Dễ" }).click();

    await expect(page).toHaveURL(/difficulty=EASY/);
  });

  test("a free question is blurred until 'Hiện đáp án' is clicked, then shows the real answer", async ({ page }) => {
    await page.goto(`/vi/questions/${E2E_FIXTURES.freeQuestionSlug}`);

    const revealButton = page.getByRole("button", { name: "Hiện đáp án" });
    await expect(revealButton).toBeVisible();
    await revealButton.click();

    await expect(page.getByText("E2E free answer content.")).toBeVisible();
  });

  test("a premium question shows the locked state with a login CTA when logged out", async ({ page }) => {
    await page.goto(`/vi/questions/${E2E_FIXTURES.premiumQuestionSlug}`);

    await expect(page.getByText("Nội dung dành cho thành viên Premium")).toBeVisible();
    // Scoped to <main> — the header nav also has its own "Đăng nhập" link.
    await expect(page.getByRole("main").getByRole("link", { name: "Đăng nhập" })).toBeVisible();
    await expect(page.getByText("E2E premium answer content.")).not.toBeVisible();
  });

  test("searching by keyword returns the matching question via Postgres FTS (BE-10)", async ({ page }) => {
    // No prior automated coverage exercised the real search SQL end to end
    // (only route-level tests mocking the repository) — this hits the
    // real dev DB through the full stack, same round-trip-reduction
    // rewrite this covers as backend/src/repository/interview/
    // interview.repository.ts's findQuestionsBySearch.
    await page.goto("/vi/questions");

    await page.getByRole("combobox", { name: "Tìm kiếm" }).fill("E2E free question");
    await page.getByRole("button", { name: "Tìm" }).click();

    await expect(page).toHaveURL(/q=/);
    await expect(page.getByRole("link", { name: /E2E free question/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /E2E premium question/ })).not.toBeVisible();
  });

  test("clicking a tag chip filters the list to that tag and can be cleared (BE-54/FU-21/FU-22)", async ({ page }) => {
    await page.goto(`/vi/questions/${E2E_FIXTURES.freeQuestionSlug}`);

    await page.getByRole("link", { name: E2E_FIXTURES.tagName, exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`tag=${E2E_FIXTURES.tagName}`));
    await expect(page.getByText("Tag:")).toBeVisible();
    await expect(page.getByRole("link", { name: /E2E free question/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /E2E premium question/ })).not.toBeVisible();

    // Scoped to the active-pills row (outside the closed dropdown, which
    // has its own identically-labelled "Xoá lọc" inside its popup panel).
    await page.getByRole("button", { name: "Xoá lọc" }).click();
    await expect(page).not.toHaveURL(/tag=/);
  });

  test("the tag multi-select dropdown checks a tag and updates the URL (FU-22)", async ({ page }) => {
    await page.goto("/vi/questions");

    await page.getByRole("button", { name: "Tất cả tag" }).click();
    await page.getByRole("checkbox", { name: new RegExp(E2E_FIXTURES.tagName) }).click();

    await expect(page).toHaveURL(new RegExp(`tag=${E2E_FIXTURES.tagName}`));
    await expect(page.getByRole("button", { name: "1 tag đã chọn" })).toBeVisible();
  });

  test("the topic sidebar switches category while preserving the active tag filter (FU-22)", async ({ page }) => {
    await page.goto(`/vi/questions?tag=${E2E_FIXTURES.tagName}`);

    await page.getByRole("navigation", { name: "Chủ đề" }).getByRole("link", { name: /E2E Category/ }).click();

    await expect(page).toHaveURL(new RegExp(`/vi/categories/${E2E_FIXTURES.categorySlug}\\?tag=${E2E_FIXTURES.tagName}`));
    await expect(page.getByRole("link", { name: /E2E free question/ })).toBeVisible();
  });
});
