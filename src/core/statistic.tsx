import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

export interface StatisticProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "prefix" | "title"
  > {
  /** Human-readable label for the metric. */
  title: ReactNode;
  /** Caller-owned displayed metric value. */
  value: ReactNode;
  /** Optional content rendered before the value. */
  prefix?: ReactNode;
  /** Optional content rendered after the value. */
  suffix?: ReactNode;
}

export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(
  function Statistic(
    { title, value, prefix, suffix, className, ...props },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        data-slot="statistic"
        className={cn("space-y-1", className)}
      >
        <div data-slot="statistic-title" className="text-sm text-muted-foreground">
          {title}
        </div>
        <div data-slot="statistic-value" className="text-2xl font-semibold">
          {prefix}
          {value}
          {suffix}
        </div>
      </div>
    );
  },
);
