import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseHistoryLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="mb-4">
          <Skeleton className="h-8 w-52 max-w-full" />
          <div className="mt-1.5 flex items-center gap-1.5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <Skeleton className="h-3 w-16" />
            <div className="mt-2 flex items-end gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        </div>

        <div className="mb-6">
          <Skeleton className="h-48 rounded-xl" />
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
