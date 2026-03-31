import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisesLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="flex gap-2">
            {[60, 48, 72, 56, 64].map((w, i) => (
              <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {[4, 3, 5].map((count, g) => (
              <div key={g}>
                <Skeleton className="mb-2 h-3 w-20" />
                <div className="flex flex-col overflow-hidden rounded-xl border">
                  {Array.from({ length: count }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex flex-col gap-1 px-4 py-3 ${i !== count - 1 ? "border-b" : ""}`}
                    >
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
