import {
  Fragment,
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

/** @deprecated Prefer canonical `Separator`; retained for established Core compatibility. */
export const Divider = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(function Divider(
  { orientation = "horizontal", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      {...props}
      data-slot="divider"
      className={cn(
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        "shrink-0 bg-border",
        className,
      )}
    />
  );
});

export type SpaceAlign = "start" | "end" | "center" | "baseline" | "stretch";
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  align?: SpaceAlign;
  wrap?: boolean;
  block?: boolean;
  split?: ReactNode;
  children?: ReactNode;
}
export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space(
  {
    orientation = "horizontal",
    gap: gapValue = "md",
    align,
    wrap = false,
    block = false,
    split,
    children,
    className,
    ...props
  },
  ref,
) {
  const gap =
    typeof gapValue === "number"
      ? `[gap:${gapValue}px]`
      : ({ xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" } as const)[gapValue];
  const items = Array.isArray(children) ? children : [children];
  const content = split
    ? items.flatMap((child, index) =>
        index === 0
          ? [child]
          : [<Fragment key={`space-split-${index}`}>{split}</Fragment>, child],
      )
    : children;
  return (
    <div
      {...props}
      ref={ref}
      data-slot="space"
      data-orientation={orientation}
      data-block={block || undefined}
      className={cn(
        "flex min-w-0",
        orientation === "vertical" ? "flex-col" : "flex-row",
        align === "start" && "items-start",
        align === "end" && "items-end",
        align === "center" && "items-center",
        align === "baseline" && "items-baseline",
        align === "stretch" && "items-stretch",
        gap,
        wrap && "flex-wrap",
        block && "w-full",
        className,
      )}
    >
      {content}
    </div>
  );
});

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify = "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
export type FlexGap = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type FlexWrap = boolean | "nowrap" | "wrap" | "wrap-reverse";

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: FlexGap;
  wrap?: FlexWrap;
  flex?: CSSProperties["flex"];
  children?: ReactNode;
}

const flexGapClass: Record<Exclude<FlexGap, number>, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    direction = "row",
    align,
    justify,
    gap = "md",
    wrap = false,
    flex,
    children,
    className,
    style,
    ...props
  },
  ref,
) {
  const numericGap = typeof gap === "number" ? Math.max(0, gap) : undefined;
  const resolvedWrap = wrap === true ? "wrap" : wrap === false ? "nowrap" : wrap;

  return (
    <div
      {...props}
      ref={ref}
      data-slot="flex"
      data-direction={direction}
      data-wrap={resolvedWrap}
      className={cn(
        "flex min-w-0",
        direction === "column" && "flex-col",
        direction === "row-reverse" && "flex-row-reverse",
        direction === "column-reverse" && "flex-col-reverse",
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "stretch" && "items-stretch",
        align === "baseline" && "items-baseline",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "space-between" && "justify-between",
        justify === "space-around" && "justify-around",
        justify === "space-evenly" && "justify-evenly",
        resolvedWrap === "wrap" && "flex-wrap",
        resolvedWrap === "wrap-reverse" && "flex-wrap-reverse",
        typeof gap === "number" ? undefined : flexGapClass[gap],
        className,
      )}
      style={{
        ...style,
        ...(numericGap !== undefined ? { gap: numericGap } : undefined),
        ...(flex !== undefined ? { flex } : undefined),
      }}
    >
      {children}
    </div>
  );
});

type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: 1 | 2 | 3 | 4 | "auto";
  gap?: "sm" | "md" | "lg" | number;
  children?: ReactNode;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = "auto", gap = "md", children, className, style, ...props },
  ref,
) {
  const numericGap = typeof gap === "number" ? Math.max(0, gap) : undefined;
  return (
    <div
      {...props}
      ref={ref}
      data-slot="grid"
      data-columns={columns}
      className={cn(
        "grid",
        columns === "auto"
          ? "grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          : `grid-cols-${columns}`,
        typeof gap === "number" ? undefined : gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4",
        className,
      )}
      style={{ ...style, ...(numericGap !== undefined ? { gap: numericGap } : undefined) }}
    >
      {children}
    </div>
  );
});

export type GridSpan = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
export type GridBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type RowAlign = "top" | "middle" | "bottom" | "stretch";
export type RowJustify = "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
export type RowGutter = number | [number, number];

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gutter?: RowGutter;
  align?: RowAlign;
  justify?: RowJustify;
  wrap?: boolean;
}

const RowGutterContext = createContext(0);

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(
  { gutter = 0, align = "top", justify = "start", wrap = true, className, style, children, ...props },
  ref,
) {
  const [horizontalRaw, verticalRaw] = Array.isArray(gutter) ? gutter : [gutter, 0];
  const horizontal = Math.max(0, horizontalRaw);
  const vertical = Math.max(0, verticalRaw);
  return (
    <RowGutterContext.Provider value={horizontal}>
      <div
        {...props}
        ref={ref}
        data-slot="row"
        data-gutter-x={horizontal}
        data-gutter-y={vertical}
        className={cn(
          "flex min-w-0",
          wrap ? "flex-wrap" : "flex-nowrap",
          align === "top" && "items-start",
          align === "middle" && "items-center",
          align === "bottom" && "items-end",
          align === "stretch" && "items-stretch",
          justify === "center" && "justify-center",
          justify === "end" && "justify-end",
          justify === "space-between" && "justify-between",
          justify === "space-around" && "justify-around",
          justify === "space-evenly" && "justify-evenly",
          className,
        )}
        style={{
          ...style,
          ...(horizontal > 0 ? { marginInline: -horizontal / 2 } : undefined),
          ...(vertical > 0 ? { rowGap: vertical } : undefined),
        }}
      >
        {children}
      </div>
    </RowGutterContext.Provider>
  );
});

