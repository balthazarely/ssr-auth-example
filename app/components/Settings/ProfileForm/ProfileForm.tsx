"use client";

import { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserProfileAction } from "@/actions/users";
import { UserProfile } from "@/lib/users/users";

const UNITS = ["lbs", "kg"] as const;
const THEMES = ["light", "dark"] as const;

export default function ProfileForm({ profile }: { profile: UserProfile }) {
  const [units, setUnits] = useState(profile.preferred_units ?? "lbs");
  const [theme, setThemeState] = useState(profile.theme ?? "dark");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTheme } = useTheme();

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateUserProfileAction({ preferred_units: units, theme });
        setTheme(theme);
        setSaved(true);
      } catch {
        setError("Failed to save changes. Please try again.");
      }
    });
  };

  const isDirty =
    units !== (profile.preferred_units ?? "lbs") ||
    theme !== (profile.theme ?? "dark");

  const handleThemeChange = (v: string) => {
    setThemeState(v);
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b bg-muted/40 px-6 py-5">
        <p className="text-base font-semibold">Preferences</p>
      </div>
      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">Weight Units</Label>
          <Select value={units} onValueChange={setUnits}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">Theme</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={!isDirty || isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          {saved && !isDirty && (
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
