import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type KbdProps = HTMLAttributes<HTMLElement>;

/**
 * Semantic keyboard-input label. Kbd intentionally stays a thin native
 * element: shortcut grouping, separators and platform-specific copy remain
 * caller-owned content rather than hidden component behavior.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...props },
  ref,
) {
  return (
    <kbd
      {...props}
      ref={ref}
      data-slot="kbd"
      className={cn(
        "inline-flex min-h-5 items-center justify-center rounded border bg-muted px-1.5 py-0.5 font-mono text-xs leading-none text-foreground",
        className,
      )}
    />
  );
});
