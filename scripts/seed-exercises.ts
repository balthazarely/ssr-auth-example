import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { exercises } from "@/data/exercises-data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const { error } = await supabase.from("exercises").insert(exercises);

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }

  console.log("Exercises seeded successfully!");
  process.exit(0);
}

main();
