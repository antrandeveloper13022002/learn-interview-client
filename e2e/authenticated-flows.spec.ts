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

  test("posting an anonymous review shows Delete (not Report) on it, and deleting it works (BE-67/FU-33, TC-FU30-03 regression)", async () => {
    // Regression guard for a real bug found 2026-08-19: the review's own
    // author saw "Report" instead of "Delete" on their own anonymous
    // review, because the old isMine check compared `userId` directly and
    // `userId` is always null for an anonymous row — even to its own
    // author. Fixed by having the backend compute `isMine` server-side
    // (BE-67) and ReviewList.tsx consume it (FU-33) instead.
    const content = `E2E anonymous review ${Date.now()}`;

    await page.goto(`/vi/companies/${E2E_FIXTURES.companySlug}`);
    await page.getByRole("radio", { name: "3 sao" }).click();
    await page.getByLabel("Nội dung").fill(content);
    await page.getByLabel("Đăng ẩn danh").check();
    await page.getByRole("button", { name: "Gửi đánh giá" }).click();

    // Scoped to this specific review's own <li> — the list also contains
    // other users' (and this same user's other) anonymous reviews, which
    // must correctly still show "Report", not "Delete".
    const card = page.locator("main ul li").filter({ hasText: content });
    await expect(card.getByRole("button", { name: "Xoá" })).toBeVisible();
    await expect(card.getByRole("button", { name: "Báo cáo" })).not.toBeVisible();

    await card.getByRole("button", { name: "Xoá" }).click();
    await expect(page.locator("main ul li").filter({ hasText: content })).toHaveCount(0);
  });

  test("a comment's own author sees Edit/Delete on it (even anonymous), never on someone else's (FU-34)", async () => {
    const content = `E2E comment ${Date.now()}`;

    await page.goto(`/vi/questions/${E2E_FIXTURES.freeQuestionSlug}`);
    await page.getByLabel("Viết bình luận của bạn...").fill(content);
    await page.getByRole("button", { name: "Gửi bình luận" }).click();

    const card = page.locator("main ul li").filter({ hasText: content });
    await expect(card.getByRole("button", { name: "Chỉnh sửa" })).toBeVisible();
    await expect(card.getByRole("button", { name: "Xoá" })).toBeVisible();
    // Someone else's comment (seeded, not this session's user) must never
    // show these — scoped to a different <li> than `card` above.
    const othersCard = page.locator("main ul li").filter({ hasNotText: content }).first();
    if (await othersCard.count()) {
      await expect(othersCard.getByRole("button", { name: "Chỉnh sửa" })).not.toBeVisible();
      await expect(othersCard.getByRole("button", { name: "Xoá" })).not.toBeVisible();
    }

    await card.getByRole("button", { name: "Xoá" }).click();
    await expect(page.locator("main ul li").filter({ hasText: content })).toHaveCount(0);
  });

  test("contributing a question is pending in My submissions, then editable and withdrawable (FU-23)", async () => {
    const title = `E2E question ${Date.now()}`;

    await page.goto("/vi/contribute");
    await page.getByLabel("Tiêu đề câu hỏi").fill(title);
    await page.getByLabel("Nội dung câu hỏi").fill("E2E submission content, filled by Playwright.");
    await page.getByLabel("Gợi ý đáp án").fill("E2E submission suggested answer, filled by Playwright.");
    await page.getByRole("button", { name: "Gửi câu hỏi" }).click();

    await expect(page.getByRole("status")).toContainText("Đã gửi — chờ duyệt");
    await page.getByRole("link", { name: "Xem câu hỏi đã gửi" }).click();
    await page.waitForURL(/\/vi\/my-submissions$/);

    // Positional, not `hasText`-filtered: findSubmissionsForUser orders
    // newest-first (submission.repository.ts), so the row just created is
    // always the first <li> — a `hasText` filter would stop matching the
    // moment "Chỉnh sửa" swaps the title <p> into an <input> (an <input>'s
    // `value` isn't part of its element's textContent, so the live filter
    // loses its match mid-test even though the row never left the page).
    // "main ul li" (not bare "li"): the breadcrumb above the list is an
    // <ol>, not a <ul> — this excludes it without needing a hasText filter.
    const card = page.locator("main ul li").first();
    await expect(card).toContainText(title);
    await expect(card.getByText("Chờ duyệt")).toBeVisible();

    // Edit while PENDING — see MySubmissionsList.tsx.
    await card.getByRole("button", { name: "Chỉnh sửa" }).click();
    const editedTitle = `${title} (edited)`;
    await card.getByLabel("Tiêu đề câu hỏi").fill(editedTitle);
    await card.getByRole("button", { name: "Lưu" }).click();
    await expect(card).toContainText(editedTitle);

    // Withdraw: optimistic removal (questionSubmissionsApi.ts), no reload needed.
    await card.getByRole("button", { name: "Rút lại" }).click();
    await expect(page.locator("main ul li", { hasText: editedTitle })).toHaveCount(0);
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
