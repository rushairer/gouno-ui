import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

/** @deprecated Prefer canonical `Separator`; retained for established Core compatibility. */
export const Divider = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }>(function Divider({ orientation = "horizontal", className, ...props }, ref) {
  return <div ref={ref} role="separator" aria-orientation={orientation} {...props} data-slot="divider" className={cn(orientation === "vertical" ? "h-full w-px" : "h-px w-full", "shrink-0 bg-border", className)} />;
});

export type SpaceAlign = "start" | "end" | "center" | "baseline" | "stretch";
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  align?: SpaceAlign;
  wrap?: boolean;
  /** Stretch the Space container across its parent. Children keep the selected cross-axis alignment. */
  block?: boolean;
  split?: ReactNode;
  children?: ReactNode;
}
export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space({ orientation = "horizontal", gap: gapValue = "md", align, wrap = false, block = false, split, children, className, ...props }, ref) {
  const gap = typeof gapValue === "number" ? `[gap:${gapValue}px]` : ({ xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" } as const)[gapValue];
  // Ant Design leaves align unset by default. Native flexbox then stretches
  // vertical children across the available cross-axis; content-width stacks
  // opt into `align="start"` explicitly.
  const resolvedAlign = align;
  const items = Array.isArray(children) ? children : [children];
  const content = split ? items.flatMap((child, index) => index === 0 ? [child] : [<Fragment key={`space-split-${index}`}>{split}</Fragment>, child]) : children;
  return <div {...props} ref={ref} data-slot="space" data-orientation={orientation} data-block={block || undefined} className={cn(
    "flex min-w-0",
    orientation === "vertical" ? "flex-col" : "flex-row",
    resolvedAlign === "start" && "items-start",
    resolvedAlign === "end" && "items-end",
    resolvedAlign === "center" && "items-center",
    resolvedAlign === "baseline" && "items-baseline",
    resolvedAlign === "stretch" && "items-stretch",
    gap,
    wrap && "flex-wrap",
    block && "w-full",
    className,
  )}>{content}</div>;
});
export interface FlexProps extends HTMLAttributes<HTMLDivElement> { direction?: "row" | "column" | "row-reverse" | "column-reverse"; align?: "start" | "center" | "end" | "stretch"; justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"; gap?: "sm" | "md" | "lg" | number; wrap?: boolean; children?: ReactNode; }
export function Flex({ direction = "row", align, justify, gap = "md", wrap, children, className, ...props }: FlexProps) { return <div {...props} className={cn("flex", direction === "column" && "flex-col", direction === "row-reverse" && "flex-row-reverse", direction === "column-reverse" && "flex-col-reverse", align === "center" && "items-center", align === "end" && "items-end", align === "stretch" && "items-stretch", justify === "center" && "justify-center", justify === "end" && "justify-end", justify === "space-between" && "justify-between", justify === "space-around" && "justify-around", justify === "space-evenly" && "justify-evenly", typeof gap === "number" ? `[gap:${gap}px]` : gap === "sm" ? "gap-2" : gap === "lg" ? "gap-5" : "gap-3", wrap && "flex-wrap", className)}>{children}</div>; }
export function Grid({ columns = "auto", gap = "md", children, className, ...props }: HTMLAttributes<HTMLDivElement> & { columns?: 1|2|3|4|"auto"; gap?: "sm"|"md"|"lg"|number; children?: ReactNode }) { return <div {...props} className={cn("grid", columns === "auto" ? "grid-cols-[repeat(auto-fit,minmax(180px,1fr))]" : `grid-cols-${columns}`, typeof gap === "number" ? `[gap:${gap}px]` : gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4", className)}>{children}</div>; }
