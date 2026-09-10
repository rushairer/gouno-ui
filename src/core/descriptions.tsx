import {
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../lib/utils";

export type DescriptionsSize = "small" | "medium" | "large";
export type DescriptionsLayout = "horizontal" | "vertical";
export type DescriptionsBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type DescriptionsColumnCount = 1 | 2 | 3 | 4 | 5 | 6;
export type DescriptionsColumn =
  | DescriptionsColumnCount
  | Partial<Record<DescriptionsBreakpoint, DescriptionsColumnCount>>;
export type DescriptionsSpanValue = DescriptionsColumnCount | "filled";
export type DescriptionsSpan =
  | DescriptionsSpanValue
  | Partial<Record<DescriptionsBreakpoint, DescriptionsSpanValue>>;
export type DescriptionsSemantic =
  | "root"
  | "header"
  | "title"
  | "extra"
  | "body"
  | "item"
  | "label"
  | "content";

export interface DescriptionsItem {
  key: Key;
  label: ReactNode;
  children: ReactNode;
  span?: DescriptionsSpan;
  className?: string;
  style?: CSSProperties;
}

export interface DescriptionsSemanticInfo {
  props: Readonly<{
    bordered: boolean;
    colon: boolean;
    layout: DescriptionsLayout;
    size: DescriptionsSize;
  }>;
}

export type DescriptionsClassNames =
  | Partial<Record<DescriptionsSemantic, string>>
  | ((info: DescriptionsSemanticInfo) => Partial<Record<DescriptionsSemantic, string>>);
export type DescriptionsStyles =
  | Partial<Record<DescriptionsSemantic, CSSProperties>>
  | ((info: DescriptionsSemanticInfo) => Partial<Record<DescriptionsSemantic, CSSProperties>>);

export interface DescriptionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  title?: ReactNode;
  extra?: ReactNode;
  items?: readonly DescriptionsItem[];
  bordered?: boolean;
  colon?: boolean;
  column?: DescriptionsColumn;
  layout?: DescriptionsLayout;
  size?: DescriptionsSize;
  classNames?: DescriptionsClassNames;
  styles?: DescriptionsStyles;
  ref?: Ref<HTMLDivElement>;
}

const baseColumns: Record<DescriptionsColumnCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};
const smColumns: Record<DescriptionsColumnCount, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};
const mdColumns: Record<DescriptionsColumnCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};
const lgColumns: Record<DescriptionsColumnCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};
const xlColumns: Record<DescriptionsColumnCount, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
};
const xxlColumns: Record<DescriptionsColumnCount, string> = {
  1: "2xl:grid-cols-1",
  2: "2xl:grid-cols-2",
  3: "2xl:grid-cols-3",
  4: "2xl:grid-cols-4",
  5: "2xl:grid-cols-5",
  6: "2xl:grid-cols-6",
};

const baseSpans: Record<DescriptionsColumnCount, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};
const smSpans: Record<DescriptionsColumnCount, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
};
const mdSpans: Record<DescriptionsColumnCount, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
};
const lgSpans: Record<DescriptionsColumnCount, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
};
const xlSpans: Record<DescriptionsColumnCount, string> = {
  1: "xl:col-span-1",
  2: "xl:col-span-2",
  3: "xl:col-span-3",
  4: "xl:col-span-4",
  5: "xl:col-span-5",
  6: "xl:col-span-6",
};
const xxlSpans: Record<DescriptionsColumnCount, string> = {
  1: "2xl:col-span-1",
  2: "2xl:col-span-2",
  3: "2xl:col-span-3",
  4: "2xl:col-span-4",
  5: "2xl:col-span-5",
  6: "2xl:col-span-6",
};

const paddingBySize: Record<DescriptionsSize, string> = {
  small: "px-3 py-2",
  medium: "px-4 py-3",
  large: "px-5 py-4",
};

