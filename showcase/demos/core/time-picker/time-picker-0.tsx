import { TimePicker } from "../../../../src/core";

export default function TimePickerDemo() {
  return (
    <div className="grid max-w-xs gap-3">
      <TimePicker
        aria-label="开始时间"
        defaultValue="09:30"
        min="08:00"
        max="18:00"
        step={300}
      />
      <TimePicker
        aria-label="提醒时间"
        defaultValue="18:00"
        size="large"
        status="warning"
      />
    </div>
  );
}
