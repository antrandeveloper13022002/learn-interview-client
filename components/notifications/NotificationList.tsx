"use client";

import { Link } from "@/components/i18n/LocaleLink";
import { useGetMyNotificationsQuery, useMarkNotificationReadMutation } from "@/lib/redux/notificationsApi";
import { SkeletonGroup, Skeleton } from "@/components/Skeleton";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { formatDate } from "@/lib/format";
import { PAGE_ROUTES } from "@/lib/routes";
import { GearIcon } from "@/components/icons";
import type { Notification } from "@/lib/types";

export function NotificationList() {
  const text = useText();
  const { data, isLoading, isError, refetch } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();

  return (
    <div className="flex max-h-96 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-sm font-semibold text-text">{text.notifications.heading}</h2>
        <Link
          href={PAGE_ROUTES.notificationPreferences}
          aria-label={text.notifications.settingsLinkLabel}
          className="grid size-7 shrink-0 place-items-center rounded-md text-text-muted hover:bg-border hover:text-text"
        >
          <GearIcon className="size-4" />
        </Link>
      </div>

      {isLoading && (
        <SkeletonGroup label={text.notifications.loadingSrOnly}>
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </SkeletonGroup>
      )}

      {isError && !isLoading && (
        <div role="alert" className="p-4 text-center">
          <p className="text-sm text-flag-text">{text.notifications.errorTitle}</p>
          <p className="mt-1 text-xs text-text-muted">{text.notifications.errorBody}</p>
          <button type="button" onClick={() => refetch()} className="mt-2 text-xs font-medium text-marker-700 hover:underline">
            {text.common.retryLabel}
          </button>
        </div>
      )}

      {data && !isLoading && (
        <>
          {data.items.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-text">{text.notifications.emptyTitle}</p>
              <p className="mt-1 text-xs text-text-muted">{text.notifications.emptyBody}</p>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {data.items.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} onMarkRead={() => markRead(notification.id)} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function NotificationRow({ notification, onMarkRead }: { notification: Notification; onMarkRead: () => void }) {
  const text = useText();
  const lang = useLocale();
  const isUnread = !notification.readAt;

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (isUnread) onMarkRead();
        }}
        className={`flex w-full items-start gap-2.5 px-4 py-3 text-left hover:bg-border/60 ${isUnread ? "bg-wash-bg" : ""}`}
      >
        {isUnread && <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-marker-500" />}
        <div className={`min-w-0 flex-1 ${isUnread ? "" : "pl-4.5"}`}>
          <p className={`text-sm text-text ${isUnread ? "font-medium" : ""}`}>{text.notifications.message(notification.type, notification.payload)}</p>
          <p className="mt-0.5 text-xs text-text-muted">{formatDate(notification.createdAt, lang)}</p>
        </div>
      </button>
    </li>
  );
}
