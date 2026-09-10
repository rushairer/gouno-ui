import {
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type Ref,
} from "react";
import { Check, X } from "lucide-react";
import { cn } from "../lib/utils";

export type StepsStatus = "wait" | "process" | "finish" | "error";
export type StepsOrientation = "horizontal" | "vertical";
export type StepsTitlePlacement = "horizontal" | "vertical";
export type StepsType = "default" | "dot" | "inline" | "navigation" | "panel";
export type StepsVariant = "filled" | "outlined";
export type StepsSize = "small" | "middle";

export interface StepItem {
  key: Key;
  title: ReactNode;
  content?: ReactNode;
  subTitle?: ReactNode;
  icon?: ReactNode;
  status?: StepsStatus;
  disabled?: boolean;
}

export interface StepsIconRenderInfo {
  index: number;
  active: boolean;
  status: StepsStatus;
  item: StepItem;
}

export type StepsSemantic =
  | "root"
  | "item"
  | "marker"
  | "connector"
  | "title"
  | "subTitle"
  | "content"
  | "progress";

export interface StepsSemanticInfo {
  props: Readonly<{
    orientation: StepsOrientation;
    titlePlacement: StepsTitlePlacement;
    type: StepsType;
    variant: StepsVariant;
    size: StepsSize;
  }>;
}

export type StepsClassNames =
  | Partial<Record<StepsSemantic, string>>
  | ((info: StepsSemanticInfo) => Partial<Record<StepsSemantic, string>>);
export type StepsStyles =
  | Partial<Record<StepsSemantic, CSSProperties>>
  | ((info: StepsSemanticInfo) => Partial<Record<StepsSemantic, CSSProperties>>);

export interface StepsProps
  extends Omit<HTMLAttributes<HTMLOListElement>, "children" | "onChange"> {
  items: readonly StepItem[];
  current?: number;
  initial?: number;
  orientation?: StepsOrientation;
  titlePlacement?: StepsTitlePlacement;
  type?: StepsType;
  variant?: StepsVariant;
  size?: StepsSize;
  status?: StepsStatus;
  percent?: number;
  maxCount?: number;
  responsive?: boolean;
  iconRender?: (origin: ReactNode, info: StepsIconRenderInfo) => ReactNode;
  onChange?: (current: number) => void;
  classNames?: StepsClassNames;
  styles?: StepsStyles;
  ref?: Ref<HTMLOListElement>;
}

type VisibleStep =
  | { kind: "item"; item: StepItem; index: number }
  | { kind: "ellipsis"; key: string };

function clampPercent(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return Math.min(100, Math.max(0, value));
}

function resolveStatus(
  item: StepItem,
  index: number,
  current: number,
  currentStatus: StepsStatus,
) {
  if (item.status) return item.status;
  if (index < current) return "finish";
  if (index === current) return currentStatus;
  return "wait";
}

function visibleSteps(
  items: readonly StepItem[],
  current: number,
  maxCount: number | undefined,
): VisibleStep[] {
  const all = items.map((item, index) => ({ kind: "item" as const, item, index }));
  const limit = maxCount === undefined ? undefined : Math.floor(maxCount);
  if (!limit || limit < 3 || items.length <= limit) return all;

  if (current <= Math.floor((limit - 1) / 2)) {
    return [
      ...all.slice(0, limit - 1),
      { kind: "ellipsis", key: "steps-ellipsis-end" },
    ];
  }

  if (current >= items.length - Math.ceil((limit - 1) / 2)) {
    return [
      { kind: "ellipsis", key: "steps-ellipsis-start" },
      ...all.slice(items.length - (limit - 1)),
    ];
  }

  const windowSize = limit - 2;
  const start = Math.max(
    0,
    Math.min(
      current - Math.floor(windowSize / 2),
      items.length - windowSize,
    ),
  );
  return [
    { kind: "ellipsis", key: "steps-ellipsis-start" },
    ...all.slice(start, start + windowSize),
    { kind: "ellipsis", key: "steps-ellipsis-end" },
  ];
}

function defaultMarker(
  item: StepItem,
  index: number,
  initial: number,
  status: StepsStatus,
  type: StepsType,
) {
  if (item.icon) return item.icon;
  if (type === "dot") return null;
  if (status === "finish") return <Check aria-hidden="true" />;
  if (status === "error") return <X aria-hidden="true" />;
  return initial + index + 1;
}

