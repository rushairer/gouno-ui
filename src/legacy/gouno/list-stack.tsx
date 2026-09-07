import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import { ActionGroup } from "./page";

export type ListStackProps = HTMLAttributes<HTMLDivElement>;
export function ListStack({ className, ...props }: ListStackProps) {
  return <div {...props} className={cn("divide-y divide-border", className)} />;
}

export interface ListRowProps {
  icon?: ReactNode;
  title?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function ListRow({ icon, title, meta, action, children, className }: ListRowProps) {
  return (
    <div className={cn("flex flex-wrap items-start gap-3 py-4", className)}>
      {icon ? <span aria-hidden="true" className="text-muted-foreground">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        {children || (
          <>
            <div className="break-words font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">{meta}</div>
          </>
        )}
      </div>
      {action ? <ActionGroup>{action}</ActionGroup> : null}
    </div>
  );
}
