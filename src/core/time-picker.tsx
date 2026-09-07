import type { InputHTMLAttributes } from "react";

export type TimePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function TimePicker(props: TimePickerProps) {
  return <input {...props} type="time" />;
}
