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
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="font-semibold text-card-foreground">{workout.name}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
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

        <div className="flex flex-col gap-1.5">
          {workout.workout_exercises.map((ex) => (
            <div key={ex.id} className="rounded-lg bg-muted px-3 py-2">
              <p className="text-sm font-medium">{ex.exercise_name}</p>
              <div className="mt-1 flex flex-col gap-0.5">
                {ex.workout_sets.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span className="w-12">Set {i + 1}</span>
                    <span>{s.weight} lbs</span>
                    <span>·</span>
                    <span>{s.reps} reps</span>
                  </div>
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
      />
    </>
  );
}
