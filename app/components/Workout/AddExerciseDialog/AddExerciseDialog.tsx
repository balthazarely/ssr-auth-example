"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/types/excercises";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: Exercise[];
  onSelect: (exercises: Exercise[]) => void;
}

export default function AddExerciseDialog({ open, onOpenChange, exercises, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Exercise[]>([]);

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExercise = (exercise: Exercise) => {
    setSelected((prev) =>
      prev.some((e) => e.id === exercise.id)
        ? prev.filter((e) => e.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onSelect(selected);
    setSearch("");
    setSelected([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearch("");
      setSelected([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md top-16 translate-y-0">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
          {filteredExercises.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No exercises found</p>
          )}
          {filteredExercises.map((exercise) => {
            const isSelected = selected.some((e) => e.id === exercise.id);
            return (
              <button
                key={exercise.id}
                onClick={() => toggleExercise(exercise)}
                className={`flex cursor-pointer flex-col items-start rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                  isSelected ? "border-primary bg-accent" : ""
                }`}
              >
                <span className="font-medium">{exercise.name}</span>
                <span className="text-sm capitalize text-muted-foreground">
                  {exercise.muscle_group}
                </span>
              </button>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={selected.length === 0} className="w-full">
            {selected.length > 1 ? `Add ${selected.length} Exercises` : "Add Exercise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
