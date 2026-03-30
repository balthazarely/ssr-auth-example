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
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const muscleGroups = Array.from(
    new Set(exercises.map((e) => e.muscle_group).filter(Boolean))
  ).sort() as string[];

  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = activeGroup ? e.muscle_group === activeGroup : true;
    return matchesSearch && matchesGroup;
  });

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
      setActiveGroup(null);
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
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveGroup(null)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeGroup === null
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            All
          </button>
          {muscleGroups.map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(activeGroup === group ? null : group)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                activeGroup === group
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
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
