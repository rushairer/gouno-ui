import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export type CalendarMode = "month" | "year";
export type CalendarSelectSource = "year" | "month" | "date" | "customize";
export type CalendarSemantic =
  | "root"
  | "header"
  | "body"
  | "weekHeader"
  | "weekNumber"
  | "cell"
  | "cellInner";

export interface CalendarCellInfo {
  originNode: ReactNode;
  today: Date;
  mode: CalendarMode;
  range?: "start" | "end";
}

export interface CalendarHeaderRenderProps {
  value: Date;
  mode: CalendarMode;
  onChange: (date: Date) => void;
  onModeChange: (mode: CalendarMode) => void;
}

export interface CalendarSemanticInfo {
  props: Readonly<{
    mode: CalendarMode;
    fullscreen: boolean;
    showWeek: boolean;
  }>;
}

export type CalendarClassNames =
  | Partial<Record<CalendarSemantic, string>>
  | ((info: CalendarSemanticInfo) => Partial<Record<CalendarSemantic, string>>);
export type CalendarStyles =
  | Partial<Record<CalendarSemantic, CSSProperties>>
  | ((info: CalendarSemanticInfo) => Partial<Record<CalendarSemantic, CSSProperties>>);

export interface CalendarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange"
  > {
  value?: Date;
  defaultValue?: Date;
  mode?: CalendarMode;
  defaultMode?: CalendarMode;
  fullscreen?: boolean;
  showWeek?: boolean;
  disabledDate?: (date: Date) => boolean;
  validRange?: readonly [Date, Date];
  locale?: string;
  cellRender?: (date: Date, info: CalendarCellInfo) => ReactNode;
  fullCellRender?: (date: Date, info: CalendarCellInfo) => ReactNode;
  headerRender?: (props: CalendarHeaderRenderProps) => ReactNode;
  onChange?: (date: Date) => void;
  onPanelChange?: (date: Date, mode: CalendarMode) => void;
  onSelect?: (date: Date, info: { source: CalendarSelectSource }) => void;
  classNames?: CalendarClassNames;
  styles?: CalendarStyles;
  ref?: Ref<HTMLDivElement>;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addYears(date: Date, amount: number) {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

function rangeState(date: Date, range?: readonly [Date, Date]) {
  if (!range) return undefined;
  if (sameDay(date, range[0])) return "start" as const;
  if (sameDay(date, range[1])) return "end" as const;
  return undefined;
}

function isOutsideRange(date: Date, range?: readonly [Date, Date]) {
  if (!range) return false;
  const time = startOfDay(date).getTime();
  return time < startOfDay(range[0]).getTime() || time > startOfDay(range[1]).getTime();
}

function getWeekNumber(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function defaultLocale() {
  return typeof document !== "undefined" && document.documentElement.lang
    ? document.documentElement.lang
    : undefined;
}

function localizedLabel(en: string, zh: string) {
  return typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
    ? en
    : zh;
}

export function Calendar({
  value,
  defaultValue,
  mode,
  defaultMode = "month",
  fullscreen = true,
  showWeek = false,
  disabledDate,
  validRange,
  locale = defaultLocale(),
  cellRender,
  fullCellRender,
  headerRender,
  onChange,
  onPanelChange,
  onSelect,
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: CalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [internalValue, setInternalValue] = useState(() =>
    startOfDay(defaultValue ?? value ?? today),
  );
  const selectedValue = value ? startOfDay(value) : internalValue;
  const [panelDate, setPanelDate] = useState(() => selectedValue);
  const [internalMode, setInternalMode] = useState(defaultMode);
  const activeMode = mode ?? internalMode;

  useEffect(() => {
    if (value) setPanelDate(startOfDay(value));
  }, [value]);

  const semanticInfo: CalendarSemanticInfo = {
    props: { mode: activeMode, fullscreen, showWeek },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale || undefined, options).format(date);

  const isDisabled = (date: Date) =>
    isOutsideRange(date, validRange) || Boolean(disabledDate?.(date));

  const changePanel = (nextDate: Date, nextMode = activeMode) => {
    setPanelDate(nextDate);
    if (mode === undefined) setInternalMode(nextMode);
    onPanelChange?.(nextDate, nextMode);
  };

  const selectDate = (date: Date, source: CalendarSelectSource) => {
    if (isDisabled(date)) return;
    const normalized = startOfDay(date);
    if (value === undefined) setInternalValue(normalized);
    setPanelDate(normalized);
    onSelect?.(normalized, { source });
    if (!sameDay(normalized, selectedValue)) onChange?.(normalized);
  };

  const monthCells = useMemo(() => {
    const first = new Date(panelDate.getFullYear(), panelDate.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(first.getFullYear(), first.getMonth(), 1 - mondayOffset);
    return Array.from({ length: 42 }, (_, index) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
    );
  }, [panelDate]);

  const weekdayLabels = useMemo(() => {
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, index) =>
      format(
        new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index),
        { weekday: "short" },
      ),
    );
  }, [locale]);

  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    const amount =
      event.key === "ArrowLeft"
        ? -1
        : event.key === "ArrowRight"
          ? 1
          : event.key === "ArrowUp"
            ? -7
            : event.key === "ArrowDown"
              ? 7
              : 0;
    if (!amount) return;
    event.preventDefault();
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
    const key = `${next.getFullYear()}-${next.getMonth()}-${next.getDate()}`;
    event.currentTarget
      .closest<HTMLElement>('[data-slot="calendar"]')
      ?.querySelector<HTMLButtonElement>(`[data-calendar-date="${key}"]`)
      ?.focus();
  };

  const renderCell = (date: Date, originNode: ReactNode, cellMode: CalendarMode) => {
    const info: CalendarCellInfo = {
      originNode,
      today,
      mode: cellMode,
      range: rangeState(date, validRange),
    };
    if (fullCellRender) return fullCellRender(date, info);
    if (cellRender) return cellRender(date, info);
    return originNode;
  };

  const defaultHeader = (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <IconButton
        variant="text"
        label={format(
          activeMode === "month" ? addMonths(panelDate, -1) : addYears(panelDate, -1),
          { year: "numeric", month: activeMode === "month" ? "long" : undefined },
        )}
        icon={<ChevronLeft aria-hidden="true" />}
        onClick={() =>
          changePanel(
            activeMode === "month" ? addMonths(panelDate, -1) : addYears(panelDate, -1),
          )
        }
      />
      <Button
        variant="text"
        onClick={() => changePanel(panelDate, activeMode === "month" ? "year" : "month")}
        aria-label={
          activeMode === "month"
            ? localizedLabel("Switch to year view", "切换到年份视图")
            : localizedLabel("Switch to month view", "切换到月份视图")
        }
      >
        {format(
          panelDate,
          activeMode === "month"
            ? { year: "numeric", month: "long" }
            : { year: "numeric" },
        )}
      </Button>
      <IconButton
        variant="text"
        label={format(
          activeMode === "month" ? addMonths(panelDate, 1) : addYears(panelDate, 1),
          { year: "numeric", month: activeMode === "month" ? "long" : undefined },
        )}
        icon={<ChevronRight aria-hidden="true" />}
        onClick={() =>
          changePanel(
            activeMode === "month" ? addMonths(panelDate, 1) : addYears(panelDate, 1),
          )
        }
      />
    </div>
  );

  return (
    <div
      {...props}
      ref={ref}
      data-slot="calendar"
      data-mode={activeMode}
      data-fullscreen={fullscreen || undefined}
      className={cn(
        "w-full min-w-0 text-sm",
        !fullscreen && "rounded-lg border bg-background p-3",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      <div
        data-slot="calendar-header"
        className={cn("mb-4", semanticClassNames.header)}
        style={semanticStyles.header}
      >
        {headerRender
          ? headerRender({
              value: panelDate,
              mode: activeMode,
              onChange: (next) => changePanel(startOfDay(next)),
              onModeChange: (nextMode) => changePanel(panelDate, nextMode),
            })
          : defaultHeader}
      </div>

      <div
        data-slot="calendar-body"
        className={cn("min-w-0", semanticClassNames.body)}
        style={semanticStyles.body}
      >
        {activeMode === "month" ? (
          <div
            role="grid"
            aria-label={format(panelDate, { year: "numeric", month: "long" })}
            className={cn(
              "grid gap-px overflow-hidden rounded-lg border bg-border",
              showWeek ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]" : "grid-cols-7",
            )}
          >
            {showWeek ? (
              <div
                role="columnheader"
                data-slot="calendar-week-header"
                className={cn(
                  "bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground",
                  semanticClassNames.weekHeader,
                )}
                style={semanticStyles.weekHeader}
              >
                #
              </div>
            ) : null}
            {weekdayLabels.map((label) => (
              <div
                key={label}
                role="columnheader"
                className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}

            {Array.from({ length: 6 }, (_, row) => {
              const week = monthCells.slice(row * 7, row * 7 + 7);
              const weekNumber = getWeekNumber(week[0]);
              return [
                showWeek ? (
                  <div
                    key={`week-${weekNumber}`}
                    role="rowheader"
                    data-slot="calendar-week-number"
                    className={cn(
                      "flex items-center justify-center bg-muted/30 px-2 text-xs text-muted-foreground",
                      semanticClassNames.weekNumber,
                    )}
                    style={semanticStyles.weekNumber}
                  >
                    {weekNumber}
                  </div>
                ) : null,
                ...week.map((date) => {
                  const outside = !sameMonth(date, panelDate);
                  const selected = sameDay(date, selectedValue);
                  const current = sameDay(date, today);
                  const disabled = isDisabled(date);
                  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                  const originNode = (
                    <button
                      type="button"
                      data-calendar-date={key}
                      disabled={disabled}
                      aria-selected={selected}
                      aria-current={current ? "date" : undefined}
                      aria-label={format(date, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      onClick={() => selectDate(date, "date")}
                      onKeyDown={(event) => moveFocus(event, date)}
                      className={cn(
                        "flex min-h-20 w-full flex-col items-end rounded-none bg-background p-2 text-left outline-none transition-colors hover:bg-accent focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
                        outside && "text-muted-foreground/60",
                        selected && "bg-primary/10",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full",
                          selected && "bg-primary text-primary-foreground",
                          current && !selected && "ring-1 ring-primary text-primary",
                        )}
                      >
                        {date.getDate()}
                      </span>
                    </button>
                  );
                  return (
                    <div
                      key={key}
                      role="gridcell"
                      data-slot="calendar-cell"
                      data-outside={outside || undefined}
                      className={cn("min-w-0 bg-background", semanticClassNames.cell)}
                      style={semanticStyles.cell}
                    >
                      <div
                        data-slot="calendar-cell-inner"
                        className={cn("h-full", semanticClassNames.cellInner)}
                        style={semanticStyles.cellInner}
                      >
                        {renderCell(date, originNode, "month")}
                      </div>
                    </div>
                  );
                }),
              ];
            })}
          </div>
        ) : (
          <div
            role="grid"
            aria-label={format(panelDate, { year: "numeric" })}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
          >
            {Array.from({ length: 12 }, (_, month) => {
              const date = new Date(panelDate.getFullYear(), month, 1);
              const disabled = Array.from(
                { length: new Date(date.getFullYear(), month + 1, 0).getDate() },
                (_, day) => new Date(date.getFullYear(), month, day + 1),
              ).every(isDisabled);
              const selected = sameMonth(date, selectedValue);
              const originNode = (
                <button
                  type="button"
                  disabled={disabled}
                  aria-selected={selected}
                  aria-label={format(date, { month: "long" })}
                  className={cn(
                    "min-h-20 w-full rounded-md border bg-background p-3 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
                    selected && "border-primary bg-primary/10",
                  )}
                  onClick={() => {
                    const next = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      selectedValue.getDate(),
                    );
                    const normalized =
                      next.getMonth() === date.getMonth()
                        ? next
                        : new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    selectDate(normalized, "month");
                    changePanel(normalized, "month");
                  }}
                >
                  {format(date, { month: "long" })}
                </button>
              );
              return (
                <div
                  key={month}
                  role="gridcell"
                  data-slot="calendar-cell"
                  className={cn("min-w-0", semanticClassNames.cell)}
                  style={semanticStyles.cell}
                >
                  <div
                    data-slot="calendar-cell-inner"
                    className={cn(semanticClassNames.cellInner)}
                    style={semanticStyles.cellInner}
                  >
                    {renderCell(date, originNode, "year")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
