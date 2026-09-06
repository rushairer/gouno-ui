import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
export function Divider({ orientation = "horizontal", className, ...props }: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal"|"vertical" }) { return <div role="separator" aria-orientation={orientation} {...props} className={cn(orientation === "vertical" ? "h-full w-px" : "h-px w-full", "shrink-0 bg-border", className)} />; }
export type SpaceAlign = "start" | "end" | "center" | "baseline" | "stretch";
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  align?: SpaceAlign;
  wrap?: boolean;
  /** Stretch the Space container across its parent. Children keep the selected cross-axis alignment. */
  block?: boolean;
  split?: ReactNode;
  children?: ReactNode;
}
export function Space({ direction = "horizontal", size = "md", align, wrap = false, block = false, split, children, className, ...props }: SpaceProps) {
  const gap = typeof size === "number" ? `[gap:${size}px]` : ({ xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" } as const)[size];
  const resolvedAlign = align ?? (direction === "vertical" ? "start" : undefined);
  const items = Array.isArray(children) ? children : [children];
  const content = split ? items.flatMap((child, index) => index === 0 ? [child] : [split, child]) : children;
  return <div {...props} data-slot="space" data-direction={direction} data-block={block || undefined} className={cn(
    "flex min-w-0",
    direction === "vertical" ? "flex-col" : "flex-row",
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
}
export function Flex({ vertical = false, align, justify, gap = "md", wrap, children, className, ...props }: HTMLAttributes<HTMLDivElement> & { vertical?: boolean; align?: "start"|"center"|"end"|"stretch"; justify?: "start"|"center"|"end"|"between"; gap?: "sm"|"md"|"lg"|number; wrap?: boolean; children?: ReactNode }) { return <div {...props} className={cn("flex", vertical ? "flex-col" : "flex-row", align === "center" && "items-center", align === "end" && "items-end", align === "stretch" && "items-stretch", justify === "center" && "justify-center", justify === "end" && "justify-end", justify === "between" && "justify-between", typeof gap === "number" ? `[gap:${gap}px]` : gap === "sm" ? "gap-2" : gap === "lg" ? "gap-5" : "gap-3", wrap && "flex-wrap", className)}>{children}</div>; }
export function Grid({ columns = "auto", gap = "md", children, className, ...props }: HTMLAttributes<HTMLDivElement> & { columns?: 1|2|3|4|"auto"; gap?: "sm"|"md"|"lg"|number; children?: ReactNode }) { return <div {...props} className={cn("grid", columns === "auto" ? "grid-cols-[repeat(auto-fit,minmax(180px,1fr))]" : `grid-cols-${columns}`, typeof gap === "number" ? `[gap:${gap}px]` : gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4", className)}>{children}</div>; }
