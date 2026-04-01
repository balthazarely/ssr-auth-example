import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const USER_ID = "ae5c7ab5-65b4-4c34-8ca4-03973f7068c7";
const MONTHS = 6;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── Workout templates ────────────────────────────────────────────────────────

const WORKOUT_PLANS: {
  name: string;
  muscleGroups: string[];
}[] = [
  { name: "Push Day", muscleGroups: ["chest", "shoulders", "triceps"] },
  { name: "Pull Day", muscleGroups: ["back", "biceps"] },
  {
    name: "Leg Day",
    muscleGroups: ["quads", "hamstrings", "glutes", "calves"],
  },
  { name: "Upper A", muscleGroups: ["chest", "back", "shoulders"] },
  { name: "Upper B", muscleGroups: ["chest", "back", "biceps", "triceps"] },
  { name: "Lower", muscleGroups: ["quads", "hamstrings", "glutes"] },
];

// Week schedules: indices into WORKOUT_PLANS, null = rest day
// Alternates between PPL and Upper/Lower to feel realistic
const WEEK_SCHEDULES = [
  [0, null, 1, null, 2, null, null], // PPL week
  [3, null, 4, null, 5, null, null], // Upper/Lower week
  [0, null, 1, null, 2, null, null],
  [3, null, 4, null, 5, null, null],
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function roundToNearest(val: number, nearest = 2.5): number {
  return Math.round(val / nearest) * nearest;
}

// Realistic progression model:
// - 3 working weeks followed by a deload (every 4th week drops ~10%)
// - Each 4-week cycle yields ~5% net strength gain
// - Session-level variance: bad days, normal days, great days
function progressedWeight(baseWeight: number, weekIndex: number): number {
  const cycle = Math.floor(weekIndex / 4); // which 4-week block we're in
  const weekInCycle = weekIndex % 4; // 0, 1, 2 = working; 3 = deload

  const isDeload = weekInCycle === 3;

  // Long-term gain: ~5% per completed cycle
  const cycleFactor = 1 + cycle * 0.05;

  let weekFactor: number;
  if (isDeload) {
    // Deload: intentional drop back to ~90% of this cycle's peak
    weekFactor = cycleFactor * 0.9;
  } else {
    // Working weeks ramp up 0–4% across the 3 weeks
    weekFactor = cycleFactor * (1 + weekInCycle * 0.02);
  }

  // Session-level variance — the wavy part
  const roll = Math.random();
  let sessionFactor: number;
  if (roll < 0.12) {
    // Bad day (12% chance): fatigue, poor sleep, etc.
    sessionFactor = 0.93 + Math.random() * 0.04;
  } else if (roll < 0.2) {
    // Great day (8% chance): feeling strong, hit a small PR
    sessionFactor = 1.02 + Math.random() * 0.03;
  } else {
    // Normal day: small noise around expected
    sessionFactor = 0.98 + Math.random() * 0.04;
  }

  return roundToNearest(baseWeight * weekFactor * sessionFactor);
}

// ── Base weights per muscle group (lbs) ─────────────────────────────────────

const BASE_WEIGHTS: Record<string, [number, number]> = {
  chest: [135, 185],
  back: [115, 155],
  shoulders: [35, 55],
  triceps: [30, 50],
  biceps: [30, 50],
  quads: [155, 225],
  hamstrings: [115, 155],
  glutes: [95, 135],
  calves: [45, 65],
};

function baseWeightFor(muscleGroup: string): number {
  const range = BASE_WEIGHTS[muscleGroup] ?? [45, 95];
  return range[0] + Math.floor(Math.random() * (range[1] - range[0]));
}

// ── Rep schemes by day type ──────────────────────────────────────────────────

type RepScheme = { sets: number; reps: number };

function repSchemeForWeek(weekIndex: number): RepScheme {
  const cycle = weekIndex % 3;
  if (cycle === 0) return { sets: 5, reps: pick([3, 4, 5]) }; // strength
  if (cycle === 1) return { sets: 4, reps: pick([6, 7, 8]) }; // moderate
  return { sets: 3, reps: pick([10, 12, 15]) }; // volume
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `Seeding ${MONTHS} months of workout history for user ${USER_ID}...`,
  );

  // 1. Fetch all exercises from DB
  const { data: exercises, error: exErr } = await supabase
    .from("exercises")
    .select("id, name, muscle_group");

  if (exErr || !exercises?.length) {
    console.error(
      "Failed to fetch exercises. Have you run seed-exercises.ts first?",
      exErr,
    );
    process.exit(1);
  }

  console.log(`Found ${exercises.length} exercises in DB`);

  // Group exercises by muscle group for easy lookup
  const byMuscle: Record<string, { id: string; name: string }[]> = {};
  for (const ex of exercises) {
    const mg = ex.muscle_group ?? "other";
    if (!byMuscle[mg]) byMuscle[mg] = [];
    byMuscle[mg].push({ id: ex.id, name: ex.name });
  }

  // Assign a stable base weight per exercise ID — this is the "starting strength"
  // for that exercise. Progression multiplies on top of this fixed value each week.
  const exerciseBaseWeight: Record<string, number> = {};
  for (const ex of exercises) {
    exerciseBaseWeight[ex.id] = baseWeightFor(ex.muscle_group ?? "other");
  }

  // 2. Clear existing seeded workouts for this user
  console.log("Clearing existing workout history...");
  const { error: delErr } = await supabase
    .from("workouts")
    .delete()
    .eq("user_id", USER_ID);

  if (delErr) {
    console.error("Failed to clear workouts:", delErr);
    process.exit(1);
  }

  // 3. Build workout dates going back MONTHS from today
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - MONTHS);
  // Align to Monday
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

  const workoutDays: { date: Date; planIndex: number; weekIndex: number }[] =
    [];

  let weekIndex = 0;
  const cursor = new Date(startDate);

  while (cursor <= today) {
    const schedule = WEEK_SCHEDULES[weekIndex % WEEK_SCHEDULES.length];
    for (let day = 0; day < 7; day++) {
      const planIndex = schedule[day];
      if (planIndex !== null && planIndex !== undefined) {
        const date = new Date(cursor);
        date.setDate(cursor.getDate() + day);
        if (date <= today) {
          workoutDays.push({ date, planIndex, weekIndex });
        }
      }
    }
    cursor.setDate(cursor.getDate() + 7);
    weekIndex++;
  }

  console.log(`Generating ${workoutDays.length} workout sessions...`);

  // 4. Insert workouts one by one (preserving FK order)
  let inserted = 0;
  for (const { date, planIndex, weekIndex: wk } of workoutDays) {
    const plan = WORKOUT_PLANS[planIndex];
    const scheme = repSchemeForWeek(wk);

    // Session timing: started 45-90 mins before completed
    const completedAt = new Date(date);
    completedAt.setHours(pick([7, 8, 9, 17, 18, 19]), pick([0, 15, 30]), 0, 0);
    const durationMins = 45 + Math.floor(Math.random() * 46);
    const startedAt = new Date(
      completedAt.getTime() - durationMins * 60 * 1000,
    );

    // Insert workout
    const { data: workout, error: wErr } = await supabase
      .from("workouts")
      .insert({
        user_id: USER_ID,
        name: plan.name,
        started_at: startedAt.toISOString(),
        completed_at: completedAt.toISOString(),
      })
      .select("id")
      .single();

    if (wErr || !workout) {
      console.error("Failed to insert workout:", wErr);
      continue;
    }

    // Pick 3-5 exercises from the plan's muscle groups
    const availableMuscles = plan.muscleGroups.filter(
      (mg) => byMuscle[mg]?.length,
    );
    const numExercises = 3 + Math.floor(Math.random() * 3); // 3-5
    const chosenExercises: { id: string; name: string; muscleGroup: string }[] =
      [];

    for (let i = 0; i < numExercises && availableMuscles.length > 0; i++) {
      const mg = availableMuscles[i % availableMuscles.length];
      const ex = pick(byMuscle[mg]);
      chosenExercises.push({ id: ex.id, name: ex.name, muscleGroup: mg });
    }

    // Insert workout_exercises
    for (let exIdx = 0; exIdx < chosenExercises.length; exIdx++) {
      const ex = chosenExercises[exIdx];
      const baseWeight =
        exerciseBaseWeight[ex.id] ?? baseWeightFor(ex.muscleGroup);
      const weight = progressedWeight(baseWeight, wk);

      const { data: we, error: weErr } = await supabase
        .from("workout_exercises")
        .insert({
          workout_id: workout.id,
          exercise_id: ex.id,
          exercise_name: ex.name,
          order_index: exIdx,
        })
        .select("id")
        .single();

      if (weErr || !we) {
        console.error("Failed to insert workout_exercise:", weErr);
        continue;
      }

      // Insert sets with slight weight variation across sets
      const sets = Array.from({ length: scheme.sets }, (_, setIdx) => ({
        workout_exercise_id: we.id,
        weight: roundToNearest(weight * (1 - setIdx * 0.02), 2.5), // slight drop each set
        reps: scheme.reps + (setIdx === 0 ? 0 : pick([-1, 0, 0, 1])),
        is_completed: true,
        order_index: setIdx,
      }));

      const { error: sErr } = await supabase.from("workout_sets").insert(sets);
      if (sErr) console.error("Failed to insert sets:", sErr);
    }

    inserted++;
    if (inserted % 10 === 0)
      console.log(`  ${inserted}/${workoutDays.length} workouts inserted...`);
  }

  console.log(`\nDone! Inserted ${inserted} workouts across ${MONTHS} months.`);
  process.exit(0);
}

main();
