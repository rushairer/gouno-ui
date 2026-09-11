import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

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
      ...props
    },
    ref,
  ) {
    const [inner, setInner] = useState<readonly string[]>(defaultValue);
    const current = value ?? inner;
    const invalid = status === "error" ? true : props["aria-invalid"];

    const levels = useMemo(() => {
      const result: Array<readonly CascaderOption[]> = [options];
      let items = options;

      for (const selectedValue of current) {
        const selected = items.find((item) => item.value === selectedValue);
        if (!selected?.children?.length) break;
        items = selected.children;
        result.push(items);
      }

      return result;
    }, [options, current]);

    const update = (level: number, selectedValue: string) => {
      const next = selectedValue
        ? [...current.slice(0, level), selectedValue]
        : [...current.slice(0, level)];
      const selected = resolveSelected(options, next);

      if (value === undefined) setInner(next);
      onChange?.(next, selected);
    };

    return (
      <div
        {...props}
        ref={ref}
        role="group"
        aria-disabled={disabled || undefined}
        aria-invalid={invalid}
        data-slot="cascader"
        data-status={status}
        className={cn("flex flex-wrap gap-2", className)}
      >
        {levels.map((items, level) => (
          <select
            key={level}
            data-slot="cascader-select"
            data-level={level}
            disabled={disabled}
            value={current[level] ?? ""}
            aria-label={String(level + 1)}
            aria-invalid={invalid}
            onChange={(event) => update(level, event.currentTarget.value)}
            className={cn(
              "min-w-32 rounded-md border border-border bg-input px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              controlSizeClass(size),
              status === "error" &&
                "border-destructive focus-visible:ring-destructive",
              status === "warning" &&
                "border-warning focus-visible:ring-warning",
            )}
          >
            <option value="">{placeholder ?? ""}</option>
            {items.map((item) => (
              <option key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    );
  },
);
