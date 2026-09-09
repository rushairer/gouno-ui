import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

type EmptyRuntimeProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
};

export function Empty({
  title,
  description,
  action,
  icon,
  className,
  ...props
}: EmptyRuntimeProps) {
  return (
    <div
      {...props}
      data-slot="empty"
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-2 py-8 text-center",
        className,
      )}
    >
      {icon ? <div data-slot="empty-icon">{icon}</div> : null}
      {title != null ? (
        <div data-slot="empty-title" className="font-semibold text-foreground">
          {title}
        </div>
      ) : null}
      {description != null ? (
        <div
          data-slot="empty-description"
          className="max-w-lg text-sm text-muted-foreground"
        >
          {description}
        </div>
      ) : null}
      {action != null ? (
        <div data-slot="empty-action" className="pt-1">
          {action}
        </div>
      ) : null}
    </div>
  );
}
