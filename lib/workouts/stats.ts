import { createSupabaseClient } from "@/lib/supabase/server";

export interface MuscleGroupStat {
  muscle_group: string;
  sets: number;
}

export async function getMuscleGroupStats(): Promise<MuscleGroupStat[]> {
  const supabase = await createSupabaseClient();

  // Start of this week's Monday
  const now = new Date();
  const diffToMonday = (now.getDay() + 6) % 7;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - diffToMonday);
  thisMonday.setHours(0, 0, 0, 0);

  // Get workout IDs completed this week
  const { data: workouts } = await supabase
    .from("workouts")
    .select("id")
    .gte("completed_at", thisMonday.toISOString());

  const workoutIds = (workouts ?? []).map((w) => w.id);
  if (workoutIds.length === 0) return [];

  const { data, error } = await supabase
    .from("workout_exercises")
    .select(`
      exercises ( muscle_group ),
      workout_sets ( id )
    `)
    .in("workout_id", workoutIds);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const exercises = row.exercises as unknown as { muscle_group: string | null } | null;
    const group = exercises?.muscle_group ?? "other";
    const setCount = Array.isArray(row.workout_sets) ? row.workout_sets.length : 0;
    counts[group] = (counts[group] ?? 0) + setCount;
  }

  return Object.entries(counts)
    .map(([muscle_group, sets]) => ({ muscle_group, sets }))
    .sort((a, b) => b.sets - a.sets)
    .slice(0, 8);
}

export interface WorkoutWeekStat {
  week: string;    // "3/30", "3/23", etc.
  workouts: number;
}

export async function getWorkoutsPerWeek(): Promise<WorkoutWeekStat[]> {
  const supabase = await createSupabaseClient();

  // Start of the Monday 8 weeks ago
  const now = new Date();
  const diffToMonday = (now.getDay() + 6) % 7;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - diffToMonday);
  thisMonday.setHours(0, 0, 0, 0);

  const eightWeeksAgo = new Date(thisMonday);
  eightWeeksAgo.setDate(thisMonday.getDate() - 7 * 7); // 7 prior weeks + current

  const { data, error } = await supabase
    .from("workouts")
    .select("completed_at")
    .gte("completed_at", eightWeeksAgo.toISOString());

  if (error) throw error;

  // Build the 8 week buckets (oldest → newest)
  const weeks: { monday: Date; label: string }[] = [];
  for (let i = 7; i >= 0; i--) {
    const monday = new Date(thisMonday);
    monday.setDate(thisMonday.getDate() - i * 7);
    const label = `${monday.getMonth() + 1}/${monday.getDate()}`;
    weeks.push({ monday, label });
  }

  // Count workouts per week bucket
  const counts: Record<string, number> = Object.fromEntries(
    weeks.map((w) => [w.label, 0]),
  );

  for (const row of data ?? []) {
    const date = new Date(row.completed_at);
    // Find which week bucket this belongs to
    for (let i = weeks.length - 1; i >= 0; i--) {
      if (date >= weeks[i].monday) {
        counts[weeks[i].label]++;
        break;
      }
    }
  }

  return weeks.map((w) => ({ week: w.label, workouts: counts[w.label] }));
}
