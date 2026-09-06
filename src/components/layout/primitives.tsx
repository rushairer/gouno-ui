import * as React from "react";
import { cn } from "../../lib/utils";
export function Stack({ direction = "column", gap = 4, className, ...p }: React.HTMLAttributes<HTMLDivElement> & { direction?: "row"|"column"; gap?: number }) { return <div {...p} className={cn("flex", direction === "column" ? "flex-col" : "flex-row", `gap-${gap}`, className)} />; }
export function Container({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={cn("mx-auto w-full max-w-7xl px-4", className)} />; }
