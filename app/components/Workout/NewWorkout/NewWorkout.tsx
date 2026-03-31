"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Exercises from "../Exercise/Exercise";
import AddExerciseDialog from "../AddExerciseDialog/AddExerciseDialog";
import WorkoutTimer from "../WorkoutTimer/WorkoutTimer";
import { useWorkoutDraft } from "@/hooks/useWorkoutDraft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
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
import { ActiveExerciseSets, ActiveExerciseBlock } from "@/types";
import { Exercise } from "@/types/excercises";
import { saveWorkoutAction, updateWorkoutAction, getLastExerciseSetsAction } from "@/actions/workouts";
import { WeightUnit, toStoredLbs } from "@/lib/units";

interface Props {
  exercises: Exercise[];
  initialBlocks?: ActiveExerciseBlock[];
  initialName?: string;
  workoutId?: string;
  userId?: string;
  preferredUnits?: WeightUnit;
  onSaveSuccess?: () => void;
  onCancel?: () => void;
}

export default function NewWorkout({
  exercises,
  initialBlocks,
  initialName,
  workoutId,
  userId,
  preferredUnits = "lbs",
  onSaveSuccess,
  onCancel,
}: Props) {
  const isEditing = !!workoutId;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isSaving, startTransition] = useTransition();
  const router = useRouter();

  const { blocks, setBlocks, workoutName, setWorkoutName, startedAt, clearDraft } =
    useWorkoutDraft(!isEditing, initialBlocks, initialName, userId);

  // --- block helpers ---
  const updateBlock = (
    blockIndex: number,
    updater: (block: ActiveExerciseBlock) => ActiveExerciseBlock,
  ) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === blockIndex ? updater(block) : block)),
    );
  };

  const handleAddSet = (blockIndex: number) => {
    updateBlock(blockIndex, (block) => {
      const last = block.sets[block.sets.length - 1];
      const newSet = last
        ? { weight: last.weight, reps: last.reps, isCompleted: false }
        : { weight: 0, reps: 0, isCompleted: false };
      return { ...block, sets: [...block.sets, newSet] };
    });
  };

  const handleDeleteSet = (blockIndex: number, setIndex: number) => {
    updateBlock(blockIndex, (block) => ({
      ...block,
      sets: block.sets.filter((_, j) => j !== setIndex),
    }));
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

  const handleRemoveBlock = (blockIndex: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
  };

  // --- dialog ---

  const handleSelectExercise = async (selected: Exercise[]) => {
    const blocksWithHistory = await Promise.all(
      selected.map(async (exercise) => {
        const lastSets = await getLastExerciseSetsAction(exercise.id);
        return {
          exerciseId: exercise.id,
          excerciseName: exercise.name,
          sets:
            lastSets.length > 0
              ? lastSets.map((s) => ({ ...s, isCompleted: false }))
              : [{ weight: 0, reps: 0, isCompleted: false }],
        };
      }),
    );
    setBlocks((prev) => [...prev, ...blocksWithHistory]);
    setDialogOpen(false);
  };

  // --- save ---

  const handleSaveWorkout = () => {
    startTransition(async () => {
      const convertedBlocks = blocks.map((block) => ({
        ...block,
        sets: block.sets.map((set) => ({
          ...set,
          weight: toStoredLbs(set.weight, preferredUnits),
        })),
      }));

      if (isEditing) {
        await updateWorkoutAction(workoutId, convertedBlocks, workoutName || undefined);
        onSaveSuccess?.();
      } else {
        clearDraft();
        await saveWorkoutAction(convertedBlocks, workoutName || undefined, startedAt ?? undefined);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Workout name (e.g. Monday Push)"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="text-lg font-medium"
          />
          {!isEditing && startedAt && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setCancelOpen(true)}
                >
                  Cancel Workout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {!isEditing && startedAt && <WorkoutTimer startedAt={startedAt} />}
      </div>

      {blocks.map((block, blockIndex) => (
        <Exercises
          key={blockIndex}
          sets={block.sets}
          workoutId={workoutId}
          excerciseName={block.excerciseName}
          preferredUnits={preferredUnits}
          onChangeSet={(setIndex, field, value) =>
            handleChangeSet(blockIndex, setIndex, field, value)
          }
          onAddSet={() => handleAddSet(blockIndex)}
          onDeleteSet={(setIndex) => handleDeleteSet(blockIndex, setIndex)}
          onRemove={() => handleRemoveBlock(blockIndex)}
        />
      ))}

      <Button variant="outline" onClick={() => setDialogOpen(true)}>
        Add Exercise
      </Button>
      <Button size="lg" disabled={blocks.length === 0 || isSaving} onClick={handleSaveWorkout}>
        {isSaving ? "Saving..." : "Save Workout"}
      </Button>

      <AddExerciseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercises={exercises}
        onSelect={handleSelectExercise}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel workout?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Going</AlertDialogCancel>
            <AlertDialogAction onClick={() => { clearDraft(); onCancel ? onCancel() : router.push("/history"); }}>
              Cancel Workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
