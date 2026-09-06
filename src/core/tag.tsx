import { useState, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

export type TagTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";
export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color" | "onChange"> {
  tone?: TagTone;
  color?: string;
  icon?: ReactNode;
  bordered?: boolean;
  closable?: boolean;
  closeIcon?: ReactNode;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  checkable?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}
const toneClass: Record<TagTone, string> = {
  success: "border-success/30 bg-success-subtle text-success",
  warning: "border-warning/30 bg-warning-subtle text-warning",
  danger: "border-destructive/30 bg-danger-subtle text-destructive",
  info: "border-info/30 bg-info-subtle text-info",
  brand: "border-primary/30 bg-accent text-accent-foreground",
  neutral: "border-border bg-muted text-muted-foreground",
};
export function Tag({ tone = "neutral", color, icon, bordered = true, closable, closeIcon, onClose, checkable, checked, defaultChecked = false, onChange, disabled, children, className, style, ...props }: TagProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const selected = checked ?? internalChecked;
  const classes = cn("inline-flex min-h-6 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", bordered && "border", color ? "text-white" : toneClass[tone], checkable && "cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", checkable && selected && "border-primary bg-primary text-primary-foreground", disabled && "pointer-events-none opacity-50", className);
  const content = <>{icon ? <span className="inline-flex [&_svg]:size-3.5" aria-hidden="true">{icon}</span> : null}<span>{children}</span>{closable ? <button type="button" aria-label={`关闭 ${String(children ?? "标签")}`} disabled={disabled} className="-mr-1 inline-flex rounded p-0.5 hover:bg-black/10" onClick={(event) => { event.stopPropagation(); onClose?.(event); }}>{closeIcon ?? <X className="size-3" />}</button> : null}</>;
  if (checkable) return <button {...(props as HTMLAttributes<HTMLButtonElement>)} type="button" role="checkbox" aria-checked={selected} disabled={disabled} className={classes} style={{ ...style, backgroundColor: selected ? undefined : color }} onClick={() => { const next = !selected; if (checked === undefined) setInternalChecked(next); onChange?.(next); }}>{content}</button>;
  return <span {...props} className={classes} style={{ ...style, backgroundColor: color }}>{content}</span>;
}

export type CheckableTagProps = Omit<TagProps, "checkable">;
export function CheckableTag(props: CheckableTagProps) {
  return <Tag {...props} checkable />;
}

export function StatusIndicator({ status, label, className }: { status: string; label: ReactNode; className?: string }) { const tone: TagTone = /^(success|published|completed|active|approved|delivered)$/.test(status) ? "success" : /^(danger|failed|rejected|error)$/.test(status) ? "danger" : /^(warning|pending|draft|running|waiting_for_user|awaiting_approval)$/.test(status) ? "warning" : "neutral"; return <Tag tone={tone} className={cn(`status-pill--${status}`, className)}>{label}</Tag>; }
export function RiskBadge({ level, label, className }: { level: string; label: ReactNode; className?: string }) { return <Tag className={className} tone={["high", "critical"].includes(level) ? "danger" : ["medium", "moderate"].includes(level) ? "warning" : "neutral"}>{label}</Tag>; }
export function StatusBadge({ status = "draft", children, label, tone, compact, className }: { status?: string; children?: ReactNode; label?: ReactNode; tone?: TagTone; compact?: boolean; className?: string }) { const text = children || label || ({ published: "已发布", draft: "草稿", scheduled: "定时发布", hidden: "已隐藏" } as Record<string, string>)[status] || status; return <Tag tone={tone || (status === "published" ? "success" : status === "failed" ? "danger" : status === "pending" ? "warning" : "neutral")} className={cn(`status-badge status-badge--${status} status-pill`, compact && "compact", className)}>{text}</Tag>; }
