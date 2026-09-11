from pathlib import Path


def write(path: str, content: str) -> None:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def replace(path: str, old: str, new: str) -> None:
    target = Path(path)
    text = target.read_text(encoding="utf-8")
    if old not in text:
        raise SystemExit(f"missing replacement marker in {path}: {old[:80]!r}")
    target.write_text(text.replace(old, new, 1), encoding="utf-8")


def replace_between(path: str, start: str, end: str, replacement: str) -> None:
    target = Path(path)
    text = target.read_text(encoding="utf-8")
    i = text.index(start)
    j = text.index(end, i)
    target.write_text(text[:i] + replacement + text[j:], encoding="utf-8")


write(
    "src/components/primitives/avatar.tsx",
    '''"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar as AvatarPrimitive } from "radix-ui";

type AvatarPrimitiveSize =
  | "small"
  | "middle"
  | "large"
  | number
  | "sm"
  | "default"
  | "lg";
type AvatarPrimitiveShape = "circle" | "square";

type AvatarRootProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  size?: AvatarPrimitiveSize;
  shape?: AvatarPrimitiveShape;
};

function normalizeSize(size: AvatarPrimitiveSize) {
  if (typeof size === "number") return Math.max(0, size);
  if (size === "sm") return "small" as const;
  if (size === "default") return "middle" as const;
  if (size === "lg") return "large" as const;
  return size;
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarRootProps
>(function Avatar(
  { className, size = "middle", shape = "circle", style, ...props },
  ref,
) {
  const resolvedSize = normalizeSize(size);
  const numericSize = typeof resolvedSize === "number" ? resolvedSize : undefined;

  return (
    <AvatarPrimitive.Root
      {...props}
      ref={ref}
      data-slot="avatar"
      data-size={numericSize === undefined ? resolvedSize : "custom"}
      data-shape={shape}
      className={cn(
        "group/avatar relative flex shrink-0 overflow-hidden select-none",
        numericSize === undefined && resolvedSize === "small" && "size-6",
        numericSize === undefined && resolvedSize === "middle" && "size-8",
        numericSize === undefined && resolvedSize === "large" && "size-10",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className,
      )}
      style={{
        ...style,
        ...(numericSize !== undefined
          ? { width: numericSize, height: numericSize }
          : undefined),
      }}
    />
  );
});

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      {...props}
      ref={ref}
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
    />
  );
});

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted text-sm text-muted-foreground",
        "group-data-[size=small]/avatar:text-xs",
        className,
      )}
    />
  );
});

const AvatarBadge = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  function AvatarBadge({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        data-slot="avatar-badge"
        className={cn(
          "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
          "group-data-[size=small]/avatar:size-2 group-data-[size=small]/avatar:[&>svg]:hidden",
          "group-data-[size=middle]/avatar:size-2.5 group-data-[size=middle]/avatar:[&>svg]:size-2",
          "group-data-[size=large]/avatar:size-3 group-data-[size=large]/avatar:[&>svg]:size-2",
          className,
        )}
      />
    );
  },
);

const AvatarGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function AvatarGroup({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        data-slot="avatar-group"
        className={cn(
          "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
          className,
        )}
      />
    );
  },
);

const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function AvatarGroupCount({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background",
        "group-has-data-[size=large]/avatar-group:size-10 group-has-data-[size=small]/avatar-group:size-6",
        "[&>svg]:size-4 group-has-data-[size=large]/avatar-group:[&>svg]:size-5 group-has-data-[size=small]/avatar-group:[&>svg]:size-3",
        className,
      )}
    />
  );
});

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
''',
)

