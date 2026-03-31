import { getAllExercises } from "@/lib/exercises/exercises";
import { getUser } from "@/lib/supabase/server";
import AddExerciseModal from "@/app/components/Exercises/AddExerciseModal/AddExerciseModal";
import ExerciseList from "@/app/components/Exercises/ExerciseList/ExerciseList";

export default async function ExercisesPage() {
  const [exercises, user] = await Promise.all([getAllExercises(), getUser()]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exercises</h1>
          <AddExerciseModal />
        </div>
        <ExerciseList exercises={exercises ?? []} userId={user?.id} />
      </div>
    </div>
  );
}
