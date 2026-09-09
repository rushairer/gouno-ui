import { Segmented } from "../../../../src/core";

export default function SegmentedLayoutDemo() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="min-w-0">
        <Segmented
          aria-label="整行导航"
          block
          options={["概览", "安全", "会话"]}
        />
      </div>
      <div>
        <Segmented
          aria-label="垂直导航"
          orientation="vertical"
          options={["概览", "安全", "会话"]}
        />
      </div>
    </div>
  );
}
