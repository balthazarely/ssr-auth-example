import { getWorkoutHistory } from "@/lib/workouts/workouts";
import { getAllExercises } from "@/lib/exercises/exercises";
import { getUserProfile } from "@/lib/users/users";
import { WeightUnit } from "@/lib/units";
import HistoryCard from "@/app/components/History/HistoryCard/HistoryCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function WorkoutHistoryList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));

  const [{ data: history, totalPages }, exercises, profile] = await Promise.all(
    [getWorkoutHistory(page), getAllExercises(), getUserProfile()],
  );

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Dumbbell className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold">No workouts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start your first workout to see your history here.
          </p>
        </div>
        <Link
          href="/workout"
          className="mt-1 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Record a Workout
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {history.map((workout) => (
          <HistoryCard
            key={workout.id}
            workout={workout}
            exercises={exercises}
            preferredUnits={preferredUnits}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/history?page=${page - 1}`}
                aria-disabled={page === 0}
                className={page === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={`/history?page=${page + 1}`}
                aria-disabled={page >= totalPages - 1}
                className={
                  page >= totalPages - 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
