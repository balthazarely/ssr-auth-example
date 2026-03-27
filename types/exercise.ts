export interface ActiveExerciseBlock {
  exerciseId: string;
  excerciseName: string;
  sets: ActiveExerciseSets[];
}

export interface ActiveExerciseSets {
  weight: number;
  reps: number;
  isCompleted: boolean;
}
