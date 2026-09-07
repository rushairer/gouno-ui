import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type KbdProps = HTMLAttributes<HTMLElement>;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd {...props} data-slot="kbd" className={cn("rounded border bg-muted px-1.5 py-0.5 font-mono text-xs", className)} />;
}
