"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { updateExerciseAction, deleteExerciseAction } from "@/actions/exercises";

const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "legs",
  "core",
  "glutes",
  "calves",
  "full body",
];

const MOVEMENT_PATTERNS = [
  "push",
  "pull",
  "hinge",
  "squat",
  "carry",
  "rotation",
];

interface Exercise {
  id: string;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
  movement_pattern: string | null;
  is_compound: boolean | null;
}

export default function ExerciseActions({ exercise }: { exercise: Exercise }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    name: exercise.name,
    muscle_group: exercise.muscle_group ?? "",
    equipment: exercise.equipment ?? "",
    movement_pattern: exercise.movement_pattern ?? "",
    is_compound: exercise.is_compound ?? false,
  });
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    if (!form.name.trim() || !form.muscle_group) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateExerciseAction(exercise.id, {
          name: form.name.trim(),
          muscle_group: form.muscle_group,
          equipment: form.equipment || null,
          movement_pattern: form.movement_pattern || null,
          is_compound: form.is_compound,
        });
        setEditOpen(false);
      } catch {
        setError("Failed to update exercise. Please try again.");
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      await deleteExerciseAction(exercise.id);
      setDeleteOpen(false);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Muscle Group</Label>
              <Select
                value={form.muscle_group}
                onValueChange={(v) => setForm((f) => ({ ...f, muscle_group: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {MUSCLE_GROUPS.map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Equipment <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                value={form.equipment}
                onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Movement Pattern <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Select
                value={form.movement_pattern}
                onValueChange={(v) => setForm((f) => ({ ...f, movement_pattern: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select movement pattern" />
                </SelectTrigger>
                <SelectContent>
                  {MOVEMENT_PATTERNS.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_compound}
                onChange={(e) => setForm((f) => ({ ...f, is_compound: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm">Compound movement</span>
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              onClick={handleEdit}
              disabled={!form.name.trim() || !form.muscle_group || isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{exercise.name}&quot;? Any workout history
              referencing this exercise will be updated to show &quot;Deleted Exercise&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