write(
    "src/core/avatar.tsx",
    '''import {
  Children,
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Avatar as PrimitiveAvatar,
  AvatarBadge as PrimitiveAvatarBadge,
  AvatarFallback as PrimitiveAvatarFallback,
  AvatarGroup as PrimitiveAvatarGroup,
  AvatarGroupCount as PrimitiveAvatarGroupCount,
  AvatarImage as PrimitiveAvatarImage,
} from "../components/primitives/avatar";
import type { ControlSize } from "./control-types";

export type AvatarSize = ControlSize | number;
export type AvatarShape = "circle" | "square";
/** @deprecated Use `small`, `middle`, `large`, or a numeric size. */
export type AvatarLegacySize = "sm" | "default" | "lg";

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof PrimitiveAvatar>, "size" | "shape"> {
  size?: AvatarSize | AvatarLegacySize;
  shape?: AvatarShape;
}

export const Avatar = forwardRef<
  React.ComponentRef<typeof PrimitiveAvatar>,
  AvatarProps
>(function Avatar(props, ref) {
  return <PrimitiveAvatar {...props} ref={ref} />;
});

export const AvatarImage = PrimitiveAvatarImage;
export const AvatarFallback = PrimitiveAvatarFallback;
export const AvatarBadge = PrimitiveAvatarBadge;
export const AvatarGroupCount = PrimitiveAvatarGroupCount;

export type AvatarImageProps = ComponentProps<typeof AvatarImage>;
export type AvatarFallbackProps = ComponentProps<typeof AvatarFallback>;
export type AvatarBadgeProps = ComponentProps<typeof AvatarBadge>;
export type AvatarGroupCountProps = ComponentProps<typeof AvatarGroupCount>;

export interface AvatarGroupProps
  extends Omit<ComponentPropsWithoutRef<typeof PrimitiveAvatarGroup>, "children"> {
  children?: ReactNode;
  max?: number;
  overflowRender?: (omittedCount: number) => ReactNode;
}

export const AvatarGroup = forwardRef<
  React.ComponentRef<typeof PrimitiveAvatarGroup>,
  AvatarGroupProps
>(function AvatarGroup({ children, max, overflowRender, ...props }, ref) {
  const items = Children.toArray(children);
  const finiteMax =
    max !== undefined && Number.isFinite(max)
      ? Math.max(1, Math.floor(max))
      : undefined;
  const hasOverflow = finiteMax !== undefined && items.length > finiteMax;
  const visibleCount = hasOverflow ? Math.max(0, finiteMax - 1) : items.length;
  const omittedCount = items.length - visibleCount;

  return (
    <PrimitiveAvatarGroup
      {...props}
      ref={ref}
      data-max={finiteMax}
      data-overflow={hasOverflow || undefined}
    >
      {items.slice(0, visibleCount)}
      {hasOverflow ? (
        <PrimitiveAvatarGroupCount>
          {overflowRender ? overflowRender(omittedCount) : `+${omittedCount}`}
        </PrimitiveAvatarGroupCount>
      ) : null}
    </PrimitiveAvatarGroup>
  );
});
''',
)

write(
    "src/core/layout.tsx",
    '''import {
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
''',
)

base_css = Path("src/base.css").read_text(encoding="utf-8")
marker = "/* Core 24-column Row/Col responsive contract. */"
if marker not in base_css:
    base_css += '''

@layer components {
  /* Core 24-column Row/Col responsive contract. */
  [data-slot="col"] {
    box-sizing: border-box;
    position: relative;
    flex: 0 0 var(--gouno-col-basis);
    max-width: var(--gouno-col-basis);
    margin-inline-start: var(--gouno-col-offset);
    inset-inline-start: var(--gouno-col-shift);
    order: var(--gouno-col-order);
  }
  [data-slot="col"][data-span="0"] { display: none; }
  @media (min-width: 640px) {
    [data-slot="col"] { flex-basis: var(--gouno-col-sm-basis); max-width: var(--gouno-col-sm-basis); margin-inline-start: var(--gouno-col-sm-offset); inset-inline-start: var(--gouno-col-sm-shift); order: var(--gouno-col-sm-order); }
    [data-slot="col"][data-sm-span="0"] { display: none; }
    [data-slot="col"]:not([data-sm-span="0"]) { display: block; }
  }
  @media (min-width: 768px) {
    [data-slot="col"] { flex-basis: var(--gouno-col-md-basis); max-width: var(--gouno-col-md-basis); margin-inline-start: var(--gouno-col-md-offset); inset-inline-start: var(--gouno-col-md-shift); order: var(--gouno-col-md-order); }
    [data-slot="col"][data-md-span="0"] { display: none; }
    [data-slot="col"]:not([data-md-span="0"]) { display: block; }
  }
  @media (min-width: 1024px) {
    [data-slot="col"] { flex-basis: var(--gouno-col-lg-basis); max-width: var(--gouno-col-lg-basis); margin-inline-start: var(--gouno-col-lg-offset); inset-inline-start: var(--gouno-col-lg-shift); order: var(--gouno-col-lg-order); }
    [data-slot="col"][data-lg-span="0"] { display: none; }
    [data-slot="col"]:not([data-lg-span="0"]) { display: block; }
  }
  @media (min-width: 1280px) {
    [data-slot="col"] { flex-basis: var(--gouno-col-xl-basis); max-width: var(--gouno-col-xl-basis); margin-inline-start: var(--gouno-col-xl-offset); inset-inline-start: var(--gouno-col-xl-shift); order: var(--gouno-col-xl-order); }
    [data-slot="col"][data-xl-span="0"] { display: none; }
    [data-slot="col"]:not([data-xl-span="0"]) { display: block; }
  }
  @media (min-width: 1536px) {
    [data-slot="col"] { flex-basis: var(--gouno-col-xxl-basis); max-width: var(--gouno-col-xxl-basis); margin-inline-start: var(--gouno-col-xxl-offset); inset-inline-start: var(--gouno-col-xxl-shift); order: var(--gouno-col-xxl-order); }
    [data-slot="col"][data-xxl-span="0"] { display: none; }
    [data-slot="col"]:not([data-xxl-span="0"]) { display: block; }
  }
}
'''
    Path("src/base.css").write_text(base_css, encoding="utf-8")

