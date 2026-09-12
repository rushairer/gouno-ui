import { useComponentLocale } from "./config-provider";
import type { DatePickerLocale } from "./locale";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange"> {
  locale?: Partial<DatePickerLocale>;
  value?: string; defaultValue?: string; size?: ControlSize; status?: "error" | "warning"; allowClear?: boolean;
  onChange?: (value: string, date: Date | null) => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({ locale, value, defaultValue = "", size = "middle", status, allowClear = true, onChange, className, disabled, readOnly, ...props }, ref) {
  const text = useComponentLocale("datePicker", locale);
  const [inner, setInner] = useState(defaultValue);
  const current = value === undefined ? inner : value;
  const update = (next: string) => { if (value === undefined) setInner(next); onChange?.(next, next ? new Date(`${next}T00:00:00`) : null); };
  return <span data-slot="date-picker" data-status={status} className={cn("relative inline-flex w-full min-w-0 items-center rounded-md border border-border bg-input focus-within:ring-2 focus-within:ring-ring", status === "error" && "border-destructive", status === "warning" && "border-warning", disabled && "opacity-50", className)}>
    <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
    <input {...props} ref={ref} type="date" value={current} disabled={disabled} readOnly={readOnly} aria-invalid={status === "error" || props["aria-invalid"] || undefined} className={cn("w-full min-w-0 appearance-none border-0 bg-transparent pl-9 outline-none", controlSizeClass(size), allowClear && current && !disabled && !readOnly ? "pr-9" : "pr-3")} onChange={(event) => update(event.target.value)} />
    {allowClear && current && !disabled && !readOnly ? <button type="button" aria-label={text.clearLabel} className="absolute right-2 flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => update("")}><X className="size-3.5" /></button> : null}
  </span>;
});
