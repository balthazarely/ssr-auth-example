"use client";

import { startTransition, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditWorkoutDialog from "@/app/components/History/EditWorkoutDialog/EditWorkoutDialog";
import { deleteWorkoutAction } from "@/actions/workouts";
import { ActiveExerciseBlock } from "@/types";
import { Exercise } from "@/types/excercises";
import { WeightUnit, toDisplayWeight } from "@/lib/units";

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
  started_at: string | null;
  completed_at: string;
  workout_exercises: WorkoutExercise[];
}

interface Props {
  workout: WorkoutHistoryItem;
  exercises: Exercise[];
  preferredUnits: WeightUnit;
}

export default function HistoryCard({ workout, exercises, preferredUnits }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteWorkoutAction(workout.id);
    });
  };

  const date = new Date(workout.completed_at).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  console.log(workout);

  const duration = (() => {
    if (!workout.started_at) return null;
    const ms = new Date(workout.completed_at).getTime() - new Date(workout.started_at).getTime();
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  })();

  const initialBlocks: ActiveExerciseBlock[] = workout.workout_exercises.map(
    (ex) => ({
      exerciseId: ex.exercise_id,
      excerciseName: ex.exercise_name,
      sets: ex.workout_sets.map((s) => ({
        weight: s.weight,
        reps: s.reps,
        isCompleted: s.is_completed,
      })),
    }),
  );

  return (
    <>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-card-foreground">{workout.name}</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{date}</span>
              {duration && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {duration}
                  </span>
                </>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          {workout.workout_exercises.map((ex) => (
            <div key={ex.id} className="rounded-lg border border-border/50 bg-muted/50 px-3 py-2.5">
              <p className="text-sm font-semibold">{ex.exercise_name}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {ex.workout_sets.map((s, i) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-foreground/70 ring-1 ring-border"
                  >
                    {toDisplayWeight(s.weight, preferredUnits)}{preferredUnits} × {s.reps}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{workout.name}</strong>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditWorkoutDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        exercises={exercises}
        initialBlocks={initialBlocks}
        initialName={workout.name}
        workoutId={workout.id}
        preferredUnits={preferredUnits}
      />
    </>
  );
}
