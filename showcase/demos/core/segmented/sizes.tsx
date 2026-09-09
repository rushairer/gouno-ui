import { Segmented } from "../../../../src/core";

export default function SegmentedSizesDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Segmented
        aria-label="小尺寸"
        size="small"
        options={["日", "周", "月"]}
      />
      <Segmented
        aria-label="中尺寸"
        size="middle"
        options={["日", "周", "月"]}
      />
      <Segmented
        aria-label="大尺寸圆角"
        size="large"
        shape="round"
        options={["日", "周", "月"]}
      />
    </div>
  );
}
