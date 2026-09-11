import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export interface TimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Gouno control size. Native input's numeric size attribute is intentionally not exposed. */
  size?: ControlSize;
  /** Validation state only; business copy remains caller-owned. */
  status?: "error" | "warning";
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker(
    { size = "middle", status, className, disabled, ...props },
    ref,
  ) {
    const ariaInvalid = status === "error" ? true : props["aria-invalid"];

    return (
      <input
        {...props}
        ref={ref}
        type="time"
        disabled={disabled}
        aria-invalid={ariaInvalid}
        data-slot="time-picker"
        data-status={status}
        className={cn(
          "w-full min-w-0 rounded-md border border-border bg-input px-3 text-foreground outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          controlSizeClass(size),
          status === "error" && "border-destructive",
          status === "warning" && "border-warning",
          className,
        )}
      />
    );
  },
);
