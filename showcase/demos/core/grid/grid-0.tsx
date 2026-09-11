import { Card, Grid } from "../../../../src/core";

export default function GridDemo() {
  return (
    <Grid columns={3} gap="md">
      {[1, 2, 3].map((item) => <Card key={item} padding="sm">Card {item}</Card>)}
    </Grid>
  );
}
