import { createSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

function formatMonth(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getCurrentMonth() {
  return formatMonth(new Date());
}

export function isValidMonth(value: string) {
  return /^\d{4}-\d{2}$/.test(value);
}

function getMonthRange(month: string) {
  const [yearPart, monthPart] = month.split("-");
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  const from = new Date(Date.UTC(year, monthIndex, 1)).toISOString();
  const to = new Date(Date.UTC(year, monthIndex + 1, 1)).toISOString();
  return { from, to };
}

export async function getWorkoutHistory(month: string) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const { from, to } = getMonthRange(month);

  const getCachedWorkoutHistory = unstable_cache(
    async () => {
      const startedAt = Date.now();
      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
        id,
        name,
        started_at,
        completed_at,
        workout_exercises (
          id,
          exercise_id,
          exercise_name,
          order_index,
          workout_sets (
            id,
            weight,
            reps,
            is_completed,
            order_index
          )
        )
      `,
        )
        .eq("user_id", user.id)
        .gte("completed_at", from)
        .lt("completed_at", to)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      const durationMs = Date.now() - startedAt;
      console.log("[history] getWorkoutHistory cache-miss", {
        userId: user.id,
        month,
        rows: data?.length ?? 0,
        durationMs,
      });

      return data ?? [];
    },
    ["workout-history", user.id, month],
    {
      tags: [`history:${user.id}`],
      revalidate: 300,
    },
  );

  const data = await getCachedWorkoutHistory();

  return {
    data,
  };
}

export async function getLastExerciseSets(exerciseId: string): Promise<{ weight: number; reps: number }[]> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("workout_exercises")
    .select("workout_sets ( weight, reps, order_index )")
    .eq("exercise_id", exerciseId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return [];

  return (data.workout_sets as { weight: number; reps: number; order_index: number }[])
    .sort((a, b) => a.order_index - b.order_index)
    .map(({ weight, reps }) => ({ weight, reps }));
}

export type ExerciseHistoryEntry = {
  workoutExerciseId: string;
  exerciseName: string;
  workout: { id: string; name: string; completed_at: string } | null;
  sets: { id: string; weight: number; reps: number; order_index: number }[];
};

export type ExerciseHistoryResult = {
  exercise: { id: string; name: string; muscle_group: string | null; equipment: string | null } | null;
  history: ExerciseHistoryEntry[];
};

export async function getExerciseHistory(exerciseId: string): Promise<ExerciseHistoryResult> {
  const supabase = await createSupabaseClient();

  const [{ data: exerciseData }, { data, error }] = await Promise.all([
    supabase.from("exercises").select("id, name, muscle_group, equipment").eq("id", exerciseId).single(),
    supabase
      .from("workout_exercises")
      .select(
        `
        id,
        exercise_name,
        workouts ( id, name, completed_at ),
        workout_sets ( id, weight, reps, order_index )
      `,
      )
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false }),
  ]);

  if (error) throw error;

  return {
    exercise: exerciseData ?? null,
    history: (data ?? []).map((row) => ({
      workoutExerciseId: row.id,
      exerciseName: row.exercise_name,
      workout: (row.workouts as unknown as { id: string; name: string; completed_at: string }) ?? null,
      sets: (row.workout_sets as { id: string; weight: number; reps: number; order_index: number }[]).sort(
        (a, b) => a.order_index - b.order_index,
      ),
    })),
  };
}
