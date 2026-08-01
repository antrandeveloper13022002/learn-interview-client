// Single source of truth for the password length rule — used both as the
// HTML `minLength` constraint and interpolated into the hint text, so the
// two can never drift out of sync.
export const AUTH_PASSWORD_MIN_LENGTH = 8;
