import ChartSkeleton from "@/app/components/Home/ChartSkeleton/ChartSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <Skeleton className="mb-6 h-8 w-20" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}
