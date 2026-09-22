import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../components/primitives/popover";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";
import {
  PickerChevron,
  pickerControlClass,
  pickerTriggerClass,
} from "./picker-internals";

export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: readonly CascaderOption[];
}

export interface CascaderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange" | "role" | "aria-disabled"
> {
  options: readonly CascaderOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (value: string[], selected: CascaderOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: ControlSize;
  status?: "error" | "warning";
}

function resolveSelected(
  options: readonly CascaderOption[],
  path: readonly string[],
) {
  const selected: CascaderOption[] = [];
  let items = options;

  for (const value of path) {
    const option = items.find((item) => item.value === value);
    if (!option) break;
    selected.push(option);
    items = option.children ?? [];
  }

  return selected;
}

function optionIndex(
  items: readonly CascaderOption[],
  value: string | undefined,
) {
  if (value === undefined) return -1;
  return items.findIndex((item) => item.value === value);
}

export const Cascader = forwardRef<HTMLDivElement, CascaderProps>(
  function Cascader(
    {
      options,
      value,
      defaultValue = [],
      onChange,
      placeholder,
      disabled = false,
      size = "middle",
      status,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) {
    const [inner, setInner] = useState<readonly string[]>(defaultValue);
    const [open, setOpen] = useState(false);
    const current = value ?? inner;
    const invalid = status === "error" ? true : ariaInvalid;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const popupId = `cascader-${generatedId}-popup`;

    const selected = useMemo(
      () => resolveSelected(options, current),
      [options, current],
    );

    const levels = useMemo(() => {
      const result: Array<readonly CascaderOption[]> = [options];
      let items = options;

      for (const selectedValue of current) {
        const active = items.find((item) => item.value === selectedValue);
        if (!active?.children?.length) break;
        items = active.children;
        result.push(items);
      }

      return result;
    }, [options, current]);

    const focusEntry = (level: number, index: number) => {
      queueMicrotask(() => {
        const entries =
          contentRef.current?.querySelectorAll<HTMLButtonElement>(
            `[data-cascader-level="${level}"]`,
          ) ?? [];
        const enabled = Array.from(entries).filter((entry) => !entry.disabled);
        if (!enabled.length) return;
        const direct = Array.from(entries).find(
          (entry) => Number(entry.dataset.cascaderIndex) === index && !entry.disabled,
        );
        (direct ?? enabled[0])?.focus();
      });
    };

    const focusRelative = (
      event: KeyboardEvent<HTMLButtonElement>,
      direction: 1 | -1,
    ) => {
      const level = Number(event.currentTarget.dataset.cascaderLevel);
      const entries =
        contentRef.current?.querySelectorAll<HTMLButtonElement>(
          `[data-cascader-level="${level}"]`,
        ) ?? [];
      const enabled = Array.from(entries).filter((entry) => !entry.disabled);
      const currentIndex = enabled.indexOf(event.currentTarget);
      if (currentIndex < 0 || !enabled.length) return;
      event.preventDefault();
      enabled[
        Math.min(
          enabled.length - 1,
          Math.max(0, currentIndex + direction),
        )
      ]?.focus();
    };

    const emit = (next: string[]) => {
      const nextSelected = resolveSelected(options, next);
      if (value === undefined) setInner(next);
      onChange?.(next, nextSelected);
      return nextSelected;
    };

    const choose = (level: number, option: CascaderOption) => {
      if (disabled || option.disabled) return;
      const next = [...current.slice(0, level), option.value];
      emit(next);
      if (option.children?.length) {
        setOpen(true);
        focusEntry(level + 1, 0);
      } else {
        setOpen(false);
        queueMicrotask(() => triggerRef.current?.focus());
      }
    };

    const clearLevel = (level: number) => {
      if (disabled) return;
      emit([...current.slice(0, level)]);
      setOpen(true);
      focusEntry(level, -1);
    };

    const handleOptionKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      level: number,
      index: number,
      option?: CascaderOption,
    ) => {
      if (event.key === "ArrowDown") {
        focusRelative(event, 1);
        return;
      }
      if (event.key === "ArrowUp") {
        focusRelative(event, -1);
        return;
      }
      if (event.key === "ArrowLeft" && level > 0) {
        event.preventDefault();
        const previousIndex = optionIndex(levels[level - 1], current[level - 1]);
        focusEntry(level - 1, previousIndex);
        return;
      }
      if (event.key === "ArrowRight" && option?.children?.length) {
        event.preventDefault();
        choose(level, option);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        queueMicrotask(() => triggerRef.current?.focus());
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (index === -1) clearLevel(level);
        else if (option) choose(level, option);
      }
    };

    const display =
      selected.length === current.length && selected.length
        ? selected.map((item) => item.label).join(" / ")
        : "";

    return (
      <div
        {...props}
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        aria-invalid={invalid}
        data-slot="cascader"
        data-status={status}
        className={cn("min-w-0", className)}
      >
        <Popover
          open={open}
          onOpenChange={(next) => {
            if (!disabled) setOpen(next);
          }}
        >
          <PopoverAnchor asChild>
            <div
              data-slot="cascader-control"
              className={pickerControlClass({ size, status, disabled })}
            >
              <PopoverTrigger asChild>
                <button
                  ref={triggerRef}
                  type="button"
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  aria-controls={popupId}
                  aria-label={ariaLabel}
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  aria-invalid={invalid}
                  disabled={disabled}
                  className={pickerTriggerClass()}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      if (!open) setOpen(true);
                    } else if (event.key === "Escape" && open) {
                      event.preventDefault();
                      setOpen(false);
                    }
                  }}
                >
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      !display && "text-muted-foreground",
                    )}
                  >
                    {display || placeholder || "—"}
                  </span>
                  <PickerChevron />
                </button>
              </PopoverTrigger>
            </div>
          </PopoverAnchor>

          <PopoverContent
            ref={contentRef}
            id={popupId}
            role="presentation"
            placement="bottom-start"
            className="w-auto max-w-[90vw] overflow-x-auto p-0"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              const level = Math.max(0, levels.length - 1);
              const selectedIndex = optionIndex(levels[level], current[level]);
              focusEntry(level, selectedIndex >= 0 ? selectedIndex : 0);
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
            }}
          >
            <div
              className="flex max-h-72 min-w-max"
              data-slot="cascader-columns"
            >
              {levels.map((items, level) => (
                <div
                  key={level}
                  role="listbox"
                  aria-label={String(level + 1)}
                  data-slot="cascader-column"
                  data-level={level}
                  className="min-w-40 overflow-y-auto border-r p-1 last:border-r-0"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={current[level] === undefined}
                    data-slot="cascader-option"
                    data-cascader-level={level}
                    data-cascader-index={-1}
                    onClick={() => clearLevel(level)}
                    onKeyDown={(event) =>
                      handleOptionKeyDown(event, level, -1)
                    }
                    className={cn(
                      "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                      current[level] === undefined &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="truncate">{placeholder || "—"}</span>
                  </button>
                  {items.map((item, index) => {
                    const active = current[level] === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        role="option"
                        aria-selected={active}
                        disabled={disabled || item.disabled}
                        data-slot="cascader-option"
                        data-cascader-level={level}
                        data-cascader-index={index}
                        onClick={() => choose(level, item)}
                        onKeyDown={(event) =>
                          handleOptionKeyDown(event, level, index, item)
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                          active && "bg-accent text-accent-foreground",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        {item.children?.length ? (
                          <span aria-hidden="true" className="text-muted-foreground">
                            ›
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
