"use client";

import Exercises from "../Exercise/Exercise";
import AddExerciseDialog from "../AddExerciseDialog/AddExerciseDialog";
import { Button } from "@/components/ui/button";
import { ActiveExerciseSets, ActiveExerciseBlock } from "@/types";
import { Exercise } from "@/types/excercises";
import { startTransition, useState } from "react";
import { saveWorkoutAction, updateWorkoutAction } from "@/actions/workouts";
import { Input } from "@/components/ui/input";

interface Props {
  exercises: Exercise[];
  initialBlocks?: ActiveExerciseBlock[];
  initialName?: string;
  workoutId?: string;
  onSaveSuccess?: () => void;
}

export default function NewWorkout({ exercises, initialBlocks, initialName, workoutId, onSaveSuccess }: Props) {
  const [blocks, setBlocks] = useState<ActiveExerciseBlock[]>(initialBlocks ?? []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState(initialName ?? "");

  const updateBlock = (
    blockIndex: number,
    updater: (block: ActiveExerciseBlock) => ActiveExerciseBlock,
  ) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === blockIndex ? updater(block) : block)),
    );
  };

  const handleChangeSet = (
    blockIndex: number,
    setIndex: number,
    field: keyof ActiveExerciseSets,
    value: string | boolean,
  ) => {
    updateBlock(blockIndex, (block) => ({
      ...block,
      sets: block.sets.map((set, j) =>
        j === setIndex
          ? {
              ...set,
              [field]: typeof value === "boolean" ? value : Number(value),
            }
          : set,
      ),
    }));
  };

  const handleAddSet = (blockIndex: number) => {
    updateBlock(blockIndex, (block) => {
      const last = block.sets[block.sets.length - 1];
      return {
        ...block,
        sets: [
          ...block.sets,
          { weight: last.weight, reps: last.reps, isCompleted: false },
        ],
      };
    });
  };

  const handleRemoveBlock = (blockIndex: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
  };

  const handleDeleteSet = (blockIndex: number, setIndex: number) => {
    updateBlock(blockIndex, (block) => ({
      ...block,
      sets: block.sets.filter((_, j) => j !== setIndex),
    }));
  };

  const handleSelectExercise = (exercises: Exercise[]) => {
    setBlocks((prev) => [
      ...prev,
      ...exercises.map((exercise) => ({
        exerciseId: exercise.id,
        excerciseName: exercise.name,
        sets: [{ weight: 0, reps: 0, isCompleted: false }],
      })),
    ]);
    setDialogOpen(false);
  };

  const handleSaveWorkout = () => {
    startTransition(async () => {
      if (workoutId) {
        await updateWorkoutAction(workoutId, blocks, workoutName || undefined);
        onSaveSuccess?.();
      } else {
        await saveWorkoutAction(blocks, workoutName || undefined);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Input
        placeholder="Workout name (e.g. Monday Push)"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className="text-base font-medium"
      />
      {blocks.map((block, blockIndex) => (
        <Exercises
          key={blockIndex}
          sets={block.sets}
          excerciseName={block.excerciseName}
          onChangeSet={(setIndex, field, value) =>
            handleChangeSet(blockIndex, setIndex, field, value)
          }
          onAddSet={() => handleAddSet(blockIndex)}
          onDeleteSet={(setIndex) => handleDeleteSet(blockIndex, setIndex)}
          onRemove={() => handleRemoveBlock(blockIndex)}
        />
      ))}

      <Button onClick={() => setDialogOpen(true)}>Add Exercise</Button>
      <Button
        disabled={blocks.length === 0}
        onClick={() => handleSaveWorkout()}
      >
        Save WorkOut
      </Button>
      <AddExerciseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercises={exercises}
        onSelect={handleSelectExercise}
      />
    </div>
  );
}
