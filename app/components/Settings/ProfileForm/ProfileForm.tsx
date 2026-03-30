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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Weight Units</Label>
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
          <Label>Theme</Label>
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
            <p className="text-sm text-muted-foreground">Saved</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
