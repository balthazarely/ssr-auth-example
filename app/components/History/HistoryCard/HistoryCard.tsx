"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditWorkoutDialog from "@/app/components/History/EditWorkoutDialog/EditWorkoutDialog";
import { ActiveExerciseBlock } from "@/types";
import { Exercise } from "@/types/excercises";

interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  is_completed: boolean;
  order_index: number;
}

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  workout_sets: WorkoutSet[];
}

interface WorkoutHistoryItem {
  id: string;
  name: string;
  completed_at: string;
  workout_exercises: WorkoutExercise[];
}

interface Props {
  workout: WorkoutHistoryItem;
  exercises: Exercise[];
}

export default function HistoryCard({ workout, exercises }: Props) {
  const [editOpen, setEditOpen] = useState(false);

  const date = new Date(workout.completed_at).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const initialBlocks: ActiveExerciseBlock[] = workout.workout_exercises.map((ex) => ({
    exerciseId: ex.exercise_id,
    excerciseName: ex.exercise_name,
    sets: ex.workout_sets.map((s) => ({
      weight: s.weight,
      reps: s.reps,
      isCompleted: s.is_completed,
    })),
  }));

  return (
    <>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="font-semibold text-card-foreground">{workout.name}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          {workout.workout_exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
            >
              <span className="text-sm font-medium">{ex.exercise_name}</span>
              <span className="text-xs text-muted-foreground">
                {ex.workout_sets.length} sets ·{" "}
                {ex.workout_sets.map((s) => `${s.weight}×${s.reps}`).join(", ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <EditWorkoutDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        exercises={exercises}
        initialBlocks={initialBlocks}
        initialName={workout.name}
        workoutId={workout.id}
      />
    </>
  );
}
