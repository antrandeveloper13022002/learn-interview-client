// In-app notification inbox (FU-13, backed by BE-41). `type` is free-text
// server-side (schema.prisma: "the taxonomy grows with every new
// instrumentation point") — not a closed union here either. `payload` is a
// self-contained display snapshot whose shape depends on `type`; read
// defensively per-type when rendering (see NotificationList.tsx).
export type Notification = {
  id: string;
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export type NotificationListResponse = {
  items: Notification[];
  total: number;
  page: number;
  pageSize: number;
  unreadCount: number;
};

// FU-14/BE-42 — the one user-toggleable notification category. See
// business-rule.md's "Preference categories — confirmed 2026-08-13":
// transactional notifications (account-created, subscription-activated,
// payment-failed) have no corresponding field, never muteable.
export type NotificationPreferences = {
  renewalRemindersEnabled: boolean;
};
