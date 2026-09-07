import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode;
}

export interface TimelineProps {
  items: readonly TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("space-y-4 border-l pl-4", className)}>
      {items.map((item, index) => (
        <li key={index} className="relative">
          <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-primary" />
          <div className="font-medium">{item.title}</div>
          {item.description ? <div className="text-sm text-muted-foreground">{item.description}</div> : null}
        </li>
      ))}
    </ol>
  );
}
