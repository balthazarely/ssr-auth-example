import { getWorkoutsPerWeek } from "@/lib/workouts/stats";
import WorkoutWeekChart from "./WorkoutWeekChart";

export default async function WorkoutWeekChartLoader() {
  const data = await getWorkoutsPerWeek();
  return <WorkoutWeekChart data={data} />;
}
