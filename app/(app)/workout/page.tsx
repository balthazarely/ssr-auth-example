import WorkoutStarter from "@/app/components/Workout/WorkoutStarter/WorkoutStarter";
import { getAllExercises } from "@/lib/exercises/exercises";
import { getUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/users/users";
import { WeightUnit } from "@/lib/utils/units";

export default async function WorkoutPage() {
  const [exercises, user, profile] = await Promise.all([getAllExercises(), getUser(), getUserProfile()]);

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <WorkoutStarter exercises={exercises ?? []} userId={user?.id} preferredUnits={preferredUnits} />
      </div>
    </div>
  );
}
