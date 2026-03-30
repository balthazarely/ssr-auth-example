"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { WorkoutWeekStat } from "@/lib/workouts/stats";

const chartConfig = {
  workouts: {
    label: "Workouts",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Props {
  data: WorkoutWeekStat[];
}

export default function WorkoutWeekChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workouts per Week</CardTitle>
        <CardDescription>Last 8 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={24}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="workouts" fill="var(--color-workouts)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
