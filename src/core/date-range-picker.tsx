import type { InputHTMLAttributes } from "react";

export interface DateRangePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  start?: string;
  end?: string;
  onChange?: (range: { start?: string; end?: string }) => void;
}

export function DateRangePicker({ start, end, onChange, ...props }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <input {...props} type="date" value={start ?? ""} aria-label="Start date" onChange={(event) => onChange?.({ start: event.target.value, end })} />
      <span aria-hidden="true">–</span>
      <input {...props} type="date" value={end ?? ""} aria-label="End date" onChange={(event) => onChange?.({ start, end: event.target.value })} />
    </div>
  );
}
