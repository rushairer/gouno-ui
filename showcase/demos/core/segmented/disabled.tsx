import { Segmented } from "../../../../src/core";

export default function DisabledSegmentedDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Segmented
        aria-label="发布渠道"
        options={[
          { value: "web", label: "Web" },
          { value: "app", label: "App" },
          { value: "legacy", label: "Legacy", disabled: true },
        ]}
      />
      <Segmented aria-label="禁用示例" options={["A", "B"]} disabled />
    </div>
  );
}
