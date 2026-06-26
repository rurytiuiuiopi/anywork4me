export function CardSkeleton() {
  return (
    <div className="flex gap-4 rounded-3xl border border-border bg-background p-3">
      <div className="fm-skeleton h-24 w-24 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2 py-1">
        <div className="fm-skeleton h-4 w-2/3 rounded-md" />
        <div className="fm-skeleton h-3 w-1/2 rounded-md" />
        <div className="fm-skeleton h-3 w-1/3 rounded-md" />
        <div className="fm-skeleton mt-3 h-3 w-1/4 rounded-md" />
      </div>
    </div>
  );
}

export function CardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
