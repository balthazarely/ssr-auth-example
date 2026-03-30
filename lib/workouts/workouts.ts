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
