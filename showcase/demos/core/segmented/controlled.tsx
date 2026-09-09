import { useState } from "react";
import { Columns3, List, Rows3 } from "lucide-react";
import { Segmented, Text } from "../../../../src/core";

type ViewMode = "list" | "compact" | "board";

const viewOptions = [
  { value: "list", label: "列表", icon: <List /> },
  { value: "compact", label: "紧凑", icon: <Rows3 /> },
  { value: "board", label: "看板", icon: <Columns3 /> },
] as const;

export default function ControlledSegmentedDemo() {
  const [value, setValue] = useState<ViewMode>("list");

  return (
    <div className="flex flex-col gap-3">
      <Segmented<ViewMode>
        aria-label="视图模式"
        options={viewOptions}
        value={value}
        onChange={setValue}
      />
      <Text size="sm" tone="muted">
        当前值：{value}
      </Text>
    </div>
  );
}
