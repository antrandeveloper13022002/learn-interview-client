import { defineConfig, devices } from "@playwright/test";

// No ephemeral-Postgres harness exists (testing.md defers building one) —
// E2E runs against this project's real dev database with fixed, idempotent
// fixtures (backend/scripts/e2e-seed.ts) instead of a fresh throwaway DB.
export default defineConfig({
  testDir: "./e2e",
  // A cold Next.js *dev*-mode server compiles routes on demand — heavy
  // parallelism against it (plus the backend's own login/register rate
  // limits) caused real flakiness (timeouts on a page that hadn't finished
  // compiling yet), not a product bug. Capped rather than fully parallel.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  reporter: "list",
  globalSetup: "./e2e/support/global-setup.ts",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    navigationTimeout: 45_000,
    actionTimeout: 45_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // reuseExistingServer: this project's normal workflow already has both
  // dev servers running most of the time — don't kill and restart them.
  webServer: [
    {
      command: "npm run dev",
      cwd: "../backend",
      url: "http://localhost:4000/health",
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: "npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
