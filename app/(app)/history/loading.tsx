import WorkoutHistoryListSkeleton from "@/app/components/History/WorkoutHistoryList/WorkoutHistoryListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <Skeleton className="mb-6 h-8 w-24" />
        <WorkoutHistoryListSkeleton />
      </div>
    </div>
  );
}