export function Steps({
  items,
  current = 0,
  initial = 0,
  orientation = "horizontal",
  titlePlacement = "horizontal",
  type = "default",
  variant = "filled",
  size = "middle",
  status = "process",
  percent,
  maxCount,
  responsive = true,
  iconRender,
  onChange,
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: StepsProps) {
  const effectiveTitlePlacement = type === "dot" ? "vertical" : titlePlacement;
  const semanticInfo: StepsSemanticInfo = {
    props: {
      orientation,
      titlePlacement: effectiveTitlePlacement,
      type,
      variant,
      size,
    },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});
  const entries = visibleSteps(items, current, maxCount);
  const normalizedPercent = clampPercent(percent);

  return (
    <ol
      {...props}
      ref={ref}
      data-slot="steps"
      data-orientation={orientation}
      data-type={type}
      data-variant={variant}
      className={cn(
        "m-0 min-w-0 list-none p-0",
        orientation === "vertical"
          ? "flex flex-col gap-1"
          : "flex items-start gap-2 overflow-x-auto",
        responsive &&
          orientation === "horizontal" &&
          "max-[531px]:flex-col max-[531px]:overflow-visible",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      {entries.map((entry, visibleIndex) => {
        if (entry.kind === "ellipsis") {
          return (
            <li
              key={entry.key}
              aria-disabled="true"
              data-slot="steps-item"
              data-ellipsis="true"
              className={cn(
                "flex min-h-8 min-w-10 shrink-0 items-center justify-center text-sm text-muted-foreground",
                orientation === "horizontal" && "self-start",
                semanticClassNames.item,
              )}
              style={semanticStyles.item}
            >
              <span>…</span>
            </li>
          );
        }

        const { item, index } = entry;
        const itemStatus = resolveStatus(item, index, current, status);
        const active = index === current;
        const clickable = Boolean(onChange) && !item.disabled;
        const originMarker = defaultMarker(item, index, initial, itemStatus, type);
        const marker = iconRender?.(originMarker, {
          index,
          active,
          status: itemStatus,
          item,
        }) ?? originMarker;
        const showProgress =
          active &&
          itemStatus === "process" &&
          type === "default" &&
          normalizedPercent !== undefined;
        const hasConnector = visibleIndex < entries.length - 1;

        const body = (
          <>
            <div
              data-slot="steps-marker"
              className={cn(
                "relative z-[1] flex shrink-0 items-center justify-center rounded-full border text-xs font-medium [&_svg]:size-3.5",
                type === "dot"
                  ? "mt-1.5 size-2 border-current p-0"
                  : size === "small"
                    ? "size-5"
                    : "size-7",
                variant === "filled" && itemStatus === "process" && "border-primary bg-primary text-primary-foreground",
                variant === "filled" && itemStatus === "finish" && "border-primary/20 bg-primary/10 text-primary",
                variant === "filled" && itemStatus === "wait" && "border-muted bg-muted text-muted-foreground",
                variant === "filled" && itemStatus === "error" && "border-destructive/20 bg-destructive/10 text-destructive",
                variant === "outlined" && itemStatus === "process" && "border-primary bg-background text-primary",
                variant === "outlined" && itemStatus === "finish" && "border-primary/50 bg-background text-primary",
                variant === "outlined" && itemStatus === "wait" && "border-border bg-background text-muted-foreground",
                variant === "outlined" && itemStatus === "error" && "border-destructive bg-background text-destructive",
                type === "dot" && itemStatus === "process" && "bg-primary",
                type === "dot" && itemStatus === "finish" && "bg-primary/70",
                type === "dot" && itemStatus === "wait" && "bg-muted-foreground/30",
                type === "dot" && itemStatus === "error" && "bg-destructive",
                semanticClassNames.marker,
              )}
              style={semanticStyles.marker}
            >
              {marker}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-baseline gap-2">
                <span
                  data-slot="steps-title"
                  className={cn(
                    "min-w-0 truncate font-medium",
                    size === "small" ? "text-xs" : "text-sm",
                    itemStatus === "wait" ? "text-muted-foreground" : "text-foreground",
                    itemStatus === "error" && "text-destructive",
                    semanticClassNames.title,
                  )}
                  style={semanticStyles.title}
                >
                  {item.title}
                </span>
                {item.subTitle !== undefined ? (
                  <span
                    data-slot="steps-subtitle"
                    className={cn("shrink-0 text-xs text-muted-foreground", semanticClassNames.subTitle)}
                    style={semanticStyles.subTitle}
                  >
                    {item.subTitle}
                  </span>
                ) : null}
              </div>
              {item.content !== undefined ? (
                <div
                  data-slot="steps-content"
                  className={cn("mt-1 text-xs text-muted-foreground", semanticClassNames.content)}
                  style={semanticStyles.content}
                >
                  {item.content}
                </div>
              ) : null}
              {showProgress ? (
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={normalizedPercent}
                  data-slot="steps-progress"
                  className={cn("mt-2 h-1 w-full overflow-hidden rounded-full bg-muted", semanticClassNames.progress)}
                  style={semanticStyles.progress}
                >
                  <span
                    className="block h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${normalizedPercent}%` }}
                  />
                </div>
              ) : null}
            </div>
          </>
        );

        return (
          <li
            key={item.key}
            data-slot="steps-item"
            data-status={itemStatus}
            data-active={active ? "true" : undefined}
            className={cn(
              "relative min-w-0",
              orientation === "horizontal" ? "min-w-36 flex-1" : "w-full pb-3",
              type === "panel" && "rounded-lg border border-border p-3",
              type === "navigation" && active && "border-b-2 border-primary",
              item.disabled && "opacity-60",
              semanticClassNames.item,
            )}
            style={semanticStyles.item}
          >
            {hasConnector && type !== "panel" && type !== "navigation" && type !== "inline" ? (
              <span
                aria-hidden="true"
                data-slot="steps-connector"
                className={cn(
                  "absolute bg-border",
                  orientation === "horizontal"
                    ? cn(
                        size === "small" ? "left-5 top-2.5" : "left-7 top-3.5",
                        "right-0 h-px",
                      )
                    : cn(
                        size === "small" ? "left-2.5 top-5" : "left-3.5 top-7",
                        "bottom-0 w-px",
                      ),
                  semanticClassNames.connector,
                )}
                style={semanticStyles.connector}
              />
            ) : null}

            {clickable ? (
              <button
                type="button"
                disabled={item.disabled}
                aria-current={active ? "step" : undefined}
                onClick={() => {
                  if (index !== current) onChange?.(index);
                }}
                className={cn(
                  "relative z-[2] flex w-full min-w-0 items-start gap-2 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  effectiveTitlePlacement === "vertical" && "flex-col items-start",
                  type === "inline" && "items-center py-1",
                )}
              >
                {body}
              </button>
            ) : (
              <div
                aria-current={active ? "step" : undefined}
                aria-disabled={item.disabled || undefined}
                className={cn(
                  "relative z-[2] flex min-w-0 items-start gap-2",
                  effectiveTitlePlacement === "vertical" && "flex-col items-start",
                  type === "inline" && "items-center py-1",
                )}
              >
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
