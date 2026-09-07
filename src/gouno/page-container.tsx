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
        "mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-6",
        className,
      )}
    />
  );
}
