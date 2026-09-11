import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export const Slider = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function Slider(
  { className, value, defaultValue, min = 0, max = 100, step = 1, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      data-slot="slider"
      type="range"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      className={cn(
        "h-2 w-full cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
});
