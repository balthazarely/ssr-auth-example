import { getWorkoutHistory } from "@/lib/workouts/workouts";
import { getAllExercises } from "@/lib/exercises/exercises";
import HistoryCard from "@/app/components/History/HistoryCard/HistoryCard";

export default async function HistoryPage() {
  const [history, exercises] = await Promise.all([
    getWorkoutHistory(),
    getAllExercises(),
  ]);

  console.log("History Page");

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">History</h1>
        {history.length === 0 && (
          <p className="text-sm text-muted-foreground">No workouts yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {history.map((workout) => (
            <HistoryCard
              key={workout.id}
              workout={workout}
              exercises={exercises}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
