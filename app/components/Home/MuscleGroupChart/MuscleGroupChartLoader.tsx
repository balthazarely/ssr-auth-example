import { getMuscleGroupStats } from "@/lib/workouts/stats";
import MuscleGroupChart from "./MuscleGroupChart";

export default async function MuscleGroupChartLoader() {
  const data = await getMuscleGroupStats();
  return <MuscleGroupChart data={data} />;
}