replace(
    "src/core/index.ts",
    'export { Avatar, AvatarImage, AvatarFallback, type AvatarProps, type AvatarImageProps, type AvatarFallbackProps } from "./avatar";',
    'export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, type AvatarProps, type AvatarImageProps, type AvatarFallbackProps, type AvatarBadgeProps, type AvatarGroupProps, type AvatarGroupCountProps, type AvatarSize, type AvatarShape, type AvatarLegacySize } from "./avatar";',
)
replace("src/core/index.ts", "  Grid,\n  type SpaceProps,", "  Grid,\n  Row,\n  Col,\n  type SpaceProps,")
replace(
    "src/core/index.ts",
    '  type FlexWrap,\n} from "./layout";',
    '  type FlexWrap,\n  type GridSpan,\n  type GridBreakpoint,\n  type RowProps,\n  type RowAlign,\n  type RowJustify,\n  type RowGutter,\n  type ColProps,\n  type ColSize,\n  type ColBreakpointValue,\n} from "./layout";',
)

replace(
    "showcase/core-family-coverage.ts",
    '  AvatarFallback: {\n    familyId: "core-avatar",\n    review: "covered",\n    note: "Reviewed as required Avatar compound anatomy together with AvatarImage.",\n  },',
    '  AvatarFallback: {\n    familyId: "core-avatar",\n    review: "covered",\n    note: "Reviewed as required Avatar compound anatomy together with AvatarImage.",\n  },\n  AvatarBadge: { familyId: "core-avatar", review: "covered" },\n  AvatarGroup: { familyId: "core-avatar", review: "covered" },\n  AvatarGroupCount: { familyId: "core-avatar", review: "covered" },',
)
replace(
    "showcase/core-family-coverage.ts",
    '  Grid: { familyId: "core-grid", review: "covered" },',
    '  Grid: { familyId: "core-grid", review: "covered" },\n  Row: { familyId: "core-grid", review: "covered" },\n  Col: { familyId: "core-grid", review: "covered" },',
)
replace("showcase/component-progress.ts", '  "core-tag",\n  "core-space",', '  "core-tag",\n  "core-avatar",\n  "core-space",')
replace("showcase/component-progress.ts", '  "core-flex",\n  "core-separator",', '  "core-flex",\n  "core-grid",\n  "core-separator",')
replace(
    "tests/component-progress.test.ts",
    '      "core-space",\n      "core-flex",',
    '      "core-avatar",\n      "core-space",\n      "core-flex",\n      "core-grid",',
)
replace("showcase/catalog.tsx", '    item("core-avatar", "Avatar", "头像", 82, <CircleUserRound />),', '    item("core-avatar", "Avatar", "头像", 100, <CircleUserRound />),')
replace("showcase/catalog.tsx", '    item("core-grid", "Grid", "网格", 72, <Grid3X3 />),', '    item("core-grid", "Grid", "网格", 100, <Grid3X3 />),')

