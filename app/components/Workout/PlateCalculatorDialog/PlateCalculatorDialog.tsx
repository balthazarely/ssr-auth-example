"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { WeightUnit } from "@/lib/utils/units";

const PLATES_BY_UNIT: Record<WeightUnit, number[]> = {
  lbs: [45, 35, 25, 10, 5, 2.5],
  kg: [25, 20, 15, 10, 5, 2.5, 1.25],
};

const BAR_OPTIONS_BY_UNIT: Record<WeightUnit, number[]> = {
  lbs: [45, 35],
  kg: [20, 15],
};

interface Props {
  preferredUnits: WeightUnit;
}

export default function PlateCalculatorDialog({ preferredUnits }: Props) {
  const [open, setOpen] = useState(false);
  const [barWeight, setBarWeight] = useState<number>(BAR_OPTIONS_BY_UNIT[preferredUnits][0]);
  const [plateCounts, setPlateCounts] = useState<Record<string, number>>({});

  const plateOptions = PLATES_BY_UNIT[preferredUnits];

  const plateTotalPerSide = useMemo(
    () => plateOptions.reduce((sum, plate) => sum + plate * (plateCounts[String(plate)] ?? 0), 0),
    [plateCounts, plateOptions],
  );

  const totalWeight = barWeight + plateTotalPerSide * 2;

  const changeCount = (plate: number, delta: number) => {
    setPlateCounts((prev) => {
      const key = String(plate);
      const current = prev[key] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Calculator className="mr-2 h-4 w-4" />
        Plate Calculator
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Plate Calculator</DialogTitle>
            <DialogDescription>Choose a bar and the number of plates per side to calculate total loaded weight.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Bar Weight</Label>
              <Select value={String(barWeight)} onValueChange={(value) => setBarWeight(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAR_OPTIONS_BY_UNIT[preferredUnits].map((bar) => (
                    <SelectItem key={bar} value={String(bar)}>
                      {bar} {preferredUnits}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium">Plates Per Side</p>
              <div className="flex flex-col gap-2">
                {plateOptions.map((plate) => (
                  <div key={plate} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <Label className="text-sm font-medium">
                      {plate} {preferredUnits}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => changeCount(plate, -1)}>
                        -
                      </Button>
                      <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-muted px-2 py-1 text-sm font-semibold">
                        {plateCounts[String(plate)] ?? 0}
                      </span>
                      <Button type="button" variant="outline" size="sm" onClick={() => changeCount(plate, 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Weight</p>
              <p className="mt-1 text-3xl font-bold">
                {Number(totalWeight.toFixed(2))} {preferredUnits}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {barWeight} + ({Number(plateTotalPerSide.toFixed(2))} x 2)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
