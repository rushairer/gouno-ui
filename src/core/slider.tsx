import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";
import { cn } from "../lib/utils";

export type SliderOrientation = "horizontal" | "vertical";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visual/interaction axis. Native range semantics remain authoritative. */
  orientation?: SliderOrientation;
  /** Fires after a pointer or keyboard adjustment completes. */
  onChangeComplete?: (value: number) => void;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    className,
    min = 0,
    max = 100,
    step = 1,
    orientation = "horizontal",
    onChangeComplete,
    onPointerUp,
    onKeyUp,
    style,
    ...props
  },
  ref,
) {
  const vertical = orientation === "vertical";

  return (
    <input
      {...props}
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      aria-orientation={orientation}
      data-slot="slider"
      data-orientation={orientation}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (!event.defaultPrevented) onChangeComplete?.(event.currentTarget.valueAsNumber);
      }}
      onKeyUp={(event) => {
        onKeyUp?.(event);
        if (!event.defaultPrevented) onChangeComplete?.(event.currentTarget.valueAsNumber);
      }}
      className={cn(
        "cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        vertical ? "h-40 w-2" : "h-2 w-full",
        className,
      )}
      style={{
        ...style,
        ...(vertical
          ? {
              writingMode: "vertical-lr",
              direction: "rtl",
            }
          : undefined),
      }}
    />
  );
});
