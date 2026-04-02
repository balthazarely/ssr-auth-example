"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createExerciseAction(formData: {
  name: string;
  muscle_group: string;
  equipment: string | null;
  movement_pattern: string | null;
  is_compound: boolean;
}) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("exercises").insert({
    name: formData.name,
    muscle_group: formData.muscle_group,
    equipment: formData.equipment || null,
    movement_pattern: formData.movement_pattern || null,
    is_compound: formData.is_compound,
    is_custom: true,
    created_by: user.id,
  });

  if (error) throw error;

  revalidateTag(`exercises:${user.id}`, "max");
  revalidatePath("/exercises");
}

export async function updateExerciseAction(
  exerciseId: string,
  formData: {
    name: string;
    muscle_group: string;
    equipment: string | null;
    movement_pattern: string | null;
    is_compound: boolean;
  },
) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("exercises")
    .update({
      name: formData.name,
      muscle_group: formData.muscle_group,
      equipment: formData.equipment || null,
      movement_pattern: formData.movement_pattern || null,
      is_compound: formData.is_compound,
    })
    .eq("id", exerciseId)
    .eq("created_by", user.id)
    .eq("is_custom", true);

  if (error) throw error;

  revalidateTag(`exercises:${user.id}`, "max");
  revalidatePath("/exercises");
}

export async function deleteExerciseAction(exerciseId: string) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Rename references in workout_exercises before deleting
  await supabase.from("workout_exercises").update({ exercise_name: "Deleted Exercise" }).eq("exercise_id", exerciseId);

  const { error } = await supabase.from("exercises").delete().eq("id", exerciseId).eq("created_by", user.id).eq("is_custom", true);

  if (error) throw error;

  revalidateTag(`exercises:${user.id}`, "max");
  revalidatePath("/exercises");
}
