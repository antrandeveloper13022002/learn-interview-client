export type Role = "USER" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
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

export type VerifyEmailRequest = { token: string };
export type ForgotPasswordRequest = { email: string };
export type ResetPasswordRequest = { token: string; newPassword: string };

export type AuthState = {
  accessToken: string | null;
  user: SessionUser | null;
  /** Whether the initial `/auth/refresh` bootstrap call has resolved yet. */
  isBootstrapped: boolean;
};
