import {
  forwardRef,
  type ComponentPropsWithRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export type DateRange = {
  start?: string;
  end?: string;
};

export type DateRangePickerInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "size"
>;

export interface DateRangePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled start date in native yyyy-mm-dd form. */
  start?: string;
  /** Controlled end date in native yyyy-mm-dd form. */
  end?: string;
  /** Reports the complete proposed range whenever either native input changes. */
  onChange?: (range: DateRange) => void;
  /** Shared Gouno control size for both date inputs. */
  size?: ControlSize;
  /** Shared validation state; error marks both inputs aria-invalid. */
  status?: "error" | "warning";
  /** Native attributes, ARIA naming and optional ref for the start input only. */
  startInputProps?: DateRangePickerInputProps;
  /** Native attributes, ARIA naming and optional ref for the end input only. */
  endInputProps?: DateRangePickerInputProps;
  /** Visual separator between the two date inputs. */
  separator?: ReactNode;
}

const dateInputClass =
  "min-w-0 flex-1 rounded-md border border-border bg-input px-3 text-foreground outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      start,
      end,
      onChange,
      size = "middle",
      status,
      startInputProps,
      endInputProps,
      separator = "–",
      className,
      ...rootProps
    },
    ref,
  ) {
    const {
      className: startClassName,
      "aria-invalid": startAriaInvalid,
      ...startNativeProps
    } = startInputProps ?? {};
    const {
      className: endClassName,
      "aria-invalid": endAriaInvalid,
      ...endNativeProps
    } = endInputProps ?? {};

    return (
      <div
        {...rootProps}
        ref={ref}
        data-slot="date-range-picker"
        data-status={status}
        className={cn("flex w-full items-center gap-2", className)}
      >
        <input
          {...startNativeProps}
          type="date"
          value={start ?? ""}
          aria-invalid={status === "error" ? true : startAriaInvalid}
          data-slot="date-range-picker-start"
          className={cn(
            dateInputClass,
            controlSizeClass(size),
            status === "error" && "border-destructive",
            status === "warning" && "border-warning",
            startClassName,
          )}
          onChange={(event) =>
            onChange?.({ start: event.currentTarget.value || undefined, end })
          }
        />
        <span aria-hidden="true" data-slot="date-range-picker-separator">
          {separator}
        </span>
        <input
          {...endNativeProps}
          type="date"
          value={end ?? ""}
          aria-invalid={status === "error" ? true : endAriaInvalid}
          data-slot="date-range-picker-end"
          className={cn(
            dateInputClass,
            controlSizeClass(size),
            status === "error" && "border-destructive",
            status === "warning" && "border-warning",
            endClassName,
          )}
          onChange={(event) =>
            onChange?.({ start, end: event.currentTarget.value || undefined })
          }
        />
      </div>
    );
  },
);
