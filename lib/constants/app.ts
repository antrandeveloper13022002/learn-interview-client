// Confirmed brand name (docs/design/frontend-user-mockup.html's own comment:
// "Thương hiệu 'Interview Training Website' do bạn xác nhận 2026-08-01").
// Found via this constant's absence: layout.tsx's <title> said "Interview
// Practice" while app/page.tsx's <h1> said "Interview Training" — two
// different names for the same product, no single source to catch the drift.
export const APP_NAME = "Interview Training";

// 2026-08-18 — product owner chose to launch without payment (MoMo
// credentials are still placeholders) and add it in a follow-up deploy.
// Turned back on 2026-08-20 (BE-75) via the backend's fake payment
// provider (PAYMENT_PROVIDER=fake — see business-rule.md's "Fake payment
// provider" section) as a deliberate, temporary soft-launch measure — a
// real subscriber gets Premium with no real money changing hands, until
// real MoMo credentials replace it. The *content* side of this (Premium
// unlocked for everyone regardless of payment) is a separate,
// backend-only flag: PREMIUM_GATING_ENABLED in
// backend/src/shared/config/env.ts, must also be `true` (or unset) on
// Railway for this to actually gate anything.
export const PAYMENTS_ENABLED = true;