write(
    "showcase/demos/core/avatar/avatar-0.tsx",
    '''import { Avatar, AvatarFallback, AvatarImage, Space } from "../../../../src/core";

export default function AvatarDemo() {
  return (
    <Space wrap align="center">
      <Avatar size="small"><AvatarFallback>S</AvatarFallback></Avatar>
      <Avatar size="middle"><AvatarFallback>M</AvatarFallback></Avatar>
      <Avatar size="large" shape="square"><AvatarFallback>L</AvatarFallback></Avatar>
      <Avatar size={48}>
        <AvatarImage src="https://github.com/rushairer.png" alt="Gouno 用户头像" />
        <AvatarFallback>GU</AvatarFallback>
      </Avatar>
    </Space>
  );
}
''',
)
write(
    "showcase/demos/core/avatar/avatar-1.tsx",
    '''import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, Space, Text } from "../../../../src/core";

const members = ["AB", "CD", "EF", "GH", "IJ", "KL"];

export default function AvatarGroupDemo() {
  return (
    <Space orientation="vertical" gap="lg" align="start">
      <AvatarGroup max={4} overflowRender={(count) => `+${count}`}>
        {members.map((member) => (
          <Avatar key={member} size="middle"><AvatarFallback>{member}</AvatarFallback></Avatar>
        ))}
      </AvatarGroup>
      <Space align="center">
        <Avatar size="middle"><AvatarFallback>AB</AvatarFallback><AvatarBadge aria-label="在线" /></Avatar>
        <Text tone="muted">Badge 的可访问名称由调用方按业务语义提供。</Text>
      </Space>
    </Space>
  );
}
''',
)
write(
    "showcase/demos/core/grid/grid-0.tsx",
    '''import { Card, Grid } from "../../../../src/core";

export default function GridDemo() {
  return (
    <Grid columns={3} gap="md">
      {[1, 2, 3].map((item) => <Card key={item} padding="sm">Card {item}</Card>)}
    </Grid>
  );
}
''',
)
write(
    "showcase/demos/core/grid/grid-1.tsx",
    '''import { Card, Col, Row } from "../../../../src/core";

export default function ResponsiveGridDemo() {
  return (
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4].map((item) => (
        <Col key={item} xs={24} sm={12} lg={6}><Card padding="sm">Col {item}</Card></Col>
      ))}
    </Row>
  );
}
''',
)

replace(
    "showcase/demos/core/surface-review-5a.tsx",
    'import AvatarDemoSource from "./avatar/avatar-0.tsx?raw";\n',
    'import AvatarDemoSource from "./avatar/avatar-0.tsx?raw";\nimport AvatarGroupDemo from "./avatar/avatar-1";\nimport AvatarGroupDemoSource from "./avatar/avatar-1.tsx?raw";\n',
)
avatar_block = '''  avatar: {
    ...generalDocuments.avatar,
    description:
      "Avatar 使用 Gouno 统一 small/middle/large 尺寸语义，也接受显式像素尺寸；shape 控制圆形/方形。Image/Fallback/Badge/Group/GroupCount 组成同一 compound family，Group 的 max 只拥有可见槽位与溢出计数，不拥有业务成员逻辑。",
    code: canonicalCoreSource(AvatarDemoSource),
    render: () => <AvatarDemo />,
    demos: [
      {
        title: "头像组、溢出与状态 Badge",
        description:
          "AvatarGroup.max 把最后一个可见槽位留给溢出计数；overflowRender 只定制计数内容。Badge 的业务语义与 accessible name 继续由调用方提供。",
        code: canonicalCoreSource(AvatarGroupDemoSource),
        render: () => <AvatarGroupDemo />,
      },
    ],
    api: [
      { name: "size", description: "Gouno ControlSize 或显式像素；sm/default/lg 仅作为 0.2.x 兼容别名。", type: '"small" | "middle" | "large" | number | "sm" | "default" | "lg"', defaultValue: '"middle"' },
      { name: "shape", description: "头像几何形态。", type: '"circle" | "square"', defaultValue: '"circle"' },
      { name: "children", description: "组合 AvatarImage / AvatarFallback / AvatarBadge。", type: "ReactNode" },
      { name: "className", description: "扩展 Avatar root 样式。", type: "string" },
      { name: "ref", description: "指向真实 Avatar root。", type: "Ref<HTMLElement>" },
    ],
    apiSections: [
      {
        title: "AvatarGroup API",
        rows: [
          { name: "max", description: "最多显示的槽位数；发生溢出时最后一格显示计数。", type: "number" },
          { name: "overflowRender", description: "按 omittedCount 自定义溢出槽内容。", type: "(omittedCount: number) => ReactNode" },
          { name: "children", description: "Avatar 子项。", type: "ReactNode" },
          { name: "...div props", description: "透传标准 div/ARIA/data/event 属性。", type: "HTMLAttributes<HTMLDivElement>" },
          { name: "ref", description: "指向真实 AvatarGroup div。", type: "Ref<HTMLDivElement>" },
        ],
      },
      {
        title: "AvatarImage / AvatarFallback / AvatarBadge API",
        rows: [
          { name: "AvatarImage", description: "图片层；支持 src/alt 及标准 image primitive 属性，ref 指向真实 img。", type: "AvatarImageProps" },
          { name: "AvatarFallback", description: "图片不可用时的文字/图标回退；支持 delayMs。", type: "AvatarFallbackProps" },
          { name: "AvatarBadge", description: "头像角标视觉槽；业务状态与可访问名称由调用方提供。", type: "AvatarBadgeProps" },
          { name: "AvatarGroupCount", description: "手动组合头像组计数时使用；AvatarGroup.max 会自动使用同一视觉槽。", type: "AvatarGroupCountProps" },
        ],
      },
    ],
  },
'''
replace_between("showcase/demos/core/surface-review-5a.tsx", "  avatar: {\n", "  separator: {\n", avatar_block)

