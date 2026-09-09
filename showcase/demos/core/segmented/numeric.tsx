import { Segmented } from "../../../../src/core";

export default function NumericSegmentedDemo() {
  return (
    <Segmented
      aria-label="每页数量"
      name="page-size"
      options={[10, 20, 50]}
      defaultValue={20}
    />
  );
}
