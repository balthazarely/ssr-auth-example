"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import NewWorkout from "@/app/components/Workout/NewWorkout/NewWorkout";
import AiWorkoutModal from "@/app/components/Workout/AiWorkoutModal/AiWorkoutModal";
import { isWorkoutInProgress, markWorkoutStarted } from "@/hooks/useWorkoutDraft";
import { Exercise } from "@/types/excercises";
import { WeightUnit } from "@/lib/utils/units";
import { ActiveExerciseBlock } from "@/types";
import { Sparkles } from "lucide-react";

interface Props {
  exercises: Exercise[];
  userId?: string;
  preferredUnits?: WeightUnit;
}

export default function WorkoutStarter({ exercises, userId, preferredUnits = "lbs" }: Props) {
  const [started, setStarted] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiBlocks, setAiBlocks] = useState<ActiveExerciseBlock[] | undefined>(undefined);
  const [aiName, setAiName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isWorkoutInProgress(userId)) {
      setStarted(true);
    }
  }, [userId]);

  const handleStart = () => {
    markWorkoutStarted(userId);
    setStarted(true);
  };

  const handleAiGenerated = (name: string, blocks: ActiveExerciseBlock[]) => {
    setAiName(name);
    setAiBlocks(blocks);
    markWorkoutStarted(userId, blocks, name);
    setStarted(true);
  };

  const handleCancel = () => {
    setStarted(false);
    setAiBlocks(undefined);
    setAiName(undefined);
  };

  if (!started) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <h2 className="text-xl font-semibold">Ready to train?</h2>
          <p className="text-sm text-muted-foreground">Start a new workout session to log your exercises and sets.</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <Button size="lg" onClick={handleStart}>
              Start Empty Workout
            </Button>
            <Button size="lg" variant="outline" onClick={() => setAiModalOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Workout with AI
            </Button>
          </div>
        </div>

        <AiWorkoutModal
          open={aiModalOpen}
          onOpenChange={setAiModalOpen}
          exercises={exercises}
          preferredUnits={preferredUnits}
          onGenerated={handleAiGenerated}
        />
      </>
    );
  }

  return (
    <NewWorkout
      exercises={exercises}
      userId={userId}
      preferredUnits={preferredUnits}
      initialBlocks={aiBlocks}
      initialName={aiName}
      onCancel={handleCancel}
    />
  );
}
