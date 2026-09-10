import {
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type Ref,
} from "react";
import { Check, X } from "lucide-react";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";

export type StepStatus = "wait" | "process" | "finish" | "error";
export type StepsOrientation = "horizontal" | "vertical";
export type StepsTitlePlacement = "horizontal" | "vertical";
export type StepsType = "default" | "dot" | "inline" | "navigation" | "panel";
export type StepsVariant = "filled" | "outlined";
export type StepsSize = ControlSize;

export interface StepItem {
  key: Key;
  title: ReactNode;
  content?: ReactNode;
  subTitle?: ReactNode;
  icon?: ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

export interface StepsIconRenderInfo {
  index: number;
  active: boolean;
  status: StepStatus;
  item: StepItem;
}

export type StepsSemantic =
  | "root"
  | "item"
  | "tail"
  | "icon"
  | "body"
  | "title"
  | "subTitle"
  | "content";

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
  status?: StepStatus;
  percent?: number;
  maxCount?: number;
  responsive?: boolean;
  iconRender?: (originalNode: ReactNode, info: StepsIconRenderInfo) => ReactNode;
  onChange?: (current: number) => void;
  classNames?: StepsClassNames;
  styles?: StepsStyles;
  ref?: Ref<HTMLOListElement>;
}

interface VisibleStep {
  key: Key;
  index?: number;
  item?: StepItem;
  ellipsis?: "leading" | "gap" | "trailing";
}

const sizeClasses: Record<StepsSize, { icon: string; title: string; content: string }> = {
  small: {
    icon: "size-6 text-xs",
    title: "text-xs",
    content: "text-xs",
  },
  middle: {
    icon: "size-8 text-sm",
    title: "text-sm",
    content: "text-xs",
  },
  large: {
    icon: "size-10 text-base",
    title: "text-base",
    content: "text-sm",
  },
};

function normalizePercent(percent: number | undefined) {
  if (percent === undefined || !Number.isFinite(percent)) return undefined;
  return Math.min(100, Math.max(0, percent));
}

function renderedSlotCount(indices: ReadonlySet<number>, count: number) {
  if (!indices.size) return 0;
  const sorted = [...indices].sort((a, b) => a - b);
  let slots = sorted.length;
  if ((sorted[0] ?? 0) > 0) slots += 1;
  if ((sorted.at(-1) ?? count - 1) < count - 1) slots += 1;
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index] - sorted[index - 1] > 1) slots += 1;
  }
  return slots;
}

function limitedSteps(
  items: readonly StepItem[],
  current: number,
  maxCount: number | undefined,
): VisibleStep[] {
  const count = items.length;
  if (!maxCount || maxCount >= count) {
    return items.map((item, index) => ({ key: item.key, item, index }));
  }

  const limit = Math.max(3, Math.floor(maxCount));
  if (limit >= count) {
    return items.map((item, index) => ({ key: item.key, item, index }));
  }

  const anchor = Math.min(count - 1, Math.max(0, current));
  const indices = new Set<number>([anchor]);
  const candidates: number[] = [0, count - 1];
  for (let distance = 1; distance < count; distance += 1) {
    candidates.push(anchor - distance, anchor + distance);
  }

  for (const candidate of candidates) {
    if (candidate < 0 || candidate >= count || indices.has(candidate)) continue;
    const next = new Set(indices);
    next.add(candidate);
    if (renderedSlotCount(next, count) <= limit) indices.add(candidate);
  }

  const sorted = [...indices].sort((a, b) => a - b);
  const visible: VisibleStep[] = [];
  let previous = -1;

  for (const index of sorted) {
    if (previous < 0 && index > 0) {
      visible.push({
        key: `steps-ellipsis-leading-${index}`,
        ellipsis: "leading",
      });
    } else if (previous >= 0 && index - previous > 1) {
      visible.push({
        key: `steps-ellipsis-gap-${previous}-${index}`,
        ellipsis: "gap",
      });
    }
    visible.push({ key: items[index].key, item: items[index], index });
    previous = index;
  }

  if ((sorted.at(-1) ?? count - 1) < count - 1) {
    visible.push({
      key: `steps-ellipsis-trailing-${sorted.at(-1) ?? 0}`,
      ellipsis: "trailing",
    });
  }

  return visible.slice(0, limit);
}

