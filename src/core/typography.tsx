import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextTone = "default" | "muted" | "danger" | "success";
export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> { level?: HeadingLevel; children?: ReactNode; }
export interface TextProps extends HTMLAttributes<HTMLElement> { as?: ElementType; size?: TextSize; tone?: TextTone; children?: ReactNode; }
export interface TypographyProps extends HTMLAttributes<HTMLElement> { as?: ElementType; }

export function Heading({ level = 2, children, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return <Tag {...props} data-slot="heading" className={cn(level === 1 ? "text-3xl font-semibold tracking-tight" : level === 2 ? "text-2xl font-semibold tracking-tight" : level === 3 ? "text-xl font-semibold" : "text-lg font-semibold", className)}>{children}</Tag>;
}

export function Text({ as: Component = "p", size = "md", tone = "default", children, className, ...props }: TextProps) {
  return <Component {...props} data-slot="text" className={cn(size === "xs" ? "text-xs" : size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base", tone === "muted" && "text-muted-foreground", tone === "danger" && "text-destructive", tone === "success" && "text-success", className)}>{children}</Component>;
}

export function Typography({ as: Component = "p", className, ...props }: TypographyProps) {
  return <Component {...props} data-slot="typography" className={cn("text-sm text-foreground", className)} />;
}
