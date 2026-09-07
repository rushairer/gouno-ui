import * as React from "react";
import { cn } from "../lib/utils";
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> { direction?: "row" | "column" | "row-reverse" | "column-reverse"; gap?: number; }
export function Stack({ direction = "column", gap = 16, className, style, ...props }: StackProps) { return <div {...props} style={{ gap, ...style }} className={cn("flex", direction === "column" && "flex-col", direction === "row-reverse" && "flex-row-reverse", direction === "column-reverse" && "flex-col-reverse", className)} />; }
export function Container({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={cn("mx-auto w-full max-w-7xl px-4", className)} />; }
