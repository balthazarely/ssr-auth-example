import { createSupabaseClient } from "@/lib/supabase/server";

export async function getAllExercises() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.from("exercises").select("*");

  if (error) throw error;
  return data;
}
