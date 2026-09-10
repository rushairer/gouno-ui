import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";

export interface SpinProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "aria-busy" | "children"> {
  spinning?: boolean;
  tip?: ReactNode;
  children?: ReactNode;
}

export const Spin = forwardRef<HTMLDivElement, SpinProps>(function Spin(
  { spinning = true, tip, children, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="spin"
      aria-busy={spinning || undefined}
      className={cn("relative", className)}
    >
      {children}
      {spinning ? (
        <div
          data-slot="spin-overlay"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70"
        >
          <Spinner className="size-5 text-primary" />
          {tip ? (
            <span data-slot="spin-tip" className="text-sm text-muted-foreground">
              {tip}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
