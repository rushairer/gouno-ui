import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";
export function Badge({ tone = "neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) { return <span {...props} className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", tone === "success" && "bg-success-subtle text-success border-success/30", tone === "warning" && "bg-warning-subtle text-warning border-warning/30", tone === "danger" && "bg-danger-subtle text-destructive border-destructive/30", tone === "info" && "bg-info-subtle text-info border-info/30", tone === "brand" && "bg-accent text-accent-foreground border-primary/30", tone === "neutral" && "bg-muted text-muted-foreground border-border", className)} />; }
export const Tag = Badge;
