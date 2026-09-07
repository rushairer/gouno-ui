import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export function Progress({ value = 0, max = 100, className, ...props }: ProgressProps) {
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const normalizedValue = Number.isFinite(value) ? Math.min(normalizedMax, Math.max(0, value)) : 0;
  const percent = (normalizedValue / normalizedMax) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={normalizedMax}
      {...props}
      data-slot="progress"
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div data-slot="progress-indicator" className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}
