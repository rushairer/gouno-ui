import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "../lib/utils";

interface RateRuntimeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange" | "role" | "aria-disabled"
> {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowClear?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export const Rate = forwardRef<HTMLDivElement, RateRuntimeProps>(function Rate(
  {
    value,
    defaultValue = 0,
    count = 5,
    allowClear = true,
    disabled = false,
    onChange,
    className,
    ...props
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const itemCount = Math.max(0, Math.floor(count));
  const current = value ?? inner;
  const focusValue =
    current >= 1 && current <= itemCount ? Math.round(current) : 1;

  const commit = (next: number, allowToggle = true) => {
    const result = allowToggle && allowClear && next === current ? 0 : next;
    if (value === undefined) setInner(result);
    onChange?.(result);
  };

  const move = (from: number, delta: 1 | -1) => {
    if (itemCount === 0) return;
    const next = ((from - 1 + delta + itemCount) % itemCount) + 1;
    commit(next, false);
    itemRefs.current[next - 1]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    itemValue: number,
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(itemValue, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(itemValue, -1);
    } else if (event.key === "Home" && itemCount > 0) {
      event.preventDefault();
      commit(1, false);
      itemRefs.current[0]?.focus();
    } else if (event.key === "End" && itemCount > 0) {
      event.preventDefault();
      commit(itemCount, false);
      itemRefs.current[itemCount - 1]?.focus();
    }
  };

  return (
    <div
      {...props}
      ref={ref}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      data-slot="rate"
      className={cn("inline-flex gap-1", className)}
    >
      {Array.from({ length: itemCount }, (_, index) => index + 1).map(
        (itemValue) => (
          <button
            key={itemValue}
            ref={(node) => {
              itemRefs.current[itemValue - 1] = node;
            }}
            type="button"
            role="radio"
            aria-checked={itemValue === current}
            aria-label={String(itemValue)}
            tabIndex={!disabled && itemValue === focusValue ? 0 : -1}
            disabled={disabled}
            data-slot="rate-item"
            data-value={itemValue}
            onClick={() => commit(itemValue)}
            onKeyDown={(event) => handleKeyDown(event, itemValue)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md text-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              itemValue <= current
                ? "text-warning"
                : "text-muted-foreground/40",
            )}
          >
            <span aria-hidden="true">★</span>
          </button>
        ),
      )}
    </div>
  );
});
