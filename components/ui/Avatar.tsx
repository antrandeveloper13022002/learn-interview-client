import { UserIcon } from "@/components/icons";

type AvatarProps = {
  /** Display name (or email as a fallback) — only the first character is used. Ignored when `anonymous`. */
  name?: string;
  /** No identity to draw an initial from (an anonymous post, BE-65's `authorDisplayName: null`) — renders a neutral placeholder instead of a marker-colored initial. */
  anonymous?: boolean;
  /** sm = comment/review author rows (28px), md = header account trigger (32px). */
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASS = {
  sm: "size-7 text-xs",
  md: "size-8 text-sm",
} as const;

const ICON_SIZE_CLASS = {
  sm: "size-3.5",
  md: "size-4",
} as const;

/**
 * Initial-letter avatar — there is no avatar-image field on `User` (only
 * `displayName`/`email`), so this is the only avatar this app can render
 * without inventing an upload feature. Dark ink text on the marker accent,
 * never white — same rule globals.css documents for every other use of
 * marker-500 as a fill. `anonymous` covers both an explicitly anonymous
 * post and a non-anonymous author with no `displayName` set — BE-65's
 * `authorDisplayName: null` doesn't distinguish the two, so neither does
 * this component.
 */
export function Avatar({ name, anonymous = false, size = "md", className = "" }: AvatarProps) {
  if (anonymous || !name) {
    return (
      <span
        aria-hidden="true"
        className={`inline-grid shrink-0 place-items-center rounded-full bg-border text-text-muted ${SIZE_CLASS[size]} ${className}`}
      >
        <UserIcon className={ICON_SIZE_CLASS[size]} />
      </span>
    );
  }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full bg-marker-500 font-display font-semibold text-ink-950 ${SIZE_CLASS[size]} ${className}`}
    >
      {initial}
    </span>
  );
}
