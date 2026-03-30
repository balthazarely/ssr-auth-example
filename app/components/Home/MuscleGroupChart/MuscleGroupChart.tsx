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
import { MuscleGroupStat } from "@/lib/workouts/stats";

const chartConfig = {
  sets: {
    label: "Sets",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface Props {
  data: MuscleGroupStat[];
}

export default function MuscleGroupChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Muscle Groups</CardTitle>
          <CardDescription>Sets logged this week</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">No workout data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Muscle Groups</CardTitle>
        <CardDescription>Sets logged this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} layout="vertical" accessibilityLayer>
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              type="category"
              dataKey="muscle_group"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={72}
              tick={{ className: "capitalize" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="sets" fill="var(--color-sets)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