replace("showcase/demos/core/layout.tsx", 'import { Card, Grid, Space, Splitter } from "../../../src/core";', 'import { Space, Splitter } from "../../../src/core";')
replace(
    "showcase/demos/core/layout.tsx",
    'import FlexWrapDemoSource from "./flex/flex-1.tsx?raw";\n',
    'import FlexWrapDemoSource from "./flex/flex-1.tsx?raw";\nimport GridDemo from "./grid/grid-0";\nimport GridDemoSource from "./grid/grid-0.tsx?raw";\nimport ResponsiveGridDemo from "./grid/grid-1";\nimport ResponsiveGridDemoSource from "./grid/grid-1.tsx?raw";\n',
)
grid_block = '''  grid: {
    title: "Grid 网格",
    description:
      "同一 family 提供两层能力：Grid 是简单 CSS Grid helper；Row/Col 是 24 栅格布局。Row 拥有 gutter/对齐/换行，Col 拥有 span/offset/order/push/pull/flex 与 xs-sm-md-lg-xl-xxl 响应式覆盖。",
    code: canonicalCoreSource(GridDemoSource),
    render: () => <GridDemo />,
    demos: [
      {
        title: "24 栅格与响应式 Col",
        description:
          "响应式断点沿用 Gouno/Tailwind 640/768/1024/1280/1536 体系；每个更大断点继承上一档未覆盖的字段。",
        code: canonicalCoreSource(ResponsiveGridDemoSource),
        render: () => <ResponsiveGridDemo />,
      },
    ],
    api: [
      { name: "columns", description: "Grid helper 的固定列数或 auto-fit。", type: '1 | 2 | 3 | 4 | "auto"', defaultValue: '"auto"' },
      { name: "gap", description: "Grid helper 的间距 token 或像素值；数字通过 style 生效。", type: '"sm" | "md" | "lg" | number', defaultValue: '"md"' },
      { name: "...div props", description: "Grid helper 透传标准 div 属性并支持真实 ref。", type: "HTMLAttributes<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "Row API",
        rows: [
          { name: "gutter", description: "水平 gutter，或 [horizontal, vertical]；由 Row/Col 结构共同拥有。", type: "number | [number, number]", defaultValue: "0" },
          { name: "align", description: "交叉轴对齐。", type: '"top" | "middle" | "bottom" | "stretch"', defaultValue: '"top"' },
          { name: "justify", description: "主轴分布。", type: '"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"', defaultValue: '"start"' },
          { name: "wrap", description: "是否允许 Col 换行。", type: "boolean", defaultValue: "true" },
          { name: "ref", description: "指向真实 Row div。", type: "Ref<HTMLDivElement>" },
        ],
      },
      {
        title: "Col API",
        rows: [
          { name: "span", description: "占用 0-24 栅格；0 隐藏。", type: "GridSpan", defaultValue: "24" },
          { name: "offset / push / pull", description: "0-24 栅格偏移与视觉位移。", type: "GridSpan", defaultValue: "0" },
          { name: "order", description: "Flex order。", type: "number", defaultValue: "0" },
          { name: "flex", description: "需要自由伸缩时覆盖固定 span 的 flex shorthand。", type: "CSSProperties['flex']" },
          { name: "xs / sm / md / lg / xl / xxl", description: "响应式 span 数值或 ColSize；按断点逐级继承。", type: "GridSpan | ColSize" },
          { name: "ref", description: "指向真实 Col div。", type: "Ref<HTMLDivElement>" },
        ],
      },
    ],
  },
'''
replace_between("showcase/demos/core/layout.tsx", "  grid: {\n", "  separator: {\n", grid_block)