export interface ColSize {
  span?: GridSpan;
  offset?: GridSpan;
  order?: number;
  push?: GridSpan;
  pull?: GridSpan;
}
export type ColBreakpointValue = GridSpan | ColSize;

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  span?: GridSpan;
  offset?: GridSpan;
  order?: number;
  push?: GridSpan;
  pull?: GridSpan;
  flex?: CSSProperties["flex"];
  xs?: ColBreakpointValue;
  sm?: ColBreakpointValue;
  md?: ColBreakpointValue;
  lg?: ColBreakpointValue;
  xl?: ColBreakpointValue;
  xxl?: ColBreakpointValue;
}

type ResolvedColSize = Required<Pick<ColSize, "span" | "offset" | "order" | "push" | "pull">>;
type ColVariableStyle = CSSProperties & Record<`--gouno-col-${string}`, string | number>;

function gridUnit(value: number | undefined, fallback: number): GridSpan {
  return Math.min(24, Math.max(0, Math.round(value ?? fallback))) as GridSpan;
}
function breakpointSize(value: ColBreakpointValue | undefined): ColSize {
  return typeof value === "number" ? { span: value } : (value ?? {});
}
function resolveColSize(previous: ResolvedColSize, value?: ColBreakpointValue): ResolvedColSize {
  const next = breakpointSize(value);
  return {
    span: gridUnit(next.span, previous.span),
    offset: gridUnit(next.offset, previous.offset),
    order: next.order ?? previous.order,
    push: gridUnit(next.push, previous.push),
    pull: gridUnit(next.pull, previous.pull),
  };
}
function percent(value: number) {
  return `${(value / 24) * 100}%`;
}

export const Col = forwardRef<HTMLDivElement, ColProps>(function Col(
  { span = 24, offset = 0, order = 0, push = 0, pull = 0, flex, xs, sm, md, lg, xl, xxl, className, style, ...props },
  ref,
) {
  const horizontalGutter = useContext(RowGutterContext);
  const initial: ResolvedColSize = {
    span: gridUnit(span, 24),
    offset: gridUnit(offset, 0),
    order,
    push: gridUnit(push, 0),
    pull: gridUnit(pull, 0),
  };
  const base = resolveColSize(initial, xs);
  const smSize = resolveColSize(base, sm);
  const mdSize = resolveColSize(smSize, md);
  const lgSize = resolveColSize(mdSize, lg);
  const xlSize = resolveColSize(lgSize, xl);
  const xxlSize = resolveColSize(xlSize, xxl);
  const variables = {
    "--gouno-col-basis": percent(base.span),
    "--gouno-col-offset": percent(base.offset),
    "--gouno-col-shift": percent(base.push - base.pull),
    "--gouno-col-order": base.order,
    "--gouno-col-sm-basis": percent(smSize.span),
    "--gouno-col-sm-offset": percent(smSize.offset),
    "--gouno-col-sm-shift": percent(smSize.push - smSize.pull),
    "--gouno-col-sm-order": smSize.order,
    "--gouno-col-md-basis": percent(mdSize.span),
    "--gouno-col-md-offset": percent(mdSize.offset),
    "--gouno-col-md-shift": percent(mdSize.push - mdSize.pull),
    "--gouno-col-md-order": mdSize.order,
    "--gouno-col-lg-basis": percent(lgSize.span),
    "--gouno-col-lg-offset": percent(lgSize.offset),
    "--gouno-col-lg-shift": percent(lgSize.push - lgSize.pull),
    "--gouno-col-lg-order": lgSize.order,
    "--gouno-col-xl-basis": percent(xlSize.span),
    "--gouno-col-xl-offset": percent(xlSize.offset),
    "--gouno-col-xl-shift": percent(xlSize.push - xlSize.pull),
    "--gouno-col-xl-order": xlSize.order,
    "--gouno-col-xxl-basis": percent(xxlSize.span),
    "--gouno-col-xxl-offset": percent(xxlSize.offset),
    "--gouno-col-xxl-shift": percent(xxlSize.push - xxlSize.pull),
    "--gouno-col-xxl-order": xxlSize.order,
  } as ColVariableStyle;
  return (
    <div
      {...props}
      ref={ref}
      data-slot="col"
      data-span={base.span}
      data-sm-span={smSize.span}
      data-md-span={mdSize.span}
      data-lg-span={lgSize.span}
      data-xl-span={xlSize.span}
      data-xxl-span={xxlSize.span}
      className={cn("min-w-0", className)}
      style={{
        ...style,
        ...variables,
        ...(horizontalGutter > 0 ? { paddingInline: horizontalGutter / 2 } : undefined),
        ...(flex !== undefined ? { flex, maxWidth: "none" } : undefined),
      }}
    />
  );
});
