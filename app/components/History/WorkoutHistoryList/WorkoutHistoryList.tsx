import { getCurrentMonth, getWorkoutHistory, isValidMonth } from "@/lib/workouts/workouts";
import { getAllExercises } from "@/lib/exercises/exercises";
import { getUserProfile } from "@/lib/users/users";
import { WeightUnit } from "@/lib/utils/units";
import HistoryCard from "@/app/components/History/HistoryCard/HistoryCard";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import Link from "next/link";
import WorkoutCalendar from "@/app/components/History/WorkoutCalendar/WorkoutCalendar";
import { Button } from "@/components/ui/button";

function parseMonth(value?: string) {
  if (value && isValidMonth(value)) return value;
  return getCurrentMonth();
}

function shiftMonth(month: string, delta: number) {
  const [yearPart, monthPart] = month.split("-");
  const date = new Date(Date.UTC(Number(yearPart), Number(monthPart) - 1 + delta, 1));
  const year = date.getUTCFullYear();
  const monthValue = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${monthValue}`;
}

function formatMonthLabel(month: string) {
  const [yearPart, monthPart] = month.split("-");
  const date = new Date(Date.UTC(Number(yearPart), Number(monthPart) - 1, 1));
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export default async function WorkoutHistoryList({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month: monthParam } = await searchParams;
  const month = parseMonth(monthParam);
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const monthLabel = formatMonthLabel(month);

  const [{ data: history }, exercises, profile] = await Promise.all([getWorkoutHistory(month), getAllExercises(), getUserProfile()]);

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  const hasWorkouts = history.length > 0;

  if (history.length === 0) {
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href={`/history?month=${previousMonth}`}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          </Button>
          <p className="text-sm font-medium text-muted-foreground">{monthLabel}</p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/history?month=${nextMonth}`}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <WorkoutCalendar workouts={history} month={month} preferredUnits={preferredUnits} />

        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Dumbbell className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No workouts in {monthLabel}</p>
            <p className="mt-1 text-sm text-muted-foreground">Record a workout in this month or move to another month.</p>
          </div>
          <Link
            href="/workout"
            className="mt-1 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Record a Workout
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={`/history?month=${previousMonth}`}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
        <p className="text-sm font-medium text-muted-foreground">{monthLabel}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/history?month=${nextMonth}`}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <WorkoutCalendar workouts={history} month={month} preferredUnits={preferredUnits} />

      <div className="flex flex-col gap-4">
        {history.map((workout) => (
          <HistoryCard key={workout.id} workout={workout} exercises={exercises} preferredUnits={preferredUnits} />
        ))}
      </div>

      {hasWorkouts && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Showing {history.length} workout{history.length === 1 ? "" : "s"} in {monthLabel}
        </p>
      )}
    </>
  );
}
