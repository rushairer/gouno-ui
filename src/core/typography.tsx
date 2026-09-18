import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingVariant =
  | "display"
  | "hero"
  | "page"
  | "task"
  | "section"
  | "subsection"
  | "compact";
export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextTone = "default" | "muted" | "danger" | "success";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  children?: ReactNode;
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  tone?: TextTone;
  children?: ReactNode;
}

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

const headingVariantClass: Record<HeadingVariant, string> = {
  display: "text-display-title font-title tracking-title",
  hero: "text-task-title font-title tracking-title sm:text-page-title",
  page: "text-page-title font-title tracking-title",
  task: "text-task-title font-title tracking-title",
  section: "text-section-title font-title tracking-section-title",
  subsection: "text-subsection-title font-title",
  compact: "text-compact-title font-title",
};

const defaultHeadingVariant: Record<HeadingLevel, HeadingVariant> = {
  1: "page",
  2: "task",
  3: "section",
  4: "subsection",
  5: "subsection",
  6: "subsection",
};

const textSizeClass: Record<TextSize, string> = {
  xs: "text-caption",
  sm: "text-body-sm",
  md: "text-body",
  lg: "text-body-lg",
};

const textSizeRole: Record<TextSize, string> = {
  xs: "caption",
  sm: "body-sm",
  md: "body",
  lg: "body-lg",
};

export function Heading({
  level = 2,
  variant,
  children,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  const resolvedVariant = variant ?? defaultHeadingVariant[level];

  return (
    <Tag
      {...props}
      data-slot="heading"
      data-typography-role={resolvedVariant}
      className={cn(headingVariantClass[resolvedVariant], className)}
    >
      {children}
    </Tag>
  );
}

export function Text({
  as: Component = "p",
  size = "md",
  tone = "default",
  children,
  className,
  ...props
}: TextProps) {
  return (
    <Component
      {...props}
      data-slot="text"
      data-typography-role={textSizeRole[size]}
      className={cn(
        textSizeClass[size],
        tone === "muted" && "text-muted-foreground",
        tone === "danger" && "text-destructive",
        tone === "success" && "text-success",
        className,
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Compatibility base host for lightweight text-only markup.
 * New product copy should prefer Heading or Text so semantic typography roles
 * stay explicit.
 */
export function Typography({
  as: Component = "p",
  className,
  ...props
}: TypographyProps) {
  return (
    <Component
      {...props}
      data-slot="typography"
      data-typography-role="body-sm"
      className={cn("text-body-sm text-foreground", className)}
    />
  );
}
