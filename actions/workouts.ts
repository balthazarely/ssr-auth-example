"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { ActiveExerciseBlock } from "@/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getLastExerciseSets } from "@/lib/workouts/workouts";

export async function getLastExerciseSetsAction(
  exerciseId: string,
): Promise<{ weight: number; reps: number }[]> {
  return getLastExerciseSets(exerciseId);
}

export async function saveWorkoutAction(
  blocks: ActiveExerciseBlock[],
  name?: string,
  startedAt?: number,
) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. create the workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      name: name ?? "Workout",
      started_at: startedAt ? new Date(startedAt).toISOString() : null,
    })
    .select()
    .single();

  if (workoutError) throw workoutError;

  // 2. insert each exercise block
  const { data: workoutExercises, error: exercisesError } = await supabase
    .from("workout_exercises")
    .insert(
      blocks.map((block, index) => ({
        workout_id: workout.id,
        exercise_id: block.exerciseId,
        exercise_name: block.excerciseName,
        order_index: index,
      })),
    )
    .select();

  if (exercisesError) throw exercisesError;

  // 3. insert sets for each exercise
  const allSets = workoutExercises.flatMap((we, blockIndex) =>
    blocks[blockIndex].sets.map((set, setIndex) => ({
      workout_exercise_id: we.id,
      weight: set.weight,
      reps: set.reps,
      order_index: setIndex,
    })),
  );

  const { error: setsError } = await supabase
    .from("workout_sets")
    .insert(allSets);

  if (setsError) throw setsError;

  revalidatePath("/history");
  redirect("/history");
}

export async function updateWorkoutAction(
  workoutId: string,
  blocks: ActiveExerciseBlock[],
  name?: string,
) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. update workout name
  const { error: workoutError } = await supabase
    .from("workouts")
    .update({ name: name ?? "Workout" })
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (workoutError) throw workoutError;

  // 2. delete existing exercises (sets cascade via FK)
  const { error: deleteError } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("workout_id", workoutId);

  if (deleteError) throw deleteError;

  // 3. reinsert exercises
  const { data: workoutExercises, error: exercisesError } = await supabase
    .from("workout_exercises")
    .insert(
      blocks.map((block, index) => ({
        workout_id: workoutId,
        exercise_id: block.exerciseId,
        exercise_name: block.excerciseName,
        order_index: index,
      })),
    )
    .select();

  if (exercisesError) throw exercisesError;

  // 4. reinsert sets
  const allSets = workoutExercises.flatMap((we, blockIndex) =>
    blocks[blockIndex].sets.map((set, setIndex) => ({
      workout_exercise_id: we.id,
      weight: set.weight,
      reps: set.reps,
      order_index: setIndex,
    })),
  );

  const { error: setsError } = await supabase
    .from("workout_sets")
    .insert(allSets);

  if (setsError) throw setsError;

  revalidatePath("/history");
}

export async function deleteWorkoutAction(workoutId: string) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/history");
}
