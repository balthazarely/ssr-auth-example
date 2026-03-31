import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <Skeleton className="mb-6 h-8 w-24" />
        <div className="flex flex-col items-center gap-4 py-24">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-11 w-36 rounded-md" />
            <Skeleton className="h-11 w-44 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
