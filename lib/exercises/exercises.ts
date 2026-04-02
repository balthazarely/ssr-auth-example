import { createSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

export async function getAllExercises() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const getCachedAllExercises = unstable_cache(
    async () => {
      const startedAt = Date.now();
      const { data, error } = await supabase.from("exercises").select("*");

      if (error) throw error;

      const durationMs = Date.now() - startedAt;
      console.log("[exercises] getAllExercises cache-miss", {
        userId: user.id,
        rows: data?.length ?? 0,
        durationMs,
      });

      return data ?? [];
    },
    ["all-exercises", user.id],
    {
      tags: [`exercises:${user.id}`],
      revalidate: 3600,
    },
  );

  return getCachedAllExercises();
}
