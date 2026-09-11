import { useState } from "react";
import { DateRangePicker } from "../../../../src/core";

export default function DateRangePickerDemo() {
  const [range, setRange] = useState<{ start?: string; end?: string }>({
    start: "2026-09-01",
    end: "2026-09-06",
  });

  return (
    <div className="grid max-w-lg gap-3">
      <DateRangePicker
        start={range.start}
        end={range.end}
        onChange={setRange}
        startInputProps={{ "aria-label": "开始日期", name: "startDate" }}
        endInputProps={{ "aria-label": "结束日期", name: "endDate" }}
      />
      <DateRangePicker
        start="2026-09-10"
        end="2026-09-20"
        size="large"
        status="warning"
        startInputProps={{ "aria-label": "计划开始", min: "2026-09-01" }}
        endInputProps={{ "aria-label": "计划结束", max: "2026-09-30" }}
        onChange={() => undefined}
      />
    </div>
  );
}
