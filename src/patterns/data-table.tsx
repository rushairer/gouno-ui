import { Fragment, useMemo, useState, type ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type TableDensity } from "../components/primitives/table";
import { TableSkeleton } from "./feedback";
import { cn } from "../lib/utils";

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
}
export interface DataTablePagination {
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}
export interface DataTableProps<T = Record<string, unknown>> {
  children?: ReactNode;
  columns?: DataTableColumn<T>[];
  dataSource?: T[];
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
  sort?: DataTableSortState;
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
  locale?: { emptyText?: ReactNode; totalText?: (total: number) => ReactNode; previousText?: ReactNode; nextText?: ReactNode };
}

function recordKey<T>(record: T, index: number, rowKey?: keyof T | ((record: T, index: number) => string)) {
  const value = typeof rowKey === "function" ? rowKey(record, index) : rowKey ? record[rowKey] : index;
  return String(value);
}

export function DataTable<T = Record<string, unknown>>({
  children, columns, dataSource = [], rowKey, loading, loadingRows, loadingCols,
  empty, emptyState, className, density = "default", selectable, selectedRowKeys,
  onSelectionChange, defaultSort, sort: controlledSort, onSortChange, filter,
  pagination = false,
  bordered = true, stickyHeader = false, rowDisabled, expandedRowKeys, defaultExpandedRowKeys = [], onExpandedRowsChange, expandedRowRender, locale,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<DataTableSortState | undefined>(defaultSort);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(pagination && pagination.defaultPage ? pagination.defaultPage : 1);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpandedRowKeys);
  const sort = controlledSort ?? internalSort;
  const selected = selectedRowKeys ?? internalSelected;
  const expanded = expandedRowKeys ?? internalExpanded;
  const page = pagination && pagination.page !== undefined ? pagination.page : internalPage;
  const generated = Boolean(columns);
  const filtered = useMemo(() => filter ? dataSource.filter(filter) : dataSource, [dataSource, filter]);
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns?.find((candidate) => candidate.key === sort.key);
    if (!column?.sorter) return filtered;
    const compare = typeof column.sorter === "function"
      ? column.sorter
      : (left: T, right: T) => String(column.dataIndex ? left[column.dataIndex] : "").localeCompare(String(column.dataIndex ? right[column.dataIndex] : ""));
    return [...filtered].sort((left, right) => sort.direction === "ascend" ? compare(left, right) : compare(right, left));
  }, [columns, filtered, sort]);
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : sorted.length || 1;
  const total = pagination && pagination.total !== undefined ? pagination.total : sorted.length;
  const visible = pagination ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const updateSelection = (keys: string[]) => {
    if (selectedRowKeys === undefined) setInternalSelected(keys);
    onSelectionChange?.(keys, dataSource.filter((row, index) => keys.includes(recordKey(row, index, rowKey))));
  };
  const updateSort = (key: string) => {
    const next: DataTableSortState | undefined = sort?.key === key
      ? sort.direction === "ascend" ? { key, direction: "descend" } : undefined
      : { key, direction: "ascend" };
    if (controlledSort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };
  if (loading) return <TableSkeleton rows={loadingRows} columns={loadingCols} label="Loading table data" />;
  if (empty || (generated && visible.length === 0)) return <>{emptyState ?? locale?.emptyText ?? <div className="p-8 text-center text-sm text-muted-foreground">暂无数据</div>}</>;
  if (!generated) return <Table density={density} className={cn("rounded-lg border", className)}>{children}</Table>;
  const allVisibleKeys = visible.map((row, index) => ({ row, key: recordKey(row, (page - 1) * pageSize + index, rowKey) })).filter(({ row }) => !rowDisabled?.(row)).map(({ key }) => key);
  const allSelected = allVisibleKeys.length > 0 && allVisibleKeys.every((key) => selected.includes(key));
  return (
    <div data-slot="data-table" className={cn("w-full space-y-3", className)}>
      <Table density={density} bordered={bordered} stickyHeader={stickyHeader}>
        <TableHeader><TableRow>
          {expandedRowRender ? <TableHead className="w-12"><span className="sr-only">展开行</span></TableHead> : null}
          {selectable ? <TableHead><input type="checkbox" aria-label="全选当前页" checked={allSelected} onChange={(event) => updateSelection(event.target.checked ? [...new Set([...selected, ...allVisibleKeys])] : selected.filter((key) => !allVisibleKeys.includes(key)))} /></TableHead> : null}
          {columns?.map((column) => {
            const active = sort?.key === column.key;
            return <TableHead key={column.key} style={{ width: column.width, textAlign: column.align }} aria-sort={active ? sort.direction === "ascend" ? "ascending" : "descending" : column.sorter ? "none" : undefined}>
              {column.sorter ? <button type="button" className="inline-flex min-h-8 items-center gap-1 font-medium hover:text-primary" onClick={() => updateSort(column.key)}>{column.title}<span aria-hidden="true">{active ? sort.direction === "ascend" ? "↑" : "↓" : "↕"}</span></button> : column.title}
            </TableHead>;
          })}
        </TableRow></TableHeader>
        <TableBody>{visible.map((record, index) => {
          const key = recordKey(record, (page - 1) * pageSize + index, rowKey);
          const disabled = rowDisabled?.(record) ?? false;
          const isExpanded = expanded.includes(key);
          const toggleExpanded = () => { const next = isExpanded ? expanded.filter((candidate) => candidate !== key) : [...expanded, key]; if (expandedRowKeys === undefined) setInternalExpanded(next); onExpandedRowsChange?.(next); };
          return <Fragment key={key}>
            <TableRow data-state={selected.includes(key) ? "selected" : undefined} aria-disabled={disabled || undefined}>
              {expandedRowRender ? <TableCell><button type="button" className="flex size-8 items-center justify-center rounded hover:bg-muted" aria-label={isExpanded ? "收起行" : "展开行"} aria-expanded={isExpanded} onClick={toggleExpanded}>{isExpanded ? "−" : "+"}</button></TableCell> : null}
              {selectable ? <TableCell><input type="checkbox" aria-label={`选择第 ${index + 1} 行`} checked={selected.includes(key)} disabled={disabled} onChange={(event) => updateSelection(event.target.checked ? [...selected, key] : selected.filter((candidate) => candidate !== key))} /></TableCell> : null}
              {columns?.map((column) => { const value = column.dataIndex ? record[column.dataIndex] : undefined; return <TableCell key={column.key} title={column.ellipsis ? String(value ?? "") : undefined} className={column.ellipsis ? "max-w-0 truncate" : undefined} style={{ textAlign: column.align }}>{column.render ? column.render(value, record, index) : String(value ?? "")}</TableCell>; })}
            </TableRow>
            {isExpanded && expandedRowRender ? <TableRow key={`${key}-expanded`}><TableCell colSpan={(columns?.length ?? 0) + (selectable ? 1 : 0) + 1} className="bg-muted/30 whitespace-normal">{expandedRowRender(record, index)}</TableCell></TableRow> : null}
          </Fragment>;
        })}</TableBody>
      </Table>
      {pagination ? <nav aria-label="表格分页" className="flex items-center justify-between text-sm text-muted-foreground"><span>{locale?.totalText?.(total) ?? `${total} 条记录`}</span><div className="flex items-center gap-2"><button type="button" className="rounded border px-2 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => { const next = page - 1; if (pagination.page === undefined) setInternalPage(next); pagination.onChange?.(next, pageSize); }}>{locale?.previousText ?? "上一页"}</button><span aria-live="polite">{page} / {totalPages}</span><button type="button" className="rounded border px-2 py-1 disabled:opacity-50" disabled={page >= totalPages} onClick={() => { const next = page + 1; if (pagination.page === undefined) setInternalPage(next); pagination.onChange?.(next, pageSize); }}>{locale?.nextText ?? "下一页"}</button></div></nav> : null}
    </div>
  );
}

export * from "../components/primitives/table";
