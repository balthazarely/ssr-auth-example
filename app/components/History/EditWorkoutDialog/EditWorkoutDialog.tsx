"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewWorkout from "@/app/components/Workout/NewWorkout/NewWorkout";
import { ActiveExerciseBlock } from "@/types";
import { Exercise } from "@/types/excercises";
import { WeightUnit } from "@/lib/utils/units";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: Exercise[];
  initialBlocks: ActiveExerciseBlock[];
  initialName: string;
  workoutId: string;
  preferredUnits: WeightUnit;
}

export default function EditWorkoutDialog({ open, onOpenChange, exercises, initialBlocks, initialName, workoutId, preferredUnits }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
        </DialogHeader>
        <NewWorkout
          exercises={exercises}
          initialBlocks={initialBlocks}
          initialName={initialName}
          workoutId={workoutId}
          preferredUnits={preferredUnits}
          onSaveSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
