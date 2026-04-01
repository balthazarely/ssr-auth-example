"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WeightUnit, toDisplayWeight } from "@/lib/utils/units";
import { cn } from "@/lib/utils/utils";

type WorkoutSet = {
  id: string;
  weight: number;
  reps: number;
  is_completed: boolean;
  order_index: number;
};

type WorkoutExercise = {
  id: string;
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  workout_sets: WorkoutSet[];
};

type WorkoutHistoryItem = {
  id: string;
  name: string;
  started_at: string | null;
  completed_at: string;
  workout_exercises: WorkoutExercise[];
};

interface Props {
  workouts: WorkoutHistoryItem[];
  month: string;
  preferredUnits: WeightUnit;
}

function monthParts(month: string) {
  const [yearPart, monthPart] = month.split("-");
  return { year: Number(yearPart), monthIndex: Number(monthPart) - 1 };
}

export default function WorkoutCalendar({ workouts, month, preferredUnits }: Props) {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutHistoryItem | null>(null);

  const { year, monthIndex } = monthParts(month);

  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const leadingBlanks = firstDay.getUTCDay();

  const workoutsByDay = useMemo(() => {
    const buckets = new Map<number, WorkoutHistoryItem[]>();
    for (const workout of workouts) {
      const day = new Date(workout.completed_at).getUTCDate();
      const existing = buckets.get(day) ?? [];
      existing.push(workout);
      buckets.set(day, existing);
    }
    for (const [, dayWorkouts] of buckets) {
      dayWorkouts.sort((a, b) => (a.completed_at < b.completed_at ? 1 : -1));
    }
    return buckets;
  }, [workouts]);

  const dayCells = Array.from({ length: leadingBlanks + daysInMonth }, (_, index) => {
    const day = index - leadingBlanks + 1;
    if (day < 1) return null;
    return day;
  });

  const activeDayWorkouts = activeDay ? (workoutsByDay.get(activeDay) ?? []) : [];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid grid-cols-7 border-b bg-muted/40 px-3 py-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
            <p key={weekday} className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {weekday}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 p-2">
          {dayCells.map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className="h-16 rounded-md" />;
            }

            const dayWorkouts = workoutsByDay.get(day) ?? [];
            const isActive = activeDay === day;

            return (
              <button
                key={day}
                type="button"
                className={cn(
                  "flex h-16 flex-col items-center justify-center rounded-md border border-transparent bg-background/40 text-sm transition-colors",
                  dayWorkouts.length > 0 && "bg-primary/5 hover:border-primary/30 hover:bg-primary/10",
                  dayWorkouts.length === 0 && "cursor-default opacity-60",
                  isActive && "border-primary/50 bg-primary/10",
                )}
                disabled={dayWorkouts.length === 0}
                onClick={() => setActiveDay(day)}
              >
                <span className="font-medium">{day}</span>
                {dayWorkouts.length > 0 && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {dayWorkouts.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={activeDay !== null} onOpenChange={(open) => !open && setActiveDay(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {activeDayWorkouts.length} workout{activeDayWorkouts.length === 1 ? "" : "s"} on {month}-
              {String(activeDay ?? 0).padStart(2, "0")}
            </DialogTitle>
            <DialogDescription>Select a workout to view complete exercise and set details.</DialogDescription>
          </DialogHeader>

          {activeDayWorkouts.length > 0 && (
            <div className="flex flex-col gap-2">
              {activeDayWorkouts.map((workout) => (
                <Button key={workout.id} variant="outline" className="justify-between" onClick={() => setSelectedWorkout(workout)}>
                  <span className="truncate">{workout.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(workout.completed_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={selectedWorkout !== null} onOpenChange={(open) => !open && setSelectedWorkout(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedWorkout.name}</DialogTitle>
                <DialogDescription>Workout details for this completed session.</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <p>
                  {new Date(selectedWorkout.completed_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {selectedWorkout.workout_exercises.map((exercise) => (
                  <div key={exercise.id} className="rounded-lg border border-border/60 bg-muted/40 p-3">
                    <p className="text-sm font-semibold">{exercise.exercise_name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {exercise.workout_sets.map((set) => (
                        <span
                          key={set.id}
                          className="inline-flex items-center rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-foreground/70 ring-1 ring-border"
                        >
                          {toDisplayWeight(set.weight, preferredUnits)}
                          {preferredUnits} x {set.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
