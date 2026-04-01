import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <Skeleton className="h-10 w-44 rounded-md" />
            <Skeleton className="h-10 w-60 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
