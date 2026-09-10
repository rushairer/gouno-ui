import { useState } from "react";
import { Calendar } from "../../../../src/core";

export default function CalendarBasicExample() {
  const [value, setValue] = useState(new Date(2026, 8, 10));

  return (
    <Calendar
      value={value}
      onChange={setValue}
      showWeek
      cellRender={(date, { originNode }) => (
        <div className="relative h-full">
          {originNode}
          {[10, 18, 26].includes(date.getDate()) && date.getMonth() === 8 ? (
            <span className="pointer-events-none absolute bottom-2 left-2 size-1.5 rounded-full bg-primary" />
          ) : null}
        </div>
      )}
    />
  );
}
