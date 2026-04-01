import { getExerciseHistory } from "@/lib/workouts/workouts";
import { getUserProfile } from "@/lib/users/users";
import { WeightUnit, toDisplayWeight } from "@/lib/utils/units";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ExerciseProgressChart from "@/app/components/Exercises/ExerciseProgressChart/ExerciseProgressChart";

export default async function ExerciseHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ exercise, history }, profile] = await Promise.all([getExerciseHistory(id), getUserProfile()]);

  if (!exercise) notFound();

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  const allSets = history.flatMap((e) => e.sets);
  const prSet = allSets.length > 0 ? allSets.reduce((best, s) => (s.weight > best.weight ? s : best)) : null;
  const estimated1RM = prSet && prSet.reps < 37 ? Math.round(prSet.weight * (36 / (37 - prSet.reps))) : null;

  const chartData = history
    .filter((e) => e.workout?.completed_at && e.sets.length > 0)
    .map((e) => {
      const bestWeight = Math.max(...e.sets.map((s) => s.weight));
      return {
        date: new Date(e.workout!.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weight: toDisplayWeight(bestWeight, preferredUnits),
      };
    })
    .reverse();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <Link href="/exercises" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Exercises
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{exercise.name}</h1>
          {exercise.muscle_group && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                {exercise.muscle_group}
              </span>
              {exercise.equipment && (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                  {exercise.equipment}
                </span>
              )}
            </div>
          )}
        </div>

        {prSet !== null && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
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
              <div className="rounded-xl border bg-card p-4 shadow-sm">
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

        {chartData.length > 1 && (
          <div className="mb-6">
            <ExerciseProgressChart data={chartData} units={preferredUnits} />
          </div>
        )}

        {history.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="font-semibold">No history yet</p>
            <p className="mt-1 text-sm text-muted-foreground">This exercise will appear here once you log it in a workout.</p>
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
                <div key={entry.workoutExerciseId} className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{entry.workout?.name ?? "Workout"}</p>
                      {date && <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {toDisplayWeight(totalVolume, preferredUnits).toLocaleString()} {preferredUnits}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.sets.map((set) => (
                      <span
                        key={set.id}
                        className="inline-flex items-center rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-foreground/70 ring-1 ring-border"
                      >
                        {toDisplayWeight(set.weight, preferredUnits)}
                        {preferredUnits} × {set.reps}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
