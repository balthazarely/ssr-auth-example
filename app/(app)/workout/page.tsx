import { Suspense } from "react";
import WorkoutStarter from "@/app/components/Workout/WorkoutStarter/WorkoutStarter";
import { getAllExercises } from "@/lib/exercises/exercises";
import { getUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/users/users";
import { WeightUnit } from "@/lib/units";
import { Skeleton } from "@/components/ui/skeleton";

async function WorkoutContent() {
  const [exercises, user, profile] = await Promise.all([
    getAllExercises(),
    getUser(),
    getUserProfile(),
  ]);

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  return (
    <WorkoutStarter
      exercises={exercises ?? []}
      userId={user?.id}
      preferredUnits={preferredUnits}
    />
  );
}

function WorkoutSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <Suspense fallback={<WorkoutSkeleton />}>
          <WorkoutContent />
        </Suspense>
      </div>
    </div>
  );
}
