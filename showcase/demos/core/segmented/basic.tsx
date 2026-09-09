import { Segmented } from "../../../../src/core";

export default function BasicSegmentedDemo() {
  return (
    <Segmented
      aria-label="时间范围"
      options={["日", "周", "月"]}
      defaultValue="周"
    />
  );
}
