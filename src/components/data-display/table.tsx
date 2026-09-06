import { type ReactNode } from "react";
import { Table, type TableDensity } from "../primitives/table";
import { TableSkeleton } from "../feedback/feedback";
import { cn } from "../../lib/utils";
export interface DataTableProps {
  children?: ReactNode;
  loading?: boolean;
  loadingRows?: number;
  loadingCols?: number;
  empty?: boolean;
  emptyState?: ReactNode;
  className?: string;
  density?: TableDensity;
}
export function DataTable({
  children,
  loading,
  loadingRows,
  loadingCols,
  empty,
  emptyState,
  className,
  density = "default",
}: DataTableProps) {
  if (loading)
    return (
      <TableSkeleton
        rows={loadingRows}
        columns={loadingCols}
        label="Loading table data"
      />
    );
  if (empty && emptyState) return <>{emptyState}</>;
  return <Table density={density} className={cn("rounded-lg border", className)}>{children}</Table>;
}
export * from "../primitives/table";
