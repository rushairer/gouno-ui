import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../core/button";
import { Text } from "../core/typography";
import { cn } from "../lib/utils";

export interface BulkActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "role"> {
  selectionLabel: ReactNode;
  onCancel: () => void;
  cancelLabel?: ReactNode;
  children?: ReactNode;
}

export function BulkActionBar({
  selectionLabel,
  onCancel,
  cancelLabel = "取消",
  children,
  className,
  "aria-label": ariaLabel = "批量操作",
  ...props
}: BulkActionBarProps) {
  return (
    <div
      {...props}
      role="toolbar"
      aria-label={ariaLabel}
      data-slot="bulk-action-bar"
      className={cn(
        "sticky bottom-4 z-20 flex flex-col gap-3 rounded-lg border border-primary/30 bg-popover/95 p-4 shadow-overlay backdrop-blur sm:flex-row sm:items-center",
        className,
      )}
    >
      <Text size="sm" className="font-medium sm:mr-auto">
        {selectionLabel}
      </Text>
      <div className="flex flex-wrap items-center gap-2" data-slot="bulk-action-bar-actions">
        {children}
        <Button size="small" variant="text" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}