import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type AppProps = HTMLAttributes<HTMLDivElement>;

export function App({ className, ...props }: AppProps) {
  return <div {...props} className={cn("min-h-full", className)} />;
}
