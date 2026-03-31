"use client";

import { useEffect, useState } from "react";
import { ActiveExerciseBlock } from "@/types";

interface Draft {
  blocks: ActiveExerciseBlock[];
  workoutName: string;
  startedAt: number | null;
}

function draftKey(userId?: string) {
  return userId ? `workout_draft_${userId}` : "workout_draft";
}

function loadDraft(userId?: string): Draft | null {
  try {
    const saved = localStorage.getItem(draftKey(userId));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function isWorkoutInProgress(userId?: string): boolean {
  return !!loadDraft(userId)?.startedAt;
}

export function markWorkoutStarted(
  userId?: string,
  initialBlocks?: ActiveExerciseBlock[],
  initialName?: string,
): void {
  try {
    const key = draftKey(userId);
    const existing = loadDraft(userId) ?? { blocks: [], workoutName: "", startedAt: null };
    localStorage.setItem(
      key,
      JSON.stringify({
        blocks: initialBlocks ?? existing.blocks,
        workoutName: initialName ?? existing.workoutName,
        startedAt: Date.now(),
      }),
    );
  } catch {}
}

export function useWorkoutDraft(
  enabled: boolean,
  initialBlocks: ActiveExerciseBlock[] = [],
  initialName: string = "",
  userId?: string,
) {
  const [blocks, setBlocks] = useState<ActiveExerciseBlock[]>(
    () => (enabled ? loadDraft(userId)?.blocks ?? initialBlocks : initialBlocks),
  );
  const [workoutName, setWorkoutName] = useState<string>(
    () => (enabled ? loadDraft(userId)?.workoutName ?? initialName : initialName),
  );
  const [startedAt, setStartedAt] = useState<number | null>(
    () => (enabled ? loadDraft(userId)?.startedAt ?? null : null),
  );

  useEffect(() => {
    if (!enabled) return;
    localStorage.setItem(
      draftKey(userId),
      JSON.stringify({ blocks, workoutName, startedAt }),
    );
  }, [blocks, workoutName, startedAt, enabled, userId]);

  function clearDraft() {
    localStorage.removeItem(draftKey(userId));
  }

  return { blocks, setBlocks, workoutName, setWorkoutName, startedAt, setStartedAt, clearDraft };
}
