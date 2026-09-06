import { Fragment, useMemo, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../components/primitives/table";
import { Pagination } from "../core/pagination";
import { Skeleton } from "../components/primitives/skeleton";
import { cn } from "../lib/utils";
import type { DataTableProps, DataTableSortState } from "./data-table.types";
export type * from "./data-table.types";

export function DataTable<T = Record<string, unknown>>({
  children, columns, dataSource = [], rowKey, loading = false, loadingRows = 4, loadingCols = 4,
  empty, emptyState, className, density = "default", selectable, selectedRowKeys,
  onSelectionChange, defaultSort, sort: controlledSort, onSortChange, filter,
  pagination = false, bordered = true, stickyHeader = false, rowDisabled,
  expandedRowKeys, defaultExpandedRowKeys = [], onExpandedRowsChange, expandedRowRender,
  locale, summary, onRow, rowClassName, toolbar, batchActions, error, caption, containerClassName,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<DataTableSortState | undefined>(defaultSort);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(pagination ? pagination.defaultPage ?? 1 : 1);
  const [internalSize, setInternalSize] = useState(pagination ? pagination.defaultPageSize ?? 10 : 10);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpandedRowKeys);
  const sort = controlledSort !== undefined ? controlledSort : internalSort;
  const selected = selectedRowKeys ?? internalSelected;
  const expanded = expandedRowKeys ?? internalExpanded;
  const server = pagination && pagination.mode === "server";
  const displayColumns = columns?.filter(column => !column.hidden) ?? [];
  // Assign fallback keys before filtering/sorting, never using the current page index.
  const records = useMemo(() => dataSource.map((record, index) => ({
    record, index,
    key: String(typeof rowKey === "function" ? rowKey(record, index) : rowKey !== undefined ? record[rowKey] : index),
  })), [dataSource, rowKey]);
  const sorted = useMemo(() => {
    const filtered = filter ? records.filter(({ record }) => filter(record)) : records;
    if (!sort || server) return filtered;
    const column = columns?.find(candidate => candidate.key === sort.key);
    if (!column?.sorter) return filtered;
    const compare = typeof column.sorter === "function" ? column.sorter : (a: T, b: T) => {
      const left = column.dataIndex !== undefined ? a[column.dataIndex] : "";
      const right = column.dataIndex !== undefined ? b[column.dataIndex] : "";
      return typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
    };
    return [...filtered].sort((a, b) => sort.direction === "ascend" ? compare(a.record, b.record) : compare(b.record, a.record));
  }, [records, filter, sort, columns, server]);
  const requestedSize = pagination ? pagination.pageSize ?? internalSize : sorted.length || 1;
  const pageSize = Number.isFinite(requestedSize) && requestedSize > 0 ? Math.floor(requestedSize) || 1 : 10;
  const total = Math.max(0, server && pagination.total !== undefined ? pagination.total : sorted.length);
  const requestedPage = pagination ? pagination.page ?? internalPage : 1;
  const page = Math.min(Math.max(1, Math.ceil(total / pageSize)), Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1));
  const visible = pagination && !server ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;
  const columnCount = Math.max(1, displayColumns.length + Number(Boolean(selectable)) + Number(Boolean(expandedRowRender)));
  const unavailable = loading || Boolean(error) || empty;
  const keysOnPage = unavailable ? [] : visible.filter(({ record }) => !rowDisabled?.(record)).map(({ key }) => key);
  const allSelected = keysOnPage.length > 0 && keysOnPage.every(key => selected.includes(key));
  const mixed = !allSelected && keysOnPage.some(key => selected.includes(key));
  const updateSelection = (keys: string[]) => {
    const unique = [...new Set(keys)];
    if (selectedRowKeys === undefined) setInternalSelected(unique);
    onSelectionChange?.(unique, records.filter(({ key }) => unique.includes(key)).map(({ record }) => record));
  };
  const updateSort = (key: string) => {
    const next = sort?.key === key ? sort.direction === "ascend" ? { key, direction: "descend" as const } : undefined : { key, direction: "ascend" as const };
    if (controlledSort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  if (!columns) return <Table density={density} bordered={bordered} stickyHeader={stickyHeader} className={className} containerClassName={containerClassName}>{children}</Table>;
  return (
    <div data-slot="data-table" className={cn("w-full min-w-0 space-y-3", className)} aria-busy={loading || undefined}>
      {toolbar}
      {selected.length > 0 && batchActions?.(selected, () => updateSelection([]))}
      <Table density={density} bordered={bordered} stickyHeader={stickyHeader} containerClassName={containerClassName}>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader><TableRow>
          {expandedRowRender && <TableHead scope="col" className="w-12"><span className="sr-only">展开行</span></TableHead>}
          {selectable && <TableHead scope="col" className="w-12">
            <input type="checkbox" className="size-4 accent-primary" aria-label="全选当前页" aria-checked={mixed ? "mixed" : allSelected} ref={node => { if (node) node.indeterminate = mixed; }} checked={allSelected} disabled={!keysOnPage.length} onChange={event => updateSelection(event.target.checked ? [...selected, ...keysOnPage] : selected.filter(key => !keysOnPage.includes(key)))} />
          </TableHead>}
          {displayColumns.map(column => {
            const active = sort?.key === column.key;
            return <TableHead key={column.key} scope="col" style={{ width: column.width, textAlign: column.align }} aria-sort={active ? sort.direction === "ascend" ? "ascending" : "descending" : column.sorter ? "none" : undefined}>
              {column.sorter ? <button type="button" disabled={loading} className="inline-flex min-h-8 items-center gap-2 rounded-sm font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-ring" onClick={() => updateSort(column.key)}>{column.title}<span aria-hidden="true">{active ? sort.direction === "ascend" ? "↑" : "↓" : "↕"}</span></button> : column.title}
            </TableHead>;
          })}
        </TableRow></TableHeader>
        <TableBody>
          {loading ? Array.from({ length: Math.max(1, loadingRows) }, (_, index) => <TableRow key={index}><TableCell colSpan={columnCount}><div role={index === 0 ? "status" : undefined} aria-label={index === 0 ? "Loading table data" : undefined} className="flex gap-4">{Array.from({ length: Math.max(1, loadingCols) }, (_, col) => <Skeleton key={col} className="h-5 flex-1" />)}</div></TableCell></TableRow>) : error ? <TableRow><TableCell colSpan={columnCount}><div role="alert" className="py-10 text-center text-destructive">{error}</div></TableCell></TableRow> : empty || !visible.length ? <TableRow><TableCell colSpan={columnCount}><div data-slot="data-table-empty" className="py-10 text-center text-muted-foreground">{emptyState ?? locale?.emptyText ?? "暂无数据"}</div></TableCell></TableRow> : visible.map(({ record, key, index }) => {
            const disabled = rowDisabled?.(record) ?? false;
            const isExpanded = expanded.includes(key);
            const rowProps = onRow?.(record, index);
            return <Fragment key={key}>
              <TableRow {...rowProps} className={cn(disabled && "opacity-50", rowClassName?.(record, index), rowProps?.className)} data-state={selected.includes(key) ? "selected" : undefined} aria-disabled={disabled || undefined}>
                {expandedRowRender && <TableCell><button type="button" disabled={disabled} className="flex size-8 items-center justify-center rounded border hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring" aria-label={isExpanded ? "收起行" : "展开行"} aria-expanded={isExpanded} onClick={() => {
                  const next = isExpanded ? expanded.filter(candidate => candidate !== key) : [...expanded, key];
                  if (expandedRowKeys === undefined) setInternalExpanded(next);
                  onExpandedRowsChange?.(next);
                }}>{isExpanded ? "−" : "+"}</button></TableCell>}
                {selectable && <TableCell><input type="checkbox" className="size-4 accent-primary" aria-label={`选择第 ${index + 1} 行`} checked={selected.includes(key)} disabled={disabled} onChange={event => updateSelection(event.target.checked ? [...selected, key] : selected.filter(candidate => candidate !== key))} /></TableCell>}
                {displayColumns.map(column => {
                  const value = column.dataIndex !== undefined ? record[column.dataIndex] : undefined;
                  return <TableCell key={column.key} title={column.ellipsis ? String(value ?? "") : undefined} className={column.ellipsis ? "max-w-0 truncate" : undefined} style={{ textAlign: column.align }}>{column.render ? column.render(value, record, index) : String(value ?? "")}</TableCell>;
                })}
              </TableRow>
              {isExpanded && expandedRowRender && <TableRow><TableCell colSpan={columnCount} className="bg-muted/30 whitespace-normal">{expandedRowRender(record, index)}</TableCell></TableRow>}
            </Fragment>;
          })}
        </TableBody>
        {!unavailable && summary && <TableFooter>{summary(visible.map(({ record }) => record))}</TableFooter>}
      </Table>
      {pagination && <Pagination {...pagination} ariaLabel={pagination.ariaLabel ?? "表格分页"} prevText={locale?.previousText ?? "上一页"} nextText={locale?.nextText ?? "下一页"} total={total} page={page} pageSize={pageSize} disabled={loading || pagination.disabled} showTotal={pagination.showTotal ?? (count => locale?.totalText?.(count) ?? `${count} 条记录`)} itemRender={pagination.itemRender ?? ((_page, type, original) => type === "prev" ? locale?.previousText ?? "上一页" : type === "next" ? locale?.nextText ?? "下一页" : original)} onChange={(next, nextSize) => {
        if (pagination.page === undefined) setInternalPage(next);
        if (pagination.pageSize === undefined) setInternalSize(nextSize);
        pagination.onChange?.(next, nextSize);
      }} />}
    </div>
  );
}
export * from "../components/primitives/table";
