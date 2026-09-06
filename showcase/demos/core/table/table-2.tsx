import { Empty, Grid, Skeleton } from "../../../../src/core";

export default function Example3() {
  return (
    <Grid columns={2}>
      <Skeleton className="h-32 w-full" />
      <Empty title="暂无数据" description="调整筛选条件后重试。" />
    </Grid>
  );
}
