import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-24" />
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end gap-2">
          {[40, 65, 30, 80, 55, 70, 35, 60].map((h, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
