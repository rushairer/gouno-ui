import * as React from "react";
import { cn } from "../lib/utils";

export type SpinnerProps = React.HTMLAttributes<HTMLSpanElement>;
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> { value?: number; max?: number; }
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> { ratio?: number; }
export type KbdProps = React.HTMLAttributes<HTMLElement>;
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> { as?: React.ElementType; }

export function Spinner({ className, "aria-label": ariaLabel, ...props }: SpinnerProps) { return <span role="status" aria-label={ariaLabel ?? "Loading"} {...props} data-slot="spinner" className={cn("inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent", className)} />; }
export function Progress({ value = 0, max = 100, className, ...props }: ProgressProps) {
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const normalizedValue = Number.isFinite(value) ? Math.min(normalizedMax, Math.max(0, value)) : 0;
  const percent = (normalizedValue / normalizedMax) * 100;
  return <div role="progressbar" aria-valuenow={normalizedValue} aria-valuemin={0} aria-valuemax={normalizedMax} {...props} data-slot="progress" className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}><div data-slot="progress-indicator" className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} /></div>;
}
export function AspectRatio({ ratio = 16 / 9, className, children, style, ...props }: AspectRatioProps) { const resolvedRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9; return <div {...props} data-slot="aspect-ratio" className={cn("relative w-full", className)} style={{ ...style, aspectRatio: resolvedRatio }}>{children}</div>; }
export function Kbd({ className, ...props }: KbdProps) { return <kbd {...props} data-slot="kbd" className={cn("rounded border bg-muted px-1.5 py-0.5 font-mono text-xs", className)} />; }
export function Typography({ as: Component = "p", className, ...props }: TypographyProps) { return React.createElement(Component, { ...props, "data-slot": "typography", className: cn("text-sm text-foreground", className) }); }
