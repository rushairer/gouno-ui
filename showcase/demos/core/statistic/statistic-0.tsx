import { Grid, Statistic } from "../../../../src/core";

export default function StatisticExample() {
  return (
    <Grid columns={2}>
      <Statistic title="文章总数" value={86} />
      <Statistic title="增长" value={18.6} suffix="%" />
    </Grid>
  );
}
