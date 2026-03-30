import { getWorkoutHistory } from "@/lib/workouts/workouts";
import { getAllExercises } from "@/lib/exercises/exercises";
import HistoryCard from "@/app/components/History/HistoryCard/HistoryCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(0, Number(page ?? 0));

  const [{ data: history, totalPages }, exercises] = await Promise.all([
    getWorkoutHistory(currentPage),
    getAllExercises(),
  ]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">History</h1>
        {history.length === 0 && (
          <p className="text-sm text-muted-foreground">No workouts yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {history.map((workout) => (
            <HistoryCard key={workout.id} workout={workout} exercises={exercises} />
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