function statusFor(item: StepItem, index: number, current: number, currentStatus: StepStatus) {
  if (item.status) return item.status;
  if (index < current) return "finish";
  if (index === current) return currentStatus;
  return "wait";
}

function defaultIcon(
  status: StepStatus,
  number: number,
  type: StepsType,
) {
  if (type === "dot") return <span className="size-2 rounded-full bg-current" />;
  if (status === "finish") return <Check aria-hidden="true" />;
  if (status === "error") return <X aria-hidden="true" />;
  return number;
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full -rotate-90"
    >
      <circle
        cx="20"
        cy="20"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2"
      />
      <circle
        cx="20"
        cy="20"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
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
  const semanticInfo: StepsSemanticInfo = {
    props: { orientation, titlePlacement, type, variant, size },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});
  const progress = normalizePercent(percent);
  const visible = limitedSteps(items, current, maxCount);
  const vertical = orientation === "vertical";
  const verticalTitles = titlePlacement === "vertical" && !vertical;
  const compact = type === "inline";

  return (
    <ol
      {...props}
      ref={ref}
      data-slot="steps"
      data-orientation={orientation}
      data-title-placement={titlePlacement}
      data-type={type}
      data-variant={variant}
      data-size={size}
      className={cn(
        "m-0 min-w-0 list-none p-0",
        vertical ? "flex flex-col" : "flex items-stretch overflow-x-auto",
        !vertical && responsive && "max-[532px]:flex-col max-[532px]:overflow-visible",
        type === "panel" && "gap-2",
        compact && "gap-1",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      {visible.map((entry, visibleIndex) => {
        if (!entry.item || entry.index === undefined) {
          return (
            <li
              key={entry.key}
              aria-hidden="true"
              data-slot="steps-item"
              data-ellipsis={entry.ellipsis}
              className={cn(
                "flex min-w-8 shrink-0 items-start justify-center px-1 text-muted-foreground",
                vertical && "justify-start py-2",
                !vertical && responsive && "max-[532px]:justify-start max-[532px]:py-2",
                semanticClassNames.item,
              )}
              style={semanticStyles.item}
            >
              <span className="inline-flex min-h-8 items-center">…</span>
            </li>
          );
        }

        const { item, index } = entry;
        const itemStatus = statusFor(item, index, current, status);
        const active = index === current;
        const clickable = Boolean(onChange) && !item.disabled;
        const number = initial + index + 1;
        const rawIcon = item.icon ?? defaultIcon(itemStatus, number, type);
        const renderedIcon = iconRender?.(rawIcon, {
          index,
          active,
          status: itemStatus,
          item,
        }) ?? rawIcon;
        const isLastVisible = visibleIndex === visible.length - 1;

        const content = (
          <>
            <span
              data-slot="steps-icon"
              className={cn(
                "relative z-10 flex shrink-0 items-center justify-center rounded-full font-medium [&_svg]:size-[0.95em]",
                sizeClasses[size].icon,
                type === "dot" && "bg-transparent",
                type !== "dot" &&
                  variant === "filled" &&
                  itemStatus === "wait" &&
                  "bg-muted text-muted-foreground",
                type !== "dot" &&
                  variant === "filled" &&
                  itemStatus === "process" &&
                  "bg-primary text-primary-foreground",
                type !== "dot" &&
                  variant === "filled" &&
                  itemStatus === "finish" &&
                  "bg-primary text-primary-foreground",
                type !== "dot" &&
                  variant === "filled" &&
                  itemStatus === "error" &&
                  "bg-destructive text-destructive-foreground",
                type !== "dot" &&
                  variant === "outlined" &&
                  "border bg-background",
                type !== "dot" &&
                  variant === "outlined" &&
                  itemStatus === "wait" &&
                  "border-border text-muted-foreground",
                type !== "dot" &&
                  variant === "outlined" &&
                  (itemStatus === "process" || itemStatus === "finish") &&
                  "border-primary text-primary",
                type !== "dot" &&
                  variant === "outlined" &&
                  itemStatus === "error" &&
                  "border-destructive text-destructive",
                type === "dot" && itemStatus === "wait" && "text-muted-foreground/50",
                type === "dot" &&
                  (itemStatus === "process" || itemStatus === "finish") &&
                  "text-primary",
                type === "dot" && itemStatus === "error" && "text-destructive",
                semanticClassNames.icon,
              )}
              style={semanticStyles.icon}
            >
              {active && progress !== undefined && type === "default" ? (
                <ProgressRing percent={progress} />
              ) : null}
              <span className="relative z-10 flex items-center justify-center">
                {renderedIcon}
              </span>
            </span>

            <span
              data-slot="steps-body"
              className={cn(
                "min-w-0",
                verticalTitles ? "text-center" : "text-left",
                semanticClassNames.body,
              )}
              style={semanticStyles.body}
            >
              <span className="flex min-w-0 items-baseline gap-2">
                <span
                  data-slot="steps-title"
                  className={cn(
                    "min-w-0 font-medium",
                    sizeClasses[size].title,
                    itemStatus === "wait" && "text-muted-foreground",
                    itemStatus === "error" && "text-destructive",
                    semanticClassNames.title,
                  )}
                  style={semanticStyles.title}
                >
                  {item.title}
                </span>
                {item.subTitle !== undefined && item.subTitle !== null ? (
                  <span
                    data-slot="steps-subtitle"
                    className={cn(
                      "shrink-0 text-xs text-muted-foreground",
                      semanticClassNames.subTitle,
                    )}
                    style={semanticStyles.subTitle}
                  >
                    {item.subTitle}
                  </span>
                ) : null}
              </span>
              {item.content !== undefined && item.content !== null ? (
                <span
                  data-slot="steps-content"
                  className={cn(
                    "mt-0.5 block text-muted-foreground",
                    sizeClasses[size].content,
                    semanticClassNames.content,
                  )}
                  style={semanticStyles.content}
                >
                  {item.content}
                </span>
              ) : null}
            </span>
          </>
        );

        return (
          <li
            key={item.key}
            aria-current={active ? "step" : undefined}
            aria-disabled={item.disabled || undefined}
            data-slot="steps-item"
            data-status={itemStatus}
            data-active={active || undefined}
            className={cn(
              "relative min-w-0",
              vertical ? "pb-5" : "min-w-36 flex-1",
              !vertical && responsive && "max-[532px]:pb-5",
              type === "panel" && "rounded-lg border bg-background p-3",
              type === "navigation" && "border-b-2 border-transparent pb-3",
              type === "navigation" && active && "border-primary",
              compact && "min-w-28",
              semanticClassNames.item,
            )}
            style={semanticStyles.item}
          >
            {!isLastVisible && type !== "panel" ? (
              <span
                aria-hidden="true"
                data-slot="steps-tail"
                className={cn(
                  "absolute bg-border",
                  vertical
                    ? "left-4 top-9 h-[calc(100%-2rem)] w-px"
                    : "left-10 right-2 top-4 h-px",
                  !vertical &&
                    responsive &&
                    "max-[532px]:left-4 max-[532px]:right-auto max-[532px]:top-9 max-[532px]:h-[calc(100%-2rem)] max-[532px]:w-px",
                  itemStatus === "finish" && "bg-primary/60",
                  semanticClassNames.tail,
                )}
                style={semanticStyles.tail}
              />
            ) : null}

            {clickable ? (
              <button
                type="button"
                disabled={item.disabled}
                onClick={() => onChange?.(index)}
                className={cn(
                  "relative z-10 flex w-full min-w-0 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  verticalTitles ? "flex-col items-center gap-2" : "items-start gap-3",
                  compact && "gap-2",
                )}
              >
                {content}
              </button>
            ) : (
              <div
                className={cn(
                  "relative z-10 flex min-w-0",
                  verticalTitles ? "flex-col items-center gap-2" : "items-start gap-3",
                  compact && "gap-2",
                  item.disabled && "opacity-50",
                )}
              >
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
