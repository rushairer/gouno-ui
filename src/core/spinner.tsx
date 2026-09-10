import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/utils";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement>;

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, "aria-hidden": ariaHidden = true, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden={ariaHidden}
      data-slot="spinner"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
    />
  );
});
