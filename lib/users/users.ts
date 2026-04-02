import { createSupabaseClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  preferred_units: string | null;
  theme: string | null;
  created_at: string;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const startedAt = Date.now();
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, preferred_units, theme, created_at")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  const durationMs = Date.now() - startedAt;
  console.log("[history] getUserProfile", {
    userId: user.id,
    durationMs,
  });

  return data;
}
