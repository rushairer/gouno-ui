import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";

type SegmentedValue = string | number;
type SegmentedOrientation = "horizontal" | "vertical";
type SegmentedShape = "default" | "round";

type SegmentedOption<T extends SegmentedValue> = {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

type SegmentedPropsInternal<T extends SegmentedValue> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  options: readonly (T | SegmentedOption<T>)[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  block?: boolean;
  orientation?: SegmentedOrientation;
  size?: ControlSize;
  shape?: SegmentedShape;
  name?: string;
};

function normalizeOption<T extends SegmentedValue>(option: T | SegmentedOption<T>): SegmentedOption<T> {
  if (typeof option === "string" || typeof option === "number") {
    return { value: option, label: String(option) };
  }
  return option;
}

const sizeClasses: Record<ControlSize, string> = {
  small: "h-7 px-2 text-sm",
  middle: "h-8 px-3 text-sm",
  large: "h-10 px-4 text-base",
};

function SegmentedInner<T extends SegmentedValue>(
  {
    options,
    value,
    defaultValue,
    onChange,
    disabled = false,
    block = false,
    orientation = "horizontal",
    size = "middle",
    shape = "default",
    name,
    className,
    ...props
  }: SegmentedPropsInternal<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const normalized = useMemo(() => options.map(normalizeOption), [options]);
  const firstEnabledValue = normalized.find((option) => !option.disabled)?.value;
  const [internalValue, setInternalValue] = useState<T | undefined>(() => defaultValue ?? firstEnabledValue);
  const currentValue = value ?? internalValue ?? firstEnabledValue;
  const generatedId = useId().replace(/:/g, "");
  const groupName = name ?? `gouno-segmented-${generatedId}`;

  const select = (nextValue: T) => {
    if (Object.is(nextValue, currentValue)) return;
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      {...props}
      ref={ref}
      role="radiogroup"
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      data-slot="segmented"
      data-size={size}
      data-shape={shape}
      data-orientation={orientation}
      className={cn(
        "inline-flex max-w-full items-stretch gap-0.5 bg-muted p-0.5 text-muted-foreground",
        orientation === "vertical" && "flex-col",
        block && "w-full",
        shape === "round" ? "rounded-full" : "rounded-lg",
        className,
      )}
    >
      {normalized.map((option) => {
        const optionDisabled = disabled || option.disabled;
        const checked = Object.is(currentValue, option.value);
        const accessibleName = typeof option.label === "string" || typeof option.label === "number"
          ? String(option.label)
          : String(option.value);

        return (
          <label
            key={`${typeof option.value}:${String(option.value)}`}
            data-slot="segmented-item"
            data-disabled={optionDisabled ? "true" : undefined}
            className={cn(
              "relative min-w-0 select-none",
              block && "flex-1",
              orientation === "vertical" && "w-full",
              optionDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              option.className,
            )}
          >
            <input
              className="peer sr-only"
              type="radio"
              name={groupName}
              value={String(option.value)}
              checked={checked}
              aria-checked={checked}
              disabled={optionDisabled}
              aria-label={accessibleName}
              onChange={() => select(option.value)}
            />
            <span
              data-slot="segmented-label"
              className={cn(
                "flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-[background-color,color,box-shadow]",
                "peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm",
                "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-muted",
                !optionDisabled && "hover:text-foreground",
                shape === "round" ? "rounded-full" : "rounded-md",
                sizeClasses[size],
              )}
            >
              {option.icon ? <span data-slot="segmented-icon" aria-hidden="true" className="flex shrink-0 items-center [&_svg]:size-4">{option.icon}</span> : null}
              {option.label !== undefined ? <span className="min-w-0 truncate">{option.label}</span> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

type SegmentedComponent = <T extends SegmentedValue = string>(
  props: SegmentedPropsInternal<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement | null;

export const Segmented = forwardRef(SegmentedInner) as SegmentedComponent;
