"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import ExerciseActions from "@/app/components/Exercises/ExerciseActions/ExerciseActions";
import { Exercise } from "@/types/excercises";

interface Props {
  exercises: Exercise[];
  userId?: string;
}

export default function ExerciseList({ exercises, userId }: Props) {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const muscleGroups = Array.from(
    new Set(exercises.map((e) => e.muscle_group).filter(Boolean))
  ).sort() as string[];

  const filtered = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = activeGroup ? e.muscle_group === activeGroup : true;
    return matchesSearch && matchesGroup;
  });

  const grouped = filtered.reduce(
    (acc, ex) => {
      const group = ex.muscle_group ?? "Other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(ex);
      return acc;
    },
    {} as Record<string, Exercise[]>,
  );

  const sortedGroups = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveGroup(null)}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            activeGroup === null
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        {muscleGroups.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(activeGroup === group ? null : group)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
              activeGroup === group
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {sortedGroups.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No exercises found</p>
      )}

      <div className="flex flex-col gap-6">
        {sortedGroups.map((group) => (
          <div key={group}>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground capitalize">
              {group}
            </h2>
            <div className="flex flex-col overflow-hidden rounded-xl border">
              {grouped[group].map((ex, i) => (
                <div
                  key={ex.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== grouped[group].length - 1 ? "border-b" : ""
                  }`}
                >
                  <Link href={`/exercises/${ex.id}`} className="flex-1">
                    <p className="text-sm font-medium">{ex.name}</p>
                    {ex.equipment && (
                      <p className="text-xs text-muted-foreground capitalize">{ex.equipment}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-2">
                    {ex.is_compound && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Compound
                      </span>
                    )}
                    {ex.is_custom && ex.created_by === userId && (
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
  );
}
