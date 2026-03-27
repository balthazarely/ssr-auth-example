"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createAccountAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };

  redirect("/home");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/home");
}

export async function logoutAction() {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) return { error: error.message };

  redirect("/login");
}

// app/lib/actions/auth.ts
export async function signInWithGoogleAction() {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url); // redirects to Google
}
