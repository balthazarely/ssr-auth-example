import { createSupabaseClient } from "@/lib/supabase/server";

const PAGE_SIZE = 5;

export async function getWorkoutHistory(page = 0) {
  const supabase = await createSupabaseClient();
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [{ count }, { data, error }] = await Promise.all([
    supabase.from("workouts").select("*", { count: "exact", head: true }),
    supabase
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
      .order("completed_at", { ascending: false })
      .range(from, to),
  ]);

  if (error) throw error;
  return {
    data: data ?? [],
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
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
    supabase
      .from("exercises")
      .select("id, name, muscle_group, equipment")
      .eq("id", exerciseId)
      .single(),
    supabase
      .from("workout_exercises")
      .select(`
        id,
        exercise_name,
        workouts ( id, name, completed_at ),
        workout_sets ( id, weight, reps, order_index )
      `)
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
      sets: (row.workout_sets as { id: string; weight: number; reps: number; order_index: number }[])
        .sort((a, b) => a.order_index - b.order_index),
    })),
  };
}
