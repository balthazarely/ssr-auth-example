import { getAllExercises } from "@/lib/exercises/exercises";
import { getUser } from "@/lib/supabase/server";
import AddExerciseModal from "@/app/components/Exercises/AddExerciseModal/AddExerciseModal";
import ExerciseActions from "@/app/components/Exercises/ExerciseActions/ExerciseActions";
import Link from "next/link";

export default async function ExercisesPage() {
  const [exercises, user] = await Promise.all([getAllExercises(), getUser()]);

  const grouped =
    exercises?.reduce(
      (acc, ex) => {
        const group = ex.muscle_group ?? "Other";
        if (!acc[group]) acc[group] = [];
        acc[group].push(ex);
        return acc;
      },
      {} as Record<string, typeof exercises>,
    ) ?? {};

  const sortedGroups = Object.keys(grouped).sort();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exercises</h1>
          <AddExerciseModal />
        </div>
        <div className="flex flex-col gap-6">
          {sortedGroups.map((group) => (
            <div key={group}>
              <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground capitalize">
                {group}
              </h2>
              <div className="flex flex-col overflow-hidden rounded-xl border">
                {grouped[group].map((ex: any, i: any) => (
                  <div
                    key={ex.id}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i !== grouped[group].length - 1 ? "border-b" : ""
                    }`}
                  >
                    <Link href={`/exercises/${ex.id}`} className="flex-1">
                      <p className="text-sm font-medium">{ex.name}</p>
                      {ex.equipment && (
                        <p className="text-xs text-muted-foreground capitalize">
                          {ex.equipment}
                        </p>
                      )}
                    </Link>
                    <div className="flex items-center gap-2">
                      {ex.is_compound && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Compound
                        </span>
                      )}
                      {ex.is_custom && ex.created_by === user?.id && (
                        <ExerciseActions exercise={ex} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
