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
import { Plus } from "lucide-react";
import { createExerciseAction } from "@/actions/exercises";

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

const defaultForm = {
  name: "",
  muscle_group: "",
  equipment: "",
  movement_pattern: "",
  is_compound: false,
};

export default function AddExerciseModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.muscle_group) return;
    setError(null);
    startTransition(async () => {
      try {
        await createExerciseAction({
          name: form.name.trim(),
          muscle_group: form.muscle_group,
          equipment: form.equipment || null,
          movement_pattern: form.movement_pattern || null,
          is_compound: form.is_compound,
        });
        setForm(defaultForm);
        setOpen(false);
      } catch {
        setError("Failed to create exercise. Please try again.");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Exercise
      </Button>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(defaultForm); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Incline Dumbbell Press"
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
              <Label>Equipment <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                placeholder="e.g. Barbell, Dumbbell, Cable"
                value={form.equipment}
                onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Movement Pattern <span className="text-muted-foreground">(optional)</span></Label>
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
              onClick={handleSubmit}
              disabled={!form.name.trim() || !form.muscle_group || isPending}
            >
              {isPending ? "Saving..." : "Save Exercise"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
