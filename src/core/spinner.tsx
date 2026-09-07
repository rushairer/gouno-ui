import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement>;

export function Spinner({ className, "aria-label": ariaLabel, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel ?? "Loading"}
      {...props}
      data-slot="spinner"
      className={cn("inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent", className)}
    />
  );
}
