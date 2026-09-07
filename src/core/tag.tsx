import { useState, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

export type TagColor = "default" | "primary" | "success" | "warning" | "error" | "info";
export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color" | "onChange"> {
  /** A semantic color, or a CSS color string for a custom background. */
  color?: TagColor | string;
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
const colorClass: Record<TagColor, string> = {
  success: "border-success/30 bg-success-subtle text-success",
  warning: "border-warning/30 bg-warning-subtle text-warning",
  error: "border-destructive/30 bg-danger-subtle text-destructive",
  info: "border-info/30 bg-info-subtle text-info",
  primary: "border-primary/30 bg-accent text-accent-foreground",
  default: "border-border bg-muted text-muted-foreground",
};
function isSemanticColor(color: TagProps["color"]): color is TagColor {
  return typeof color === "string" && color in colorClass;
}
export function Tag({ color = "default", icon, bordered = true, closable, closeIcon, onClose, checkable, checked, defaultChecked = false, onChange, disabled, children, className, style, ...props }: TagProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const selected = checked ?? internalChecked;
  const semanticColor = isSemanticColor(color);
  const classes = cn("inline-flex min-h-6 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", bordered && "border", semanticColor ? colorClass[color] : "text-white", checkable && "cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", checkable && selected && "border-primary bg-primary text-primary-foreground", disabled && "pointer-events-none opacity-50", className);
  const content = <>{icon ? <span className="inline-flex [&_svg]:size-3.5" aria-hidden="true">{icon}</span> : null}<span>{children}</span>{closable ? <button type="button" aria-label={`关闭 ${String(children ?? "标签")}`} disabled={disabled} className="-mr-1 inline-flex rounded p-0.5 hover:bg-black/10" onClick={(event) => { event.stopPropagation(); onClose?.(event); }}>{closeIcon ?? <X className="size-3" />}</button> : null}</>;
  if (checkable) return <button {...(props as HTMLAttributes<HTMLButtonElement>)} type="button" role="checkbox" aria-checked={selected} disabled={disabled} className={classes} style={{ ...style, backgroundColor: selected || semanticColor ? undefined : color }} onClick={() => { const next = !selected; if (checked === undefined) setInternalChecked(next); onChange?.(next); }}>{content}</button>;
  return <span {...props} className={classes} style={{ ...style, backgroundColor: semanticColor ? undefined : color }}>{content}</span>;
}

export type CheckableTagProps = Omit<TagProps, "checkable">;
export function CheckableTag(props: CheckableTagProps) {
  return <Tag {...props} checkable />;
}
