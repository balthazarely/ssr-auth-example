"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import NewWorkout from "@/app/components/Workout/NewWorkout/NewWorkout";
import { isWorkoutInProgress, markWorkoutStarted } from "@/hooks/useWorkoutDraft";
import { Exercise } from "@/types/excercises";

interface Props {
  exercises: Exercise[];
  userId?: string;
}

export default function WorkoutStarter({ exercises, userId }: Props) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isWorkoutInProgress(userId)) {
      setStarted(true);
    }
  }, [userId]);

  const handleStart = () => {
    markWorkoutStarted(userId);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Ready to train?</h2>
        <p className="text-sm text-muted-foreground">
          Start a new workout session to log your exercises and sets.
        </p>
        <Button size="lg" onClick={handleStart}>
          Start Workout
        </Button>
      </div>
    );
  }

  return <NewWorkout exercises={exercises} userId={userId} />;
}
