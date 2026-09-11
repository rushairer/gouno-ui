import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";

export type RateCharacter = ReactNode | ((value: number) => ReactNode);

export interface RateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowClear?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  /** Reuses the canonical Gouno control-size vocabulary. */
  size?: ControlSize;
  /** Shared native-radio name. Generated automatically when omitted. */
  name?: string;
  /** Visual character for every item, or a value-aware render function. */
  character?: RateCharacter;
  /** Caller-owned accessible name for each numeric rating item. Defaults to the number only. */
  getItemLabel?: (value: number) => string;
  /** @deprecated Use standard `aria-label` / `aria-labelledby` on the Rate root. */
  label?: string;
}

function normalizeCount(count: number | undefined) {
  if (!Number.isFinite(count)) return 5;
  return Math.max(1, Math.floor(count ?? 5));
}

function normalizeValue(value: number | undefined, count: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(count, Math.max(0, Math.floor(value ?? 0)));
}

function assignRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export const Rate = forwardRef<HTMLDivElement, RateProps>(function Rate(
  {
    value,
    defaultValue = 0,
    count: countProp = 5,
    allowClear = true,
    disabled = false,
    onChange,
    size = "middle",
    name,
    character = "★",
    getItemLabel,
    label,
    className,
    ...props
  },
  forwardedRef,
) {
  const count = normalizeCount(countProp);
  const [inner, setInner] = useState(() => normalizeValue(defaultValue, count));
  const current = normalizeValue(value ?? inner, count);
  const generatedName = useId();
  const groupName = name ?? `rate-${generatedName}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const groupLabel = props["aria-label"] ?? label;

  const update = (next: number) => {
    const normalized = normalizeValue(next, count);
    const result = allowClear && normalized === current ? 0 : normalized;
    if (value === undefined) setInner(result);
    onChange?.(result);
    return result;
  };

  const focusValue = (next: number) => {
    rootRef.current
      ?.querySelector<HTMLInputElement>(`input[data-rate-value="${next}"]`)
      ?.focus();
  };

  const handleKeyDown = (itemValue: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = Math.min(count, Math.max(1, current + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = Math.max(1, current === 0 ? 1 : current - 1);
    } else if (event.key === "Home") {
      next = 1;
    } else if (event.key === "End") {
      next = count;
    }

    if (next === undefined) return;
    event.preventDefault();
    if (next !== current) update(next);
    focusValue(next);
  };

  return (
    <div
      {...props}
      ref={(node) => {
        rootRef.current = node;
        assignRef(forwardedRef, node);
      }}
      role="radiogroup"
      aria-label={groupLabel}
      aria-disabled={disabled || undefined}
      data-slot="rate"
      data-size={size}
      className={cn("inline-flex items-center gap-1", className)}
    >
      {Array.from({ length: count }, (_, index) => index + 1).map((itemValue) => {
        const checked = itemValue === current;
        const active = itemValue <= current;
        const itemLabel = getItemLabel?.(itemValue) ?? String(itemValue);
        const content =
          typeof character === "function" ? character(itemValue) : character;

        return (
          <label
            key={itemValue}
            data-slot="rate-item"
            data-active={active || undefined}
            className={cn(
              "relative inline-flex items-center justify-center rounded-sm",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={itemValue}
              checked={checked}
              disabled={disabled}
              aria-label={itemLabel}
              data-rate-value={itemValue}
              tabIndex={checked || (current === 0 && itemValue === 1) ? 0 : -1}
              className="peer sr-only"
              onClick={(event) => {
                if (!disabled && allowClear && checked) {
                  event.preventDefault();
                  update(0);
                }
              }}
              onChange={() => {
                if (!checked) update(itemValue);
              }}
              onKeyDown={(event) => handleKeyDown(itemValue, event)}
            />
            <span
              aria-hidden="true"
              className={cn(
                "select-none leading-none transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                !disabled && "hover:scale-110",
                size === "small" && "text-lg",
                size === "middle" && "text-2xl",
                size === "large" && "text-3xl",
                active ? "text-warning" : "text-muted-foreground/40",
              )}
            >
              {content}
            </span>
          </label>
        );
      })}
    </div>
  );
});
