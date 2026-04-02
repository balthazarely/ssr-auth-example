import { Suspense } from "react";
import WorkoutHistoryList from "@/app/components/History/WorkoutHistoryList/WorkoutHistoryList";
import WorkoutHistoryListSkeleton from "@/app/components/History/WorkoutHistoryList/WorkoutHistoryListSkeleton";

export default function HistoryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  console.log("[history] page render");

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        {/* Static shell — renders immediately */}
        <h1 className="mb-6 text-2xl font-bold">History</h1>

        {/* Dynamic list — streams in with skeleton while loading */}
        <Suspense fallback={<WorkoutHistoryListSkeleton />}>
          <WorkoutHistoryList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
