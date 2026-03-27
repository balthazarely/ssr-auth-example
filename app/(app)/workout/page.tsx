import NewWorkoutWrapper from "@/app/components/Workout/NewWorkout/NewWorkout";
import { getAllExercises } from "@/lib/exercises/exercises";

const muscleGroupColors: Record<string, string> = {
  chest: "bg-red-100 text-red-700",
  back: "bg-blue-100 text-blue-700",
  legs: "bg-green-100 text-green-700",
  shoulders: "bg-yellow-100 text-yellow-700",
  arms: "bg-purple-100 text-purple-700",
  core: "bg-orange-100 text-orange-700",
};

export default async function WorkoutPage() {
  const exercises = await getAllExercises();
  console.log(exercises);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">New Workout</h1>
        <NewWorkoutWrapper exercises={exercises ?? []} />
      </div>
    </div>
  );
}
