import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "type"> {
  value?: number | null; defaultValue?: number | null; min?: number; max?: number; step?: number; precision?: number;
  size?: ControlSize; status?: "error" | "warning"; controls?: boolean; keyboard?: boolean;
  formatter?: (value: number | null) => string; parser?: (displayValue: string) => number | null;
  onChange?: (value: number | null) => void;
  onStep?: (value: number, info: { offset: number; type: "up" | "down" }) => void;
}

function normalize(value: number | null, min?: number, max?: number, precision?: number) {
  if (value === null || Number.isNaN(value)) return null;
  const bounded = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));
  return precision === undefined ? bounded : Number(bounded.toFixed(precision));
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber({ value, defaultValue = null, min, max, step = 1, precision, size = "middle", status, controls = true, keyboard = true, formatter, parser = (display) => display.trim() === "" ? null : Number(display), onChange, onStep, className, disabled, readOnly, ...props }, ref) {
  const [inner, setInner] = useState<number | null>(() => normalize(defaultValue, min, max, precision));
  const current = value === undefined ? inner : value;
  const commit = (next: number | null) => { const normalized = normalize(next, min, max, precision); if (value === undefined) setInner(normalized); onChange?.(normalized); return normalized; };
  const changeBy = (direction: "up" | "down") => { if (disabled || readOnly) return; const offset = direction === "up" ? step : -step; const next = commit((current ?? 0) + offset); if (next !== null) onStep?.(next, { offset, type: direction }); };
  return <span data-slot="input-number" data-status={status} className={cn("relative inline-flex w-full min-w-0 overflow-hidden rounded-md border border-border bg-input focus-within:ring-2 focus-within:ring-ring", status === "error" && "border-destructive", status === "warning" && "border-warning", disabled && "cursor-not-allowed opacity-50", className)}>
    <input {...props} ref={ref} type="text" inputMode="decimal" role="spinbutton" value={formatter ? formatter(current) : current ?? ""} disabled={disabled} readOnly={readOnly} aria-valuemin={min} aria-valuemax={max} aria-valuenow={current ?? undefined} aria-invalid={status === "error" || props["aria-invalid"] || undefined} className={cn("min-w-0 flex-1 border-0 bg-transparent px-3 outline-none", controlSizeClass(size), controls && "pr-10")} onChange={(event) => commit(parser(event.target.value))} onKeyDown={(event) => { props.onKeyDown?.(event); if (!keyboard || event.defaultPrevented) return; if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); changeBy(event.key === "ArrowUp" ? "up" : "down"); } }} />
    {controls ? <span className="absolute inset-y-0 right-0 flex w-8 flex-col border-l"><button type="button" tabIndex={-1} aria-label="Increase" disabled={disabled || readOnly || (max !== undefined && current !== null && current >= max)} className="flex min-h-0 flex-1 items-center justify-center border-b hover:bg-muted disabled:opacity-40" onClick={() => changeBy("up")}><ChevronUp className="size-3" /></button><button type="button" tabIndex={-1} aria-label="Decrease" disabled={disabled || readOnly || (min !== undefined && current !== null && current <= min)} className="flex min-h-0 flex-1 items-center justify-center hover:bg-muted disabled:opacity-40" onClick={() => changeBy("down")}><ChevronDown className="size-3" /></button></span> : null}
  </span>;
});
