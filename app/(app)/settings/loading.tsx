import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-xl border">
            <div className="bg-muted/40 px-6 py-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex min-w-0 flex-col gap-2">
                  <Skeleton className="h-4 w-44 max-w-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-t py-3.5 first:border-t-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <div className="border-b bg-muted/40 px-6 py-5">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <div className="border-b bg-muted/40 px-6 py-5">
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="px-6 py-5">
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
