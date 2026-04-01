"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveExerciseSets } from "@/types";
import { WeightUnit } from "@/lib/utils/units";

interface Props {
  sets: ActiveExerciseSets[];
  excerciseName: string;
  workoutId: string | undefined;
  preferredUnits: WeightUnit;
  onChangeSet: (index: number, field: keyof ActiveExerciseSets, value: string | boolean) => void;
  onAddSet: () => void;
  onDeleteSet: (index: number) => void;
  onRemove: () => void;
}

export default function Exercise({ sets, excerciseName, workoutId, preferredUnits, onChangeSet, onAddSet, onDeleteSet, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{excerciseName || "Unnamed Exercise"}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
              ⋮
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
              Remove exercise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-[2rem_1fr_1fr_2rem_2rem] items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
        <span>Set</span>
        <span>Weight ({preferredUnits})</span>
        <span>Reps</span>
        {!workoutId && <span>Done</span>}
        <span />
      </div>

      {sets.map((set, index) => (
        <div
          key={index}
          className={`grid grid-cols-[2rem_1fr_1fr_2rem_2rem] items-center gap-2 rounded-lg px-1 py-0.5 transition-colors ${set.isCompleted ? "bg-green-500/10" : ""}`}
        >
          <span className="text-center text-sm font-medium text-muted-foreground">{index + 1}</span>
          <Input
            type="number"
            value={set.weight}
            onChange={(e) => onChangeSet(index, "weight", e.target.value)}
            className="h-9 text-center"
          />
          <Input type="number" value={set.reps} onChange={(e) => onChangeSet(index, "reps", e.target.value)} className="h-9 text-center" />
          {!workoutId && (
            <input
              type="checkbox"
              checked={set.isCompleted}
              onChange={(e) => onChangeSet(index, "isCompleted", e.target.checked)}
              className="mx-auto h-4 w-4 cursor-pointer accent-primary"
            />
          )}
          <button onClick={() => onDeleteSet(index)} className="text-xs text-muted-foreground hover:text-destructive">
            ✕
          </button>
        </div>
      ))}

      <Button variant="secondary" size="sm" onClick={onAddSet} className="mt-1">
        Add Set
      </Button>
    </div>
  );
}
