import {
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";

export type TimelineMode = "start" | "alternate" | "end";
export type TimelineOrientation = "vertical" | "horizontal";
export type TimelineVariant = "filled" | "outlined";
export type TimelinePlacement = "start" | "end";
export type TimelineSemantic =
  | "root"
  | "item"
  | "wrapper"
  | "icon"
  | "section"
  | "header"
  | "title"
  | "content"
  | "rail";

export interface TimelineItem {
  key: Key;
  title?: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  color?: string;
  loading?: boolean;
  placement?: TimelinePlacement;
}

export interface TimelineSemanticInfo {
  props: Readonly<{
    mode: TimelineMode;
    orientation: TimelineOrientation;
    reverse: boolean;
    variant: TimelineVariant;
  }>;
}

export type TimelineClassNames =
  | Partial<Record<TimelineSemantic, string>>
  | ((info: TimelineSemanticInfo) => Partial<Record<TimelineSemantic, string>>);
export type TimelineStyles =
  | Partial<Record<TimelineSemantic, CSSProperties>>
  | ((info: TimelineSemanticInfo) => Partial<Record<TimelineSemantic, CSSProperties>>);

export interface TimelineProps
  extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  items: readonly TimelineItem[];
  mode?: TimelineMode;
  orientation?: TimelineOrientation;
  reverse?: boolean;
  titleSpan?: number | string;
  variant?: TimelineVariant;
  classNames?: TimelineClassNames;
  styles?: TimelineStyles;
  ref?: Ref<HTMLOListElement>;
}

function resolveColorStyle(color?: string) {
  if (!color) return undefined;
  return { "--timeline-color": color } as CSSProperties;
}

export function Timeline({
  items,
  mode = "start",
  orientation = "vertical",
  reverse = false,
  titleSpan = 12,
  variant = "outlined",
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: TimelineProps) {
  const orderedItems = reverse ? [...items].reverse() : items;
  const semanticInfo: TimelineSemanticInfo = {
    props: { mode, orientation, reverse, variant },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});
  const titleSize = typeof titleSpan === "number" ? `${titleSpan}rem` : titleSpan;

  return (
    <ol
      {...props}
      ref={ref}
      data-slot="timeline"
      data-mode={mode}
      data-orientation={orientation}
      data-variant={variant}
      className={cn(
        "m-0 list-none p-0 text-sm",
        orientation === "vertical"
          ? "flex flex-col gap-0"
          : "grid auto-cols-fr grid-flow-col overflow-x-auto pb-2",
        semanticClassNames.root,
        className,
      )}
      style={{
        ...(orientation === "vertical"
          ? ({ "--timeline-title-span": titleSize } as CSSProperties)
          : undefined),
        ...semanticStyles.root,
        ...style,
      }}
    >
      {orderedItems.map((item, index) => {
        const automaticPlacement: TimelinePlacement =
          mode === "end"
            ? "end"
            : mode === "alternate" && index % 2 === 1
              ? "end"
              : "start";
        const placement = item.placement ?? automaticPlacement;
        const last = index === orderedItems.length - 1;

        return (
          <li
            key={item.key}
            data-slot="timeline-item"
            data-placement={placement}
            data-loading={item.loading || undefined}
            className={cn(
              "relative min-w-0",
              orientation === "vertical"
                ? "grid min-h-14 grid-cols-[minmax(0,var(--timeline-title-span))_1.5rem_minmax(0,1fr)] gap-x-3 pb-5 last:pb-0"
                : "grid min-w-44 grid-rows-[auto_1.5rem_auto] gap-y-2 px-2 text-center first:pl-0 last:pr-0",
              semanticClassNames.item,
            )}
            style={{ ...resolveColorStyle(item.color), ...semanticStyles.item }}
          >
            <div
              data-slot="timeline-wrapper"
              className={cn(
                "contents",
                semanticClassNames.wrapper,
              )}
              style={semanticStyles.wrapper}
            >
              <div
                data-slot="timeline-header"
                className={cn(
                  "min-w-0 text-muted-foreground",
                  orientation === "vertical"
                    ? cn(
                        "row-start-1 pt-0.5",
                        placement === "start" ? "col-start-1 text-right" : "col-start-3 text-left",
                      )
                    : "col-start-1 row-start-1",
                  semanticClassNames.header,
                )}
                style={semanticStyles.header}
              >
                {item.title !== undefined && item.title !== null ? (
                  <div
                    data-slot="timeline-title"
                    className={cn("break-words", semanticClassNames.title)}
                    style={semanticStyles.title}
                  >
                    {item.title}
                  </div>
                ) : null}
              </div>

              <div
                data-slot="timeline-icon"
                aria-hidden={item.loading || item.icon ? undefined : true}
                className={cn(
                  "relative z-10 flex items-center justify-center",
                  orientation === "vertical"
                    ? "col-start-2 row-start-1 size-6"
                    : "col-start-1 row-start-2 mx-auto size-6",
                  semanticClassNames.icon,
                )}
                style={semanticStyles.icon}
              >
                {item.loading ? (
                  <Spinner className="size-4" />
                ) : item.icon ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-background text-[var(--timeline-color,var(--primary))]">
                    {item.icon}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "block size-3 rounded-full border-2",
                      variant === "filled"
                        ? "border-[var(--timeline-color,var(--primary))] bg-[var(--timeline-color,var(--primary))]"
                        : "border-[var(--timeline-color,var(--primary))] bg-background",
                    )}
                  />
                )}
              </div>

              {!last ? (
                <span
                  data-slot="timeline-rail"
                  aria-hidden="true"
                  className={cn(
                    "absolute bg-border",
                    orientation === "vertical"
                      ? "bottom-0 left-[calc(var(--timeline-title-span)+1.5rem)] top-5 w-px -translate-x-1/2"
                      : "left-1/2 right-[-50%] top-[calc(100%-2.25rem)] h-px",
                    semanticClassNames.rail,
                  )}
                  style={semanticStyles.rail}
                />
              ) : null}

              <div
                data-slot="timeline-section"
                className={cn(
                  "min-w-0",
                  orientation === "vertical"
                    ? cn(
                        "row-start-1",
                        placement === "start" ? "col-start-3" : "col-start-1 text-right",
                      )
                    : "col-start-1 row-start-3",
                  semanticClassNames.section,
                )}
                style={semanticStyles.section}
              >
                {item.content !== undefined && item.content !== null ? (
                  <div
                    data-slot="timeline-content"
                    className={cn("break-words text-foreground", semanticClassNames.content)}
                    style={semanticStyles.content}
                  >
                    {item.content}
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
