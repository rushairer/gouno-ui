import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface StatisticProps {
  title: ReactNode;
  value: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
}

export function Statistic({ title, value, prefix, suffix, className }: StatisticProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{prefix}{value}{suffix}</div>
    </div>
  );
}
