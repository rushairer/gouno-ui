import type { ReactNode, HTMLAttributes } from "react";
import type { PaginationProps } from "../core/pagination";
import type {
  CaptionSide,
  TableDensity,
} from "../components/primitives/table";

export type DataTableSortDirection = "ascend" | "descend";
export interface DataTableSortState { key: string; direction: DataTableSortDirection }
export interface DataTableColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sorter?: ((left: T, right: T) => number) | boolean;
  width?: number | string;
  align?: "left" | "center" | "right";
  ellipsis?: boolean;
  hidden?: boolean;
}
export interface DataTablePagination extends Omit<PaginationProps, "total"> {
  total?: number;
  mode?: "client" | "server";
}
export interface DataTableProps<T = Record<string, unknown>> {
  children?: ReactNode;
  columns?: readonly DataTableColumn<T>[];
  dataSource?: readonly T[];
  rowKey?: keyof T | ((record: T, index: number) => string);
  loading?: boolean;
  loadingRows?: number;
  loadingCols?: number;
  empty?: boolean;
  emptyState?: ReactNode;
  className?: string;
  density?: TableDensity;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (keys: string[], rows: T[]) => void;
  defaultSort?: DataTableSortState;
  sort?: DataTableSortState | null;
  onSortChange?: (sort: DataTableSortState | undefined) => void;
  filter?: (record: T) => boolean;
  pagination?: DataTablePagination | false;
  bordered?: boolean;
  stickyHeader?: boolean;
  rowDisabled?: (record: T) => boolean;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys?: string[];
  onExpandedRowsChange?: (keys: string[]) => void;
  expandedRowRender?: (record: T, index: number) => ReactNode;
  summary?: (rows: T[]) => ReactNode;
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  rowClassName?: (record: T, index: number) => string;
  toolbar?: ReactNode;
  batchActions?: (keys: string[], clearSelection: () => void) => ReactNode;
  error?: ReactNode;
  caption?: ReactNode;
  captionSide?: CaptionSide;
  containerClassName?: string;
  locale?: { emptyText?: ReactNode; totalText?: (total: number) => ReactNode; previousText?: ReactNode; nextText?: ReactNode };
}
