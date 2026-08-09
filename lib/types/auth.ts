export type Role = "USER" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  // Added FU-17 (2026-08-06) — optional, self-service editable via
  // PATCH /me/profile. No separate GET endpoint; this is the one place
  // the frontend reads the caller's current value from.
  displayName: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: SessionUser;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = { displayName: string | null };
export type ProfileResponse = { id: string; email: string; displayName: string | null };

export type VerifyEmailRequest = { token: string };
export type ForgotPasswordRequest = { email: string };
export type ResetPasswordRequest = { token: string; newPassword: string };

export type AuthState = {
  accessToken: string | null;
  user: SessionUser | null;
  /** Whether the initial `/auth/refresh` bootstrap call has resolved yet. */
  isBootstrapped: boolean;
};
