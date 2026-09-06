import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";
export type BadgeSize = "default" | "small";
export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  count?: ReactNode;
  dot?: boolean;
  showZero?: boolean;
  overflowCount?: number;
  status?: BadgeStatus;
  text?: ReactNode;
  color?: string;
  size?: BadgeSize;
  offset?: [number, number];
  children?: ReactNode;
}

const statusColor: Record<BadgeStatus, string> = {
  success: "bg-success",
  processing: "bg-primary",
  default: "bg-muted-foreground",
  error: "bg-destructive",
  warning: "bg-warning",
};

export function Badge({ count, dot = false, showZero = false, overflowCount = 99, status, text, color, size = "default", offset, children, className, style, title, ...props }: BadgeProps) {
  if ((status || color) && children === undefined && count === undefined && !dot) {
    return <span {...props} className={cn("inline-flex items-center gap-2 text-sm", className)} style={style}>
      <span aria-hidden="true" className={cn("size-2 rounded-full", status && statusColor[status], status === "processing" && "animate-pulse")} style={color ? { backgroundColor: color } : undefined} />
      {text !== undefined ? <span>{text}</span> : null}
    </span>;
  }
  const numericCount = typeof count === "number" ? count : undefined;
  const hidden = !dot && (count === undefined || (numericCount === 0 && !showZero));
  const display = dot ? null : numericCount !== undefined && numericCount > overflowCount ? `${overflowCount}+` : count;
  const indicatorStyle: CSSProperties = { backgroundColor: color, marginTop: offset?.[1], marginInlineStart: offset?.[0] };
  const indicator = hidden ? null : <sup role="status" aria-label={title ?? (dot ? "notification" : String(display))} title={title ?? (display === null ? undefined : String(display))} className={cn("z-10 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm ring-2 ring-background", dot ? "size-2 p-0" : size === "small" ? "min-w-4 px-1 text-[10px] leading-4" : "min-w-5 px-1.5 text-xs leading-5", children && "absolute right-0 top-0 translate-x-1/2 -translate-y-1/2")} style={indicatorStyle}>{display}</sup>;
  if (children !== undefined) return <span {...props} className={cn("relative inline-flex", className)} style={style}>{children}{indicator}</span>;
  return <span {...props} className={cn("inline-flex", className)} style={style}>{indicator}</span>;
}
