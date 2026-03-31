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

function FilterChips({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-3 scrollbar-none">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          active === null
            ? "border-primary bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent"
        }`}
      >
        All
      </button>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(active === option ? null : option)}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
            active === option
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function AddExerciseDialog({ open, onOpenChange, exercises, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Exercise[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null);

  const muscleGroups = Array.from(
    new Set(exercises.map((e) => e.muscle_group).filter(Boolean))
  ).sort() as string[];

  const equipmentTypes = Array.from(
    new Set(exercises.map((e) => e.equipment).filter(Boolean))
  ).sort() as string[];

  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = activeGroup ? e.muscle_group === activeGroup : true;
    const matchesEquipment = activeEquipment ? e.equipment === activeEquipment : true;
    return matchesSearch && matchesGroup && matchesEquipment;
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
      setActiveEquipment(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-w-md flex-col gap-4 top-4 translate-y-0 sm:top-[50%] sm:translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterChips options={muscleGroups} active={activeGroup} onChange={setActiveGroup} />
        <FilterChips options={equipmentTypes} active={activeEquipment} onChange={setActiveEquipment} />
        <div className="max-h-[30vh] overflow-y-auto rounded-lg border sm:max-h-[50vh]">
          {filteredExercises.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No exercises found</p>
          )}
          {filteredExercises.map((exercise, i) => {
            const isSelected = selected.some((e) => e.id === exercise.id);
            return (
              <button
                key={exercise.id}
                onClick={() => toggleExercise(exercise)}
                className={`flex w-full cursor-pointer flex-col items-start p-3 text-left transition-colors hover:bg-accent ${
                  i !== filteredExercises.length - 1 ? "border-b" : ""
                } ${isSelected ? "bg-accent" : ""}`}
              >
                <span className="font-medium">{exercise.name}</span>
                <span className="text-xs capitalize text-muted-foreground">
                  {[exercise.muscle_group, exercise.equipment].filter(Boolean).join(" · ")}
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
