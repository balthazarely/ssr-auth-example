import { Suspense } from "react";
import WorkoutWeekChartLoader from "@/app/components/Home/WorkoutWeekChart/WorkoutWeekChartLoader";
import MuscleGroupChartLoader from "@/app/components/Home/MuscleGroupChart/MuscleGroupChartLoader";
import ChartSkeleton from "@/app/components/Home/ChartSkeleton/ChartSkeleton";

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* Static shell — renders immediately */}
        <h1 className="mb-6 text-2xl font-bold">Home</h1>

        {/* Dynamic charts — each streams in independently */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Suspense fallback={<ChartSkeleton />}>
            <WorkoutWeekChartLoader />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <MuscleGroupChartLoader />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
