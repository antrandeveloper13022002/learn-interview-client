import { execSync } from "node:child_process";
import path from "node:path";

// Runs backend/scripts/e2e-seed.ts before the suite — idempotent, upserts
// fixed test users/questions/company. Reuses the backend's own
// prisma.service.ts rather than adding a DB dependency to this repo.
async function seedFixtures(): Promise<void> {
  const backendDir = path.resolve(__dirname, "../../../backend");
  execSync("npx tsx scripts/e2e-seed.ts", { cwd: backendDir, stdio: "inherit" });
}

// Next.js dev mode (Turbopack) compiles each route on first request — a
// *freshly-spawned* dev server (Playwright's own webServer, not a warm one
// a developer already had open) can take well over the default 30s
// navigation timeout on a heavy first hit (e.g. the homepage). Pre-warming
// the routes this suite actually visits here means the real test
// navigations hit already-compiled routes. Errors ignored — this is only
// a warm-up, the tests themselves are the real assertion.
async function warmUpRoutes(): Promise<void> {
  const routes = [
    "/vi",
    "/vi/login",
    "/vi/register",
    "/vi/questions",
    "/vi/bookmarks",
    "/vi/verify-email",
    "/vi/contribute",
    "/vi/my-submissions",
  ];
  for (const route of routes) {
    await fetch(`http://localhost:3000${route}`).catch(() => undefined);
  }
}

export default async function globalSetup(): Promise<void> {
  await seedFixtures();
  await warmUpRoutes();
}
