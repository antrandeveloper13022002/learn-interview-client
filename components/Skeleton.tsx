type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-border ${className}`} />;
}

type SkeletonGroupProps = {
  label: string;
  children: React.ReactNode;
};

export function SkeletonGroup({ label, children }: SkeletonGroupProps) {
  return (
    <div role="status" aria-busy="true" className="contents">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
