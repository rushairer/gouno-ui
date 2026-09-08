import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type CardVariant = "default" | "subtle" | "elevated";
export type CardPadding = "none" | "sm" | "base" | "lg";

/** A visual grouping surface. `interactive` only adds hover styling; use a
 * semantic button or link as the host when the whole card performs an action. */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Retained for compatibility; CardContent does not add padding itself. */
  flush?: boolean;
}
export type CardFooterProps = HTMLAttributes<HTMLElement>;

export function Card({ as: Component = "div", variant = "default", padding = "base", interactive = false, className, ...props }: CardProps) {
  return <Component {...props} data-slot="card" className={cn(
    "ui-card min-w-0 rounded-lg border bg-card text-card-foreground flex flex-col gap-5",
    padding === "sm" ? "p-4" : padding === "lg" ? "p-8" : padding === "none" ? "p-0" : "p-6",
    variant === "subtle" && "bg-muted",
    variant === "elevated" && "bg-raised shadow-raised",
    interactive && "cursor-pointer hover:border-primary",
    className,
  )} />;
}

export function CardHeader({ title, description, action, children, className, ...props }: CardHeaderProps) {
  return <header {...props} data-slot="card-header" className={cn("flex items-start justify-between gap-3", className)}>
    {children !== undefined ? children : <><div>{title !== undefined ? <CardTitle>{title}</CardTitle> : null}{description !== undefined ? <CardDescription>{description}</CardDescription> : null}</div>{action}</>}
  </header>;
}

export const CardTitle = ({ className, ...props }: CardTitleProps) => <h3 {...props} data-slot="card-title" className={cn("text-base font-semibold", className)} />;
export const CardDescription = ({ className, ...props }: CardDescriptionProps) => <p {...props} data-slot="card-description" className={cn("mt-1 text-sm text-muted-foreground", className)} />;
export const CardContent = ({ className, flush: _flush, ...props }: CardContentProps) => <div {...props} data-slot="card-content" className={cn("min-w-0", className)} />;
export const CardFooter = ({ className, ...props }: CardFooterProps) => <footer {...props} data-slot="card-footer" className={cn("flex flex-wrap items-center gap-3", className)} />;