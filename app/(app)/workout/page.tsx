import WorkoutStarter from "@/app/components/Workout/WorkoutStarter/WorkoutStarter";
import { getAllExercises } from "@/lib/exercises/exercises";
import { getUser } from "@/lib/supabase/server";

export default async function WorkoutPage() {
  const [exercises, user] = await Promise.all([getAllExercises(), getUser()]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <WorkoutStarter exercises={exercises ?? []} userId={user?.id} />
      </div>
    </div>
  );
}