write(
    "tests/core-avatar-grid-6b1.test.tsx",
    '''import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, Col, Grid, Row } from "../src/core";

function cssNumber(element: HTMLElement, name: string) {
  return Number.parseFloat(element.style.getPropertyValue(name));
}

describe("Core Avatar/Grid batch 6B1", () => {
  it("uses canonical Avatar sizes, shape, numeric sizing and a real root ref", () => {
    const ref = createRef<HTMLElement>();
    const { rerender } = render(
      <Avatar ref={ref} size="small" shape="square" data-testid="avatar"><AvatarFallback>AB</AvatarFallback></Avatar>,
    );
    const avatar = screen.getByTestId("avatar");
    expect(ref.current).toBe(avatar);
    expect(avatar.dataset.size).toBe("small");
    expect(avatar.dataset.shape).toBe("square");
    expect(avatar.className).toContain("size-6");
    expect(avatar.className).toContain("rounded-md");
    rerender(<Avatar size="lg" data-testid="avatar"><AvatarFallback>AB</AvatarFallback></Avatar>);
    expect(screen.getByTestId("avatar").dataset.size).toBe("large");
    rerender(<Avatar size={48} data-testid="avatar"><AvatarFallback>AB</AvatarFallback></Avatar>);
    expect(screen.getByTestId("avatar").style.width).toBe("48px");
    expect(screen.getByTestId("avatar").style.height).toBe("48px");
  });

  it("keeps AvatarGroup overflow bounded and caller-owned", () => {
    render(
      <AvatarGroup max={3} overflowRender={(count) => `还有 ${count}`} data-testid="group">
        {['A', 'B', 'C', 'D'].map((label) => <Avatar key={label}><AvatarFallback>{label}</AvatarFallback></Avatar>)}
      </AvatarGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.dataset.max).toBe("3");
    expect(group.dataset.overflow).toBe("true");
    expect(group.children).toHaveLength(3);
    expect(screen.getByText("还有 2").dataset.slot).toBe("avatar-group-count");
  });

  it("keeps AvatarBadge as a standard caller-labelled semantic slot", () => {
    render(<Avatar><AvatarFallback>AB</AvatarFallback><AvatarBadge aria-label="在线" /></Avatar>);
    expect(screen.getByLabelText("在线").dataset.slot).toBe("avatar-badge");
  });

  it("keeps Grid helper ref-safe and applies numeric gap through style", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref} columns={3} gap={11} data-testid="grid"><div>A</div></Grid>);
    const grid = screen.getByTestId("grid");
    expect(ref.current).toBe(grid);
    expect(grid.dataset.slot).toBe("grid");
    expect(grid.dataset.columns).toBe("3");
    expect(grid.style.gap).toBe("11px");
  });

  it("maps Row gutter and cumulative responsive 24-grid Col variables", () => {
    render(
      <Row gutter={[16, 8]} data-testid="row">
        <Col xs={12} sm={8} md={{ span: 6, offset: 2, order: 3, push: 1 }} data-testid="col" />
      </Row>,
    );
    const row = screen.getByTestId("row");
    const col = screen.getByTestId("col");
    expect(row.style.marginInline).toBe("-8px");
    expect(row.style.rowGap).toBe("8px");
    expect(col.style.paddingInline).toBe("8px");
    expect(col.dataset.span).toBe("12");
    expect(col.dataset.smSpan).toBe("8");
    expect(col.dataset.mdSpan).toBe("6");
    expect(col.dataset.lgSpan).toBe("6");
    expect(cssNumber(col, "--gouno-col-basis")).toBeCloseTo(50);
    expect(cssNumber(col, "--gouno-col-sm-basis")).toBeCloseTo(100 / 3);
    expect(cssNumber(col, "--gouno-col-md-offset")).toBeCloseTo(100 / 12);
    expect(cssNumber(col, "--gouno-col-md-shift")).toBeCloseTo(100 / 24);
    expect(col.style.getPropertyValue("--gouno-col-lg-order")).toBe("3");
  });
});
''',
)
