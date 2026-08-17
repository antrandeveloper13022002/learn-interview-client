import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { Notification, NotificationListResponse, NotificationPreferences } from "@/lib/types";

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // No params — the bell only ever shows the first page (backend
    // defaults to page=1/pageSize=20, plenty for a dropdown).
    getMyNotifications: builder.query<NotificationListResponse, void>({
      query: () => API_ROUTES.myNotifications,
      providesTags: (result) =>
        result
          ? [...result.items.map((n) => ({ type: "Notifications" as const, id: n.id })), { type: "Notifications" as const, id: "LIST" }]
          : [{ type: "Notifications" as const, id: "LIST" }],
    }),
    // Optimistic: patches the cached list directly (readAt + unreadCount)
    // instead of waiting on invalidatesTags + a refetch — same "instant
    // toggle" reasoning as bookmarksApi.ts's addBookmark.
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({ url: API_ROUTES.notificationRead(id), method: "PATCH" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationsApi.util.updateQueryData("getMyNotifications", undefined, (draft) => {
            const item = draft.items.find((n) => n.id === id);
            if (item && !item.readAt) {
              item.readAt = new Date().toISOString();
              draft.unreadCount = Math.max(0, draft.unreadCount - 1);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    // FU-14/BE-42 — separate from getMyNotifications (own tag, own cache
    // entry): the list's unreadCount and this single preference change
    // independently, no reason to couple their cache lifetimes.
    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => API_ROUTES.notificationPreferences,
      providesTags: [{ type: "Notifications" as const, id: "PREFERENCES" }],
    }),
    updateNotificationPreferences: builder.mutation<NotificationPreferences, NotificationPreferences>({
      query: (body) => ({ url: API_ROUTES.notificationPreferences, method: "PATCH", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationsApi.util.updateQueryData("getNotificationPreferences", undefined, () => body),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationsApi;
