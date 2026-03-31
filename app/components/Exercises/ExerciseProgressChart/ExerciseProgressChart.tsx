"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface DataPoint {
  date: string;
  weight: number;
}

interface Props {
  data: DataPoint[];
  units: string;
}

export default function ExerciseProgressChart({ data, units }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b bg-muted/40 px-6 py-5">
        <p className="text-base font-semibold">Progression</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Best set weight per session ({units})</p>
      </div>
      <div className="px-2 py-4">
        <ChartContainer config={chartConfig}>
          <AreaChart data={data} accessibilityLayer margin={{ left: 0, right: 8 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={36}
              tick={{ fontSize: 11 }}
              domain={["auto", "auto"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="weight"
              type="monotone"
              fill="url(#weightGradient)"
              stroke="var(--color-weight)"
              strokeWidth={2}
              dot={{ fill: "var(--color-weight)", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
