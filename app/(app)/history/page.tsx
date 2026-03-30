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
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(0, Number(page ?? 0));

  const [{ data: history, totalPages }, exercises, profile] = await Promise.all([
    getWorkoutHistory(currentPage),
    getAllExercises(),
    getUserProfile(),
  ]);

  const preferredUnits = (profile?.preferred_units ?? "lbs") as WeightUnit;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">History</h1>
        {history.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No workouts yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start your first workout to see your history here.
                </p>
              </div>
              <Link
                href="/workout"
                className="mt-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Record a Workout
              </Link>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-col gap-4">
          {history.map((workout) => (
            <HistoryCard key={workout.id} workout={workout} exercises={exercises} preferredUnits={preferredUnits} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/history?page=${currentPage - 1}`}
                  aria-disabled={currentPage === 0}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`/history?page=${currentPage + 1}`}
                  aria-disabled={currentPage >= totalPages - 1}
                  className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
