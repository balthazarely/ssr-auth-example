import { Suspense } from "react";
import { getExerciseHistory } from "@/lib/workouts/workouts";
import { getUserProfile } from "@/lib/users/users";
import { WeightUnit, toDisplayWeight } from "@/lib/units";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

async function ExerciseHistoryContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ exercise, history }, profile] = await Promise.all([
    getExerciseHistory(id),
    getUserProfile(),
  ]);

  if (!exercise) notFound();

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  const allSets = history.flatMap((e) => e.sets);
  const prSet = allSets.length > 0 ? allSets.reduce((best, s) => s.weight > best.weight ? s : best) : null;
  const estimated1RM = prSet && prSet.reps < 37
    ? Math.round(prSet.weight * (36 / (37 - prSet.reps)))
    : null;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{exercise.name}</h1>
        {exercise.muscle_group && (
          <p className="mt-1 text-sm capitalize text-muted-foreground">{exercise.muscle_group}</p>
        )}
      </div>

      {prSet !== null && (
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weight PR</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-3xl font-bold">
                {toDisplayWeight(prSet.weight, preferredUnits)}
                <span className="ml-1 text-base font-medium text-muted-foreground">{preferredUnits}</span>
              </p>
              <p className="text-sm text-muted-foreground">{prSet.reps} reps</p>
            </div>
          </div>
          {estimated1RM !== null && (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Est. 1RM</p>
              <p className="mt-1 text-3xl font-bold">
                {toDisplayWeight(estimated1RM, preferredUnits)}
                <span className="ml-1 text-base font-medium text-muted-foreground">{preferredUnits}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Brzycki formula</p>
            </div>
          )}
        </div>
      )}

      {history.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="font-medium">No history yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This exercise will appear here once you log it in a workout.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((entry) => {
            const date = entry.workout?.completed_at
              ? new Date(entry.workout.completed_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            const totalVolume = entry.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

            return (
              <div key={entry.workoutExerciseId} className="rounded-xl border bg-card p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{entry.workout?.name ?? "Workout"}</p>
                    {date && <p className="text-xs text-muted-foreground">{date}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {toDisplayWeight(totalVolume, preferredUnits).toLocaleString()} {preferredUnits} total
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-[2rem_1fr_1fr] gap-2 px-1 text-xs font-medium text-muted-foreground">
                    <span>Set</span>
                    <span>Weight ({preferredUnits})</span>
                    <span>Reps</span>
                  </div>
                  {entry.sets.map((set, i) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-[2rem_1fr_1fr] gap-2 rounded-lg bg-muted px-1 py-1.5 text-sm"
                    >
                      <span className="text-center text-muted-foreground">{i + 1}</span>
                      <span>{toDisplayWeight(set.weight, preferredUnits)} {preferredUnits}</span>
                      <span>{set.reps} reps</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function ExerciseHistorySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-7 rounded-lg" />
            <Skeleton className="h-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExerciseHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/exercises"
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Exercises
        </Link>

        <Suspense fallback={<ExerciseHistorySkeleton />}>
          <ExerciseHistoryContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}
