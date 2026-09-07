import { useMemo, useState } from "react";
import type {
  DataTableColumn,
  DataTablePagination,
  DataTableSortState,
} from "./data-table.types";

export interface DataTableRecord<T> {
  record: T;
  index: number;
  key: string;
}

interface UseDataTableModelOptions<T> {
  columns?: readonly DataTableColumn<T>[];
  dataSource: readonly T[];
  rowKey?: keyof T | ((record: T, index: number) => string);
  filter?: (record: T) => boolean;
  pagination: DataTablePagination | false;
  selectedRowKeys?: string[];
  onSelectionChange?: (keys: string[], rows: T[]) => void;
  defaultSort?: DataTableSortState;
  controlledSort?: DataTableSortState | null;
  onSortChange?: (sort: DataTableSortState | undefined) => void;
  rowDisabled?: (record: T) => boolean;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys: string[];
  onExpandedRowsChange?: (keys: string[]) => void;
  selectable?: boolean;
  hasExpandedRows: boolean;
  unavailable: boolean;
}

export function useDataTableModel<T>({
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
  hasExpandedRows,
  unavailable,
}: UseDataTableModelOptions<T>) {
  const [internalSort, setInternalSort] = useState<
    DataTableSortState | undefined
  >(defaultSort);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(
    pagination ? (pagination.defaultPage ?? 1) : 1,
  );
  const [internalSize, setInternalSize] = useState(
    pagination ? (pagination.defaultPageSize ?? 10) : 10,
  );
  const [internalExpanded, setInternalExpanded] = useState(
    defaultExpandedRowKeys,
  );

  const sort = controlledSort !== undefined ? controlledSort : internalSort;
  const selected = selectedRowKeys ?? internalSelected;
  const expanded = expandedRowKeys ?? internalExpanded;
  const server = pagination !== false && pagination.mode === "server";
  const displayColumns = columns?.filter((column) => !column.hidden) ?? [];

  const records = useMemo<DataTableRecord<T>[]>(
    () =>
      dataSource.map((record, index) => ({
        record,
        index,
        key: String(
          typeof rowKey === "function"
            ? rowKey(record, index)
            : rowKey !== undefined
              ? record[rowKey]
              : index,
        ),
      })),
    [dataSource, rowKey],
  );

  const sorted = useMemo(() => {
    const filtered = filter
      ? records.filter(({ record }) => filter(record))
      : records;
    if (!sort || server) return filtered;

    const column = columns?.find((candidate) => candidate.key === sort.key);
    if (!column?.sorter) return filtered;

    const compare =
      typeof column.sorter === "function"
        ? column.sorter
        : (leftRecord: T, rightRecord: T) => {
            const left =
              column.dataIndex !== undefined
                ? leftRecord[column.dataIndex]
                : "";
            const right =
              column.dataIndex !== undefined
                ? rightRecord[column.dataIndex]
                : "";
            return typeof left === "number" && typeof right === "number"
              ? left - right
              : String(left).localeCompare(String(right));
          };

    return [...filtered].sort((left, right) =>
      sort.direction === "ascend"
        ? compare(left.record, right.record)
        : compare(right.record, left.record),
    );
  }, [records, filter, sort, columns, server]);

  const requestedSize = pagination
    ? (pagination.pageSize ?? internalSize)
    : sorted.length || 1;
  const pageSize =
    Number.isFinite(requestedSize) && requestedSize > 0
      ? Math.floor(requestedSize) || 1
      : 10;
  const total = Math.max(
    0,
    server && pagination && pagination.total !== undefined
      ? pagination.total
      : sorted.length,
  );
  const requestedPage = pagination ? (pagination.page ?? internalPage) : 1;
  const page = Math.min(
    Math.max(1, Math.ceil(total / pageSize)),
    Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1),
  );
  const visible =
    pagination && !server
      ? sorted.slice((page - 1) * pageSize, page * pageSize)
      : sorted;

  const columnCount = Math.max(
    1,
    displayColumns.length + Number(Boolean(selectable)) + Number(hasExpandedRows),
  );
  const keysOnPage = unavailable
    ? []
    : visible
        .filter(({ record }) => !rowDisabled?.(record))
        .map(({ key }) => key);
  const allSelected =
    keysOnPage.length > 0 && keysOnPage.every((key) => selected.includes(key));
  const mixed =
    !allSelected && keysOnPage.some((key) => selected.includes(key));

  const updateSelection = (keys: string[]) => {
    const unique = [...new Set(keys)];
    if (selectedRowKeys === undefined) setInternalSelected(unique);
    onSelectionChange?.(
      unique,
      records
        .filter(({ key }) => unique.includes(key))
        .map(({ record }) => record),
    );
  };

  const updateSort = (key: string) => {
    const next =
      sort?.key === key
        ? sort.direction === "ascend"
          ? { key, direction: "descend" as const }
          : undefined
        : { key, direction: "ascend" as const };
    if (controlledSort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  const updateExpanded = (key: string) => {
    const next = expanded.includes(key)
      ? expanded.filter((candidate) => candidate !== key)
      : [...expanded, key];
    if (expandedRowKeys === undefined) setInternalExpanded(next);
    onExpandedRowsChange?.(next);
  };

  const updatePage = (next: number, nextSize: number) => {
    if (!pagination) return;
    if (pagination.page === undefined) setInternalPage(next);
    if (pagination.pageSize === undefined) setInternalSize(nextSize);
    pagination.onChange?.(next, nextSize);
  };

  return {
    sort,
    selected,
    expanded,
    displayColumns,
    records,
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
  };
}
