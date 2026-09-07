import type { ReactNode } from "react";
import { Button } from "../core/button";
import { cn } from "../lib/utils";

export interface BulkActionBarProps {
  selectionLabel: ReactNode;
  onCancel: () => void;
  children?: ReactNode;
  cancelLabel?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function BulkActionBar({
  selectionLabel,
  onCancel,
  children,
  cancelLabel = "取消",
  ariaLabel = "批量操作",
  className,
}: BulkActionBarProps) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={cn(
        "sticky bottom-4 flex flex-wrap items-center gap-3 rounded-lg border border-primary/40 bg-popover p-3 shadow-lg",
        className,
      )}
    >
      <strong className="mr-auto text-sm">{selectionLabel}</strong>
      {children}
      <Button variant="ghost" size="small" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
