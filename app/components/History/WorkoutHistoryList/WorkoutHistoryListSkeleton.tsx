import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutHistoryListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="rounded-lg bg-muted px-3 py-2">
                <Skeleton className="mb-2 h-3 w-28" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
