"use server";

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string().describe("A short, descriptive workout name e.g. 'Monday Push' or 'Heavy Leg Day'"),
  exercises: z.array(
    z.object({
      exerciseId: z.string().describe("The exact ID from the provided exercise list"),
      exerciseName: z.string().describe("The exact name from the provided exercise list"),
      sets: z.array(
        z.object({
          weight: z.number().describe("Suggested weight in the user's preferred units. Use 0 if unsure."),
          reps: z.number().describe("Target reps for this set"),
        }),
      ).describe("2-4 sets per exercise"),
    }),
  ).describe("3-8 exercises appropriate for the user's request"),
});

export type GeneratedWorkout = z.infer<typeof workoutSchema>;

export async function generateWorkoutAction(
  prompt: string,
  exercises: { id: string; name: string; muscle_group: string | null; equipment: string | null }[],
  preferredUnits: string,
): Promise<GeneratedWorkout> {
  const exerciseList = exercises
    .map(
      (e) =>
        `id="${e.id}" name="${e.name}" muscle_group="${e.muscle_group ?? "general"}" equipment="${e.equipment ?? "none"}"`,
    )
    .join("\n");

  try {
    const { object } = await generateObject({
      model: anthropic("claude-opus-4-5"),
      schema: workoutSchema,
      prompt: `You are a personal trainer creating a workout plan. The user has requested: "${prompt}"

Only use exercises from the list below — use the exact id and name values:
${exerciseList}

Rules:
- Select 3–8 exercises appropriate for the user's request
- Suggest 2–4 sets per exercise
- Suggest appropriate reps (e.g. 4–6 for strength, 8–12 for hypertrophy, 12–20 for endurance)
- Weights are in ${preferredUnits}. Suggest reasonable weights for an intermediate lifter, or 0 if uncertain
- Keep the workout focused — don't mix unrelated muscle groups unless the user asks for full body`,
    });

    return object;
  } catch (err) {
    console.error("[generateWorkoutAction] error:", err);
    throw err;
  }
}
