import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/primitives/table";
import { Skeleton } from "../components/primitives/skeleton";
import { Pagination } from "../core/pagination";
import { cn } from "../lib/utils";
import { useDataTableModel } from "./data-table-model";
import type { DataTableProps } from "./data-table.types";

export function DataTable<T = Record<string, unknown>>({
  children,
  columns,
  dataSource = [],
  rowKey,
  loading = false,
  loadingRows = 4,
  loadingCols = 4,
  empty,
  emptyState,
  className,
  density = "default",
  selectable,
  selectedRowKeys,
  onSelectionChange,
  defaultSort,
  sort: controlledSort,
  onSortChange,
  filter,
  pagination = false,
  bordered = true,
  stickyHeader = false,
  rowDisabled,
  expandedRowKeys,
  defaultExpandedRowKeys = [],
  onExpandedRowsChange,
  expandedRowRender,
  locale,
  summary,
  onRow,
  rowClassName,
  toolbar,
  batchActions,
  error,
  caption,
  captionSide = "top",
  containerClassName,
}: DataTableProps<T>) {
  const unavailable = loading || Boolean(error) || Boolean(empty);
  const model = useDataTableModel({
    columns,
    dataSource,
    rowKey,
    filter,
    pagination,
    selectedRowKeys,
    onSelectionChange,
    defaultSort,
    controlledSort,
    onSortChange,
    rowDisabled,
    expandedRowKeys,
    defaultExpandedRowKeys,
    onExpandedRowsChange,
    selectable,
    hasExpandedRows: Boolean(expandedRowRender),
    unavailable,
  });

  if (!columns) {
    return (
      <div data-slot="data-table" className={cn("w-full min-w-0", className)}>
        <Table
          density={density}
          bordered={bordered}
          stickyHeader={stickyHeader}
          containerClassName={containerClassName}
        >
          {caption !== undefined ? (
            <TableCaption captionSide={captionSide}>{caption}</TableCaption>
          ) : null}
          {children}
        </Table>
      </div>
    );
  }

  const {
    sort,
    selected,
    expanded,
    displayColumns,
    visible,
    page,
    pageSize,
    total,
    columnCount,
    keysOnPage,
    allSelected,
    mixed,
    updateSelection,
    updateSort,
    updateExpanded,
    updatePage,
  } = model;

  return (
    <div
      data-slot="data-table"
      className={cn("w-full min-w-0 space-y-3", className)}
      aria-busy={loading || undefined}
    >
      {toolbar}
      {selected.length > 0
        ? batchActions?.(selected, () => updateSelection([]))
        : null}
      <Table
        density={density}
        bordered={bordered}
        stickyHeader={stickyHeader}
        containerClassName={containerClassName}
      >
        {caption !== undefined ? (
          <TableCaption captionSide={captionSide}>{caption}</TableCaption>
        ) : null}
        <TableHeader>
          <TableRow>
            {expandedRowRender ? (
              <TableHead scope="col" className="w-12">
                <span className="sr-only">展开行</span>
              </TableHead>
            ) : null}
            {selectable ? (
              <TableHead scope="col" className="w-12">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  aria-label="全选当前页"
                  aria-checked={mixed ? "mixed" : allSelected}
                  ref={(node) => {
                    if (node) node.indeterminate = mixed;
                  }}
                  checked={allSelected}
                  disabled={!keysOnPage.length}
                  onChange={(event) =>
                    updateSelection(
                      event.target.checked
                        ? [...selected, ...keysOnPage]
                        : selected.filter((key) => !keysOnPage.includes(key)),
                    )
                  }
                />
              </TableHead>
            ) : null}
            {displayColumns.map((column) => {
              const active = sort?.key === column.key;
              return (
                <TableHead
                  key={column.key}
                  scope="col"
                  style={{ width: column.width, textAlign: column.align }}
                  aria-sort={
                    active
                      ? sort.direction === "ascend"
                        ? "ascending"
                        : "descending"
                      : column.sorter
                        ? "none"
                        : undefined
                  }
                >
                  {column.sorter ? (
                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex min-h-8 items-center gap-2 rounded-sm font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => updateSort(column.key)}
                    >
                      {column.title}
                      <span aria-hidden="true">
                        {active
                          ? sort.direction === "ascend"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: Math.max(1, loadingRows) }, (_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={columnCount}>
                  <div
                    role={index === 0 ? "status" : undefined}
                    aria-label={index === 0 ? "Loading table data" : undefined}
                    className="flex gap-4"
                  >
                    {Array.from(
                      { length: Math.max(1, loadingCols) },
                      (_, col) => (
                        <Skeleton key={col} className="h-5 flex-1" />
                      ),
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columnCount}>
                <div
                  role="alert"
                  className="py-10 text-center text-destructive"
                >
                  {error}
                </div>
              </TableCell>
            </TableRow>
          ) : empty || !visible.length ? (
            <TableRow>
              <TableCell colSpan={columnCount}>
                <div
                  data-slot="data-table-empty"
                  className="py-10 text-center text-muted-foreground"
                >
                  {emptyState ?? locale?.emptyText ?? "暂无数据"}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            visible.map(({ record, key, index }) => {
              const disabled = rowDisabled?.(record) ?? false;
              const isExpanded = expanded.includes(key);
              const rowProps = onRow?.(record, index);
              return (
                <Fragment key={key}>
                  <TableRow
                    {...rowProps}
                    className={cn(
                      disabled && "opacity-50",
                      rowClassName?.(record, index),
                      rowProps?.className,
                    )}
                    data-state={selected.includes(key) ? "selected" : undefined}
                    aria-disabled={disabled || undefined}
                  >
                    {expandedRowRender ? (
                      <TableCell>
                        <button
                          type="button"
                          disabled={disabled}
                          className="flex size-8 items-center justify-center rounded border hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                          aria-label={isExpanded ? "收起行" : "展开行"}
                          aria-expanded={isExpanded}
                          onClick={() => updateExpanded(key)}
                        >
                          {isExpanded ? "−" : "+"}
                        </button>
                      </TableCell>
                    ) : null}
                    {selectable ? (
                      <TableCell>
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          aria-label={`选择第 ${index + 1} 行`}
                          checked={selected.includes(key)}
                          disabled={disabled}
                          onChange={(event) =>
                            updateSelection(
                              event.target.checked
                                ? [...selected, key]
                                : selected.filter(
                                    (candidate) => candidate !== key,
                                  ),
                            )
                          }
                        />
                      </TableCell>
                    ) : null}
                    {displayColumns.map((column) => {
                      const value =
                        column.dataIndex !== undefined
                          ? record[column.dataIndex]
                          : undefined;
                      return (
                        <TableCell
                          key={column.key}
                          title={
                            column.ellipsis ? String(value ?? "") : undefined
                          }
                          className={
                            column.ellipsis ? "max-w-0 truncate" : undefined
                          }
                          style={{ textAlign: column.align }}
                        >
                          {column.render
                            ? column.render(value, record, index)
                            : String(value ?? "")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {isExpanded && expandedRowRender ? (
                    <TableRow>
                      <TableCell
                        colSpan={columnCount}
                        className="bg-muted/30 whitespace-normal"
                      >
                        {expandedRowRender(record, index)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </TableBody>
        {!unavailable && summary ? (
          <TableFooter>
            {summary(visible.map(({ record }) => record))}
          </TableFooter>
        ) : null}
      </Table>
      {pagination ? (
        <Pagination
          {...pagination}
          ariaLabel={pagination.ariaLabel ?? "表格分页"}
          prevText={pagination.prevText ?? locale?.previousText ?? "上一页"}
          nextText={pagination.nextText ?? locale?.nextText ?? "下一页"}
          total={total}
          page={page}
          pageSize={pageSize}
          disabled={loading || pagination.disabled}
          showTotal={
            pagination.showTotal ??
            ((count) => locale?.totalText?.(count) ?? `${count} 条记录`)
          }
          itemRender={pagination.itemRender}
          onChange={updatePage}
        />
      ) : null}
    </div>
  );
}
