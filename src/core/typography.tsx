import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingVariant =
  | "display"
  | "hero"
  | "page"
  | "task"
  | "section-lg"
  | "section"
  | "subsection"
  | "compact"
  | "label"
  | "micro";
export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextTone = "default" | "muted" | "danger" | "success";
export type TextWeight = "regular" | "medium" | "semibold";
export type TextFamily = "sans" | "mono";
export type TextLeading = "default" | "relaxed";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  "data-slot"?: string;
  level?: HeadingLevel;
  variant?: HeadingVariant;
  children?: ReactNode;
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  "data-slot"?: string;
  as?: ElementType;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  family?: TextFamily;
  leading?: TextLeading;
  children?: ReactNode;
}

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  "data-slot"?: string;
  as?: ElementType;
}

const headingVariantClass: Record<HeadingVariant, string> = {
  display: "type-display-title",
  hero: "type-hero-title",
  page: "type-page-title",
  task: "type-task-title",
  "section-lg": "type-section-lg-title",
  section: "type-section-title",
  subsection: "type-subsection-title",
  compact: "type-compact-title",
  label: "type-label-title",
  micro: "type-micro-title",
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
  xs: "type-caption",
  sm: "type-body-sm",
  md: "type-body",
  lg: "type-body-lg",
};

const textSizeRole: Record<TextSize, string> = {
  xs: "caption",
  sm: "body-sm",
  md: "body",
  lg: "body-lg",
};

const textWeightClass: Record<TextWeight, string> = {
  regular: "type-weight-regular",
  medium: "type-weight-medium",
  semibold: "type-weight-semibold",
};

const textFamilyClass: Record<TextFamily, string> = {
  sans: "type-family-sans",
  mono: "type-family-mono",
};

export function Heading({
  level = 2,
  variant,
  children,
  className,
  "data-slot": dataSlot = "heading",
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  const resolvedVariant = variant ?? defaultHeadingVariant[level];

  return (
    <Tag
      {...props}
      data-slot={dataSlot}
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
  weight,
  family,
  leading = "default",
  children,
  className,
  "data-slot": dataSlot = "text",
  ...props
}: TextProps) {
  return (
    <Component
      {...props}
      data-slot={dataSlot}
      data-typography-role={textSizeRole[size]}
      data-typography-weight={weight}
      data-typography-family={family}
      data-typography-leading={leading}
      className={cn(
        textSizeClass[size],
        weight && textWeightClass[weight],
        family && textFamilyClass[family],
        leading === "relaxed" && "type-leading-relaxed",
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
  "data-slot": dataSlot = "typography",
  ...props
}: TypographyProps) {
  return (
    <Component
      {...props}
      data-slot={dataSlot}
      data-typography-role="body-sm"
      className={cn("type-body-sm text-foreground", className)}
    />
  );
}
