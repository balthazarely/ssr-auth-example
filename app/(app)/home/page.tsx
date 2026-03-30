import { getWorkoutsPerWeek, getMuscleGroupStats } from "@/lib/workouts/stats";
import WorkoutWeekChart from "@/app/components/Home/WorkoutWeekChart/WorkoutWeekChart";
import MuscleGroupChart from "@/app/components/Home/MuscleGroupChart/MuscleGroupChart";

export default async function HomePage() {
  const [weekData, muscleData] = await Promise.all([
    getWorkoutsPerWeek(),
    getMuscleGroupStats(),
  ]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Home</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <WorkoutWeekChart data={weekData} />
          <MuscleGroupChart data={muscleData} />
        </div>
      </div>
    </div>
  );
}