function columnClassName(column: DescriptionsColumn) {
  if (typeof column === "number") return baseColumns[column];
  return cn(
    baseColumns[column.xs ?? 1],
    column.sm && smColumns[column.sm],
    column.md && mdColumns[column.md],
    column.lg && lgColumns[column.lg],
    column.xl && xlColumns[column.xl],
    column.xxl && xxlColumns[column.xxl],
  );
}

function spanClassName(span: DescriptionsSpan | undefined) {
  if (!span) return baseSpans[1];
  if (span === "filled") return "col-span-full";
  if (typeof span === "number") return baseSpans[span];
  const base = span.xs ?? 1;
  return cn(
    base === "filled" ? "col-span-full" : baseSpans[base],
    span.sm && (span.sm === "filled" ? "sm:col-span-full" : smSpans[span.sm]),
    span.md && (span.md === "filled" ? "md:col-span-full" : mdSpans[span.md]),
    span.lg && (span.lg === "filled" ? "lg:col-span-full" : lgSpans[span.lg]),
    span.xl && (span.xl === "filled" ? "xl:col-span-full" : xlSpans[span.xl]),
    span.xxl &&
      (span.xxl === "filled" ? "2xl:col-span-full" : xxlSpans[span.xxl]),
  );
}

export function Descriptions({
  title,
  extra,
  items = [],
  bordered = false,
  colon = true,
  column = 3,
  layout = "horizontal",
  size = "large",
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: DescriptionsProps) {
  const semanticInfo: DescriptionsSemanticInfo = {
    props: { bordered, colon, layout, size },
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
      data-slot="descriptions"
      data-size={size}
      data-layout={layout}
      data-bordered={bordered || undefined}
      className={cn("w-full min-w-0", semanticClassNames.root, className)}
      style={{ ...semanticStyles.root, ...style }}
    >
      {title !== undefined || extra !== undefined ? (
        <div
          data-slot="descriptions-header"
          className={cn(
            "mb-4 flex min-w-0 items-start justify-between gap-4",
            semanticClassNames.header,
          )}
          style={semanticStyles.header}
        >
          <div
            data-slot="descriptions-title"
            className={cn("min-w-0 text-base font-semibold", semanticClassNames.title)}
            style={semanticStyles.title}
          >
            {title}
          </div>
          {extra !== undefined && extra !== null ? (
            <div
              data-slot="descriptions-extra"
              className={cn("shrink-0", semanticClassNames.extra)}
              style={semanticStyles.extra}
            >
              {extra}
            </div>
          ) : null}
        </div>
      ) : null}

      <dl
        data-slot="descriptions-body"
        className={cn(
          "grid min-w-0",
          columnClassName(column),
          bordered
            ? "gap-px overflow-hidden rounded-lg border bg-border"
            : "gap-x-6 gap-y-4",
          semanticClassNames.body,
        )}
        style={semanticStyles.body}
      >
        {items.map((item) => (
          <div
            key={item.key}
            data-slot="descriptions-item"
            className={cn(
              "min-w-0",
              spanClassName(item.span),
              layout === "horizontal"
                ? "grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-stretch"
                : "flex flex-col",
              bordered && "bg-background",
              semanticClassNames.item,
              item.className,
            )}
            style={{ ...semanticStyles.item, ...item.style }}
          >
            <dt
              data-slot="descriptions-label"
              className={cn(
                "min-w-0 text-muted-foreground",
                bordered ? cn(padding, "bg-muted/50 font-medium") : "font-medium",
                layout === "vertical" && !bordered && "mb-1",
                semanticClassNames.label,
              )}
              style={semanticStyles.label}
            >
              {item.label}
              {colon && layout === "horizontal" ? <span aria-hidden="true">:</span> : null}
            </dt>
            <dd
              data-slot="descriptions-content"
              className={cn(
                "min-w-0 break-words text-foreground",
                bordered && padding,
                semanticClassNames.content,
              )}
              style={semanticStyles.content}
            >
              {item.children}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
