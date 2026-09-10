import { Card, Skeleton } from "../../../../src/core";

export default function SkeletonExample() {
  return (
    <div
      role="status"
      aria-label="文章列表加载中"
      className="grid gap-4 sm:grid-cols-2"
    >
      {Array.from({ length: 2 }, (_, index) => (
        <Card key={index} padding="base">
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}
