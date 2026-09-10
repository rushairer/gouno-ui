import { Calendar } from "../../../../src/core";

export default function CalendarYearExample() {
  return (
    <div className="max-w-2xl">
      <Calendar
        defaultValue={new Date(2026, 8, 10)}
        defaultMode="year"
        fullscreen={false}
        validRange={[new Date(2026, 2, 1), new Date(2026, 10, 30)]}
        onSelect={(date, { source }) => {
          console.info("calendar select", source, date.toISOString());
        }}
      />
    </div>
  );
}
