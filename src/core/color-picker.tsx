import type { InputHTMLAttributes } from "react";

export type ColorPickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function ColorPicker(props: ColorPickerProps) {
  return <input {...props} type="color" />;
}
