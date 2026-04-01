"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { generateWorkoutAction, GeneratedWorkout } from "@/actions/ai";
import { Exercise } from "@/types/excercises";
import { WeightUnit } from "@/lib/utils/units";
import { ActiveExerciseBlock } from "@/types";

const SUGGESTIONS = [
  "Push day focused on chest",
  "Heavy leg day",
  "Full body, 45 minutes",
  "Pull day, back and biceps",
  "Quick upper body workout",
  "Shoulder and arms",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: Exercise[];
  preferredUnits: WeightUnit;
  onGenerated: (name: string, blocks: ActiveExerciseBlock[]) => void;
}

export default function AiWorkoutModal({ open, onOpenChange, exercises, preferredUnits, onGenerated }: Props) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        const result: GeneratedWorkout = await generateWorkoutAction(
          prompt,
          exercises.map((e) => ({
            id: e.id,
            name: e.name,
            muscle_group: e.muscle_group ?? null,
            equipment: e.equipment ?? null,
          })),
          preferredUnits,
        );

        const blocks: ActiveExerciseBlock[] = result.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          excerciseName: ex.exerciseName,
          sets: ex.sets.map((s) => ({
            weight: s.weight,
            reps: s.reps,
            isCompleted: false,
          })),
        }));

        onGenerated(result.name, blocks);
        setPrompt("");
        onOpenChange(false);
      } catch {
        setError("Failed to generate workout. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Generate a Workout
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Textarea
              placeholder="Describe what you want to train today…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                disabled={isPending}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleGenerate} disabled={!prompt.trim() || isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Workout
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
