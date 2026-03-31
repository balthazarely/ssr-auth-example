import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <Skeleton className="mb-6 h-8 w-24" />
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border p-6">
            <Skeleton className="mb-4 h-5 w-32" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
