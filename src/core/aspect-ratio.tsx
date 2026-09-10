import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/utils";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  ref?: Ref<HTMLDivElement>;
}

export function AspectRatio({
  ratio = 16 / 9,
  className,
  children,
  style,
  ref,
  ...props
}: AspectRatioProps) {
  const resolvedRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
  return (
    <div
      {...props}
      ref={ref}
      data-slot="aspect-ratio"
      className={cn("relative w-full", className)}
      style={{ ...style, aspectRatio: resolvedRatio }}
    >
      {children}
    </div>
  );
}
