import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/utils";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: number;
  ref?: Ref<HTMLDivElement>;
}

export function Stack({
  direction = "column",
  gap = 16,
  className,
  style,
  ref,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="stack"
      style={{ gap, ...style }}
      className={cn(
        "flex",
        direction === "column" && "flex-col",
        direction === "row-reverse" && "flex-row-reverse",
        direction === "column-reverse" && "flex-col-reverse",
        className,
      )}
    />
  );
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Container({ className, ref, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="container"
      className={cn("mx-auto w-full max-w-7xl px-4", className)}
    />
  );
}
