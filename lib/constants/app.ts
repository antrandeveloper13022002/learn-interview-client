// Confirmed brand name (docs/design/frontend-user-mockup.html's own comment:
// "Thương hiệu 'Interview Training Website' do bạn xác nhận 2026-08-01").
// Found via this constant's absence: layout.tsx's <title> said "Interview
// Practice" while app/page.tsx's <h1> said "Interview Training" — two
// different names for the same product, no single source to catch the drift.
export const APP_NAME = "Interview Training";

// 2026-08-18 — product owner chose to launch without payment (MoMo
// credentials are still placeholders) and add it in a follow-up deploy.
// Hides the Pricing nav link, homepage CTA, and /subscribe's plan
// selector/checkout in the meantime — the *content* side of this (Premium
// unlocked for everyone) is a separate, backend-only flag:
// PREMIUM_GATING_ENABLED in backend/src/shared/config/env.ts. Flip this
// back to `true` (and PREMIUM_GATING_ENABLED back to unset/"true") once
// real MoMo checkout is live — nothing else needs to change.
export const PAYMENTS_ENABLED = false;
