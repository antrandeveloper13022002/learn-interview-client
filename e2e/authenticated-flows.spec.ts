import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { E2E_FIXTURES } from "./support/fixtures";

// Refresh tokens rotate on every use (single-use, replay-detected — see
// SessionBootstrap.tsx). A *static* storageState file consumed by more
// than one independent browser context breaks this: whichever context
// uses it second presents an already-rotated (thus revoked) token and
// silently falls back to a guest session — this is exactly what happened
// when bookmarks and company-review tests each loaded the same snapshot
// from their own isolated context. Every authenticated test here instead
// shares ONE real login and ONE page/context, serially, mirroring how a
// single real user's browser tab actually behaves.
test.describe.configure({ mode: "serial" });

test.describe("Authenticated user flows (bookmarks, company reviews, study marks)", () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("/vi/login");
    await page.getByLabel("Email").fill(E2E_FIXTURES.testUserEmail);
    await page.getByLabel("Mật khẩu").fill(E2E_FIXTURES.testUserPassword);
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await page.waitForURL(/\/vi\/?$/);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("toggling a bookmark from the question list makes it appear on /bookmarks, then removable", async () => {
    // Scoped to the e2e tag (BE-54/FU-21) rather than the unfiltered list —
    // the real content seeded into prisma/seed.ts (2026-08-09) means the
    // fixed e2e-fixture questions are no longer necessarily on page 1 of
    // the unfiltered, newest-first list. Scoping guarantees only the two
    // known e2e questions are ever candidates for "first" here.
    await page.goto(`/vi/questions?tag=${E2E_FIXTURES.tagName}`);
    const toggle = page.getByRole("button", { name: "Lưu câu hỏi" }).first();
    await toggle.click();

    await page.goto("/vi/bookmarks");
    await expect(page.getByRole("link", { name: /E2E free question|E2E premium question/ }).first()).toBeVisible();

    const removeToggle = page.getByRole("button", { name: "Bỏ lưu câu hỏi" }).first();
    await removeToggle.click();
  });

  test("submitting a review shows the pending-approval badge immediately and survives a reload", async () => {
    await page.goto(`/vi/companies/${E2E_FIXTURES.companySlug}`);

    await page.getByRole("radio", { name: "4 sao" }).click();
    await page.getByLabel("Nội dung").fill(`E2E review ${Date.now()}`);
    await page.getByRole("button", { name: "Gửi đánh giá" }).click();

    await expect(page.getByRole("status")).toContainText("đang chờ quản trị viên duyệt");
    // .first(): repeated suite runs accumulate more than one pending
    // review for this user (the seed script doesn't purge prior E2E runs'
    // reviews) — this only asserts that at least one pending badge exists.
    await expect(page.getByText("Đang chờ duyệt").first()).toBeVisible();

    // Regression guard for the bootstrap-timing bug fixed earlier this
    // session: reloading must not make the caller's own PENDING review
    // disappear (it would if the query fired as a guest before
    // SessionBootstrap's refresh resolved).
    await page.reload();
    await expect(page.getByText("Đang chờ duyệt").first()).toBeVisible();
  });

  test("reporting another user's review disables and relabels the button", async () => {
    await page.goto(`/vi/companies/${E2E_FIXTURES.companySlug}`);

    const reportButton = page.getByRole("button", { name: "Báo cáo" }).first();
    await reportButton.click();

    await expect(page.getByRole("button", { name: "Đã báo cáo" }).first()).toBeDisabled();
  });

  test("marking a topic as studying persists across a reload, and can be unmarked (FU-22)", async () => {
    await page.goto("/vi/questions");

    const studyMark = page.getByRole("button", { name: "Đánh dấu đang ôn" }).first();
    await studyMark.click();
    await expect(page.getByRole("button", { name: "Đang ôn chủ đề này" }).first()).toBeVisible();

    await page.reload();
    const persistedMark = page.getByRole("button", { name: "Đang ôn chủ đề này" }).first();
    await expect(persistedMark).toBeVisible();

    await persistedMark.click();
    await expect(page.getByRole("button", { name: "Đang ôn chủ đề này" })).toHaveCount(0);
  });
});
