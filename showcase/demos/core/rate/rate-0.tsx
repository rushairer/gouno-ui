import { useState } from "react";
import { Rate } from "../../../../src/core";

export default function RateDemo() {
  const [value, setValue] = useState(3);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Rate aria-label="满意度" value={value} onChange={setValue} />
        <span className="text-sm text-muted-foreground">当前：{value || "未评分"}</span>
      </div>
      <Rate aria-label="只读评分示例" defaultValue={4} disabled />
    </div>
  );
}
