import { text } from "@/lib/text";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-neutral-200 ${className}`} />;
}

type SkeletonGroupProps = {
  label?: string;
  children: React.ReactNode;
};

export function SkeletonGroup({ label = text.common.loading, children }: SkeletonGroupProps) {
  return (
    <div role="status" aria-busy="true" className="contents">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
