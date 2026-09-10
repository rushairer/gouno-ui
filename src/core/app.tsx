import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/utils";

export interface AppProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function App({ className, ref, ...props }: AppProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="app"
      className={cn("min-h-full", className)}
    />
  );
}
