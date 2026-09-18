import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/** Standard content-width and vertical-rhythm container for Gouno product pages. */
export function PageContainer({ className, ...props }: PageContainerProps) {
  return (
    <div
      {...props}
      data-slot="page-container"
      className={cn(
        "layout-page-container mx-auto flex w-full min-w-0 flex-col",
        className,
      )}
    />
  );
}
