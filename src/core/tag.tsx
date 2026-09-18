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

function localizedCloseLabel(children: ReactNode) {
  const close =
    typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
      ? "Close"
      : "关闭";
  if (typeof children === "string" || typeof children === "number") {
    return `${close} ${children}`;
  }
  return typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
    ? "Close tag"
    : "关闭标签";
}

export function Tag({
  color = "default",
  icon,
  bordered = true,
  closable,
  closeIcon,
  onClose,
  checkable,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  children,
  className,
  style,
  ...props
}: TagProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const selected = checked ?? internalChecked;
  const semanticColor = isSemanticColor(color);
  const splitInteractive = Boolean(checkable && closable);
  const classes = cn(
    "inline-flex min-h-6 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
    bordered && "border",
    semanticColor ? colorClass[color] : "text-white",
    checkable &&
      !splitInteractive &&
      "cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    checkable && selected && "border-primary bg-primary text-primary-foreground",
    disabled && "opacity-50",
    disabled && !splitInteractive && "pointer-events-none",
    className,
  );

  const labelContent = (
    <>
      {icon ? (
        <span className="inline-flex [&_svg]:size-3.5" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );

  const closeAction = closable ? (
    <button
      type="button"
      aria-label={localizedCloseLabel(children)}
      disabled={disabled}
      className="-mr-1 inline-flex rounded p-0.5 hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
      onClick={(event) => {
        event.stopPropagation();
        onClose?.(event);
      }}
    >
      {closeIcon ?? <X aria-hidden="true" className="size-3" />}
    </button>
  ) : null;

  const toggle = () => {
    const next = !selected;
    if (checked === undefined) setInternalChecked(next);
    onChange?.(next);
  };

  if (checkable && splitInteractive) {
    return (
      <span
        className={classes}
        style={{
          ...style,
          backgroundColor: selected || semanticColor ? undefined : color,
        }}
        data-slot="checkable-closable-tag"
      >
        <button
          {...(props as HTMLAttributes<HTMLButtonElement>)}
          type="button"
          role="checkbox"
          aria-checked={selected}
          disabled={disabled}
          className="-ml-1 inline-flex min-w-0 items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
          onClick={toggle}
        >
          {labelContent}
        </button>
        {closeAction}
      </span>
    );
  }

  if (checkable) {
    return (
      <button
        {...(props as HTMLAttributes<HTMLButtonElement>)}
        type="button"
        role="checkbox"
        aria-checked={selected}
        disabled={disabled}
        className={classes}
        style={{
          ...style,
          backgroundColor: selected || semanticColor ? undefined : color,
        }}
        onClick={toggle}
      >
        {labelContent}
      </button>
    );
  }

  return (
    <span
      {...props}
      className={classes}
      style={{ ...style, backgroundColor: semanticColor ? undefined : color }}
    >
      {labelContent}
      {closeAction}
    </span>
  );
}

export type CheckableTagProps = Omit<TagProps, "checkable">;
export function CheckableTag(props: CheckableTagProps) {
  return <Tag {...props} checkable />;
}
