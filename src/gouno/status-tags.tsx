import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { Tag, type TagColor } from "../core/tag";

export interface StatusIndicatorProps {
  status: string;
  label: ReactNode;
  className?: string;
}

export interface RiskBadgeProps {
  level: string;
  label: ReactNode;
  className?: string;
}

export interface StatusBadgeProps {
  status?: string;
  children?: ReactNode;
  label?: ReactNode;
  color?: TagColor;
  compact?: boolean;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const color: TagColor = /^(success|published|completed|active|approved|delivered)$/.test(status) ? "success" : /^(danger|failed|rejected|error)$/.test(status) ? "error" : /^(warning|pending|draft|running|waiting_for_user|awaiting_approval)$/.test(status) ? "warning" : "default";
  return <Tag color={color} className={cn(`status-pill--${status}`, className)}>{label}</Tag>;
}

export function RiskBadge({ level, label, className }: RiskBadgeProps) {
  return <Tag className={className} color={["high", "critical"].includes(level) ? "error" : ["medium", "moderate"].includes(level) ? "warning" : "default"}>{label}</Tag>;
}

export function StatusBadge({ status = "draft", children, label, color, compact, className }: StatusBadgeProps) {
  const text = children ?? label ?? ({ published: "已发布", draft: "草稿", scheduled: "定时发布", hidden: "已隐藏" } as Record<string, string>)[status] ?? status;
  return <Tag color={color || (status === "published" ? "success" : status === "failed" ? "error" : status === "pending" ? "warning" : "default")} className={cn(`status-badge status-badge--${status} status-pill`, compact && "compact", className)}>{text}</Tag>;
}
