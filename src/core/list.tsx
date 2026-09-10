import {
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../lib/utils";
import { Spin } from "./spin";

export type ListSize = "small" | "medium" | "large";
export type ListItemLayout = "horizontal" | "vertical";
export type ListSemantic =
  | "root"
  | "header"
  | "body"
  | "item"
  | "empty"
  | "footer"
  | "loadMore";

export interface ListLocale {
  emptyText?: ReactNode;
}

export interface ListSemanticInfo {
  props: Readonly<{
    size: ListSize;
    bordered: boolean;
    split: boolean;
    itemLayout: ListItemLayout;
    loading: boolean;
    empty: boolean;
  }>;
}

export type ListClassNames =
  | Partial<Record<ListSemantic, string>>
  | ((info: ListSemanticInfo) => Partial<Record<ListSemantic, string>>);
export type ListStyles =
  | Partial<Record<ListSemantic, CSSProperties>>
  | ((info: ListSemanticInfo) => Partial<Record<ListSemantic, CSSProperties>>);

export interface ListProps<T = unknown>
  extends Omit<HTMLAttributes<HTMLDivElement>, "aria-busy" | "children"> {
  dataSource?: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  rowKey: keyof T | ((item: T) => Key);
  bordered?: boolean;
  split?: boolean;
  size?: ListSize;
  itemLayout?: ListItemLayout;
  loading?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  loadMore?: ReactNode;
  locale?: ListLocale;
  classNames?: ListClassNames;
  styles?: ListStyles;
  ref?: Ref<HTMLDivElement>;
}

const paddingBySize: Record<ListSize, string> = {
  small: "px-3 py-2",
  medium: "px-4 py-3",
  large: "px-5 py-4",
};

function defaultEmptyText() {
  return typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
    ? "No data"
    : "暂无数据";
}

function resolveRowKey<T>(
  item: T,
  rowKey: keyof T | ((item: T) => Key),
): Key {
  if (typeof rowKey === "function") return rowKey(item);
  const value = item?.[rowKey];
  if (typeof value === "string" || typeof value === "number") return value;
  throw new TypeError(
    `List rowKey "${String(rowKey)}" must resolve to a string or number.`,
  );
}

export function List<T = unknown>({
  dataSource = [],
  renderItem,
  rowKey,
  bordered = false,
  split = true,
  size = "medium",
  itemLayout = "horizontal",
  loading = false,
  header,
  footer,
  loadMore,
  locale,
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: ListProps<T>) {
  const empty = dataSource.length === 0;
  const semanticInfo: ListSemanticInfo = {
    props: { size, bordered, split, itemLayout, loading, empty },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});
  const padding = paddingBySize[size];

  return (
    <div
      {...props}
      ref={ref}
      data-slot="list"
      data-size={size}
      data-layout={itemLayout}
      data-bordered={bordered || undefined}
      data-split={split || undefined}
      className={cn(
        "w-full min-w-0 text-sm text-foreground",
        bordered && "overflow-hidden rounded-lg border bg-background",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      {header !== undefined && header !== null ? (
        <div
          data-slot="list-header"
          className={cn(
            padding,
            "font-medium",
            bordered && "border-b",
            semanticClassNames.header,
          )}
          style={semanticStyles.header}
        >
          {header}
        </div>
      ) : null}

      <Spin spinning={loading}>
        {empty ? (
          <div
            data-slot="list-empty"
            className={cn(
              padding,
              "text-center text-muted-foreground",
              semanticClassNames.empty,
            )}
            style={semanticStyles.empty}
          >
            {locale?.emptyText ?? defaultEmptyText()}
          </div>
        ) : (
          <ul
            data-slot="list-body"
            className={cn(
              "min-w-0",
              split && "divide-y",
              semanticClassNames.body,
            )}
            style={semanticStyles.body}
          >
            {dataSource.map((item, index) => (
              <li
                key={resolveRowKey(item, rowKey)}
                data-slot="list-item"
                className={cn(
                  padding,
                  itemLayout === "horizontal"
                    ? "flex min-w-0 items-start gap-4"
                    : "flex min-w-0 flex-col gap-2",
                  semanticClassNames.item,
                )}
                style={semanticStyles.item}
              >
                {renderItem(item, index)}
              </li>
            ))}
          </ul>
        )}
      </Spin>

      {loadMore !== undefined && loadMore !== null ? (
        <div
          data-slot="list-load-more"
          className={cn(
            padding,
            "flex justify-center",
            bordered && "border-t",
            semanticClassNames.loadMore,
          )}
          style={semanticStyles.loadMore}
        >
          {loadMore}
        </div>
      ) : null}

      {footer !== undefined && footer !== null ? (
        <div
          data-slot="list-footer"
          className={cn(
            padding,
            bordered && "border-t",
            semanticClassNames.footer,
          )}
          style={semanticStyles.footer}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
