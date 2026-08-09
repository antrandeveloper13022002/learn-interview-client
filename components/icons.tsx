// Small dependency-free line icons (stroke, currentColor) — no icon library
// is installed in this project; keep this the single source for the handful
// this app actually uses instead of adding a new dependency for a few SVGs.
// One stroke weight (1.75) per better-ui's icon guidance.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CodeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 8l-5 4 5 4M15 8l5 4-5 4" />
    </svg>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function BookmarkIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} className={className} fill={filled ? "currentColor" : "none"}>
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function StarIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} className={className} fill={filled ? "currentColor" : "none"}>
      <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.2 6.1-.6L12 3.5Z" />
    </svg>
  );
}

export function FlagIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 21V4h12l-3 4 3 4H6" />
    </svg>
  );
}
