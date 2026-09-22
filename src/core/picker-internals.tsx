import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

interface PickerControlClassOptions {
  size: ControlSize;
  status?: "error" | "warning";
  disabled?: boolean;
  flexible?: boolean;
}

export function pickerControlClass({
  size,
  status,
  disabled = false,
  flexible = false,
}: PickerControlClassOptions) {
  return cn(
    "flex w-full min-w-0 items-center gap-2 rounded-md border border-border bg-input px-3 text-foreground focus-within:ring-2 focus-within:ring-ring",
    controlSizeClass(size),
    flexible && "h-auto min-h-9 py-1",
    status === "error" &&
      "border-destructive focus-within:ring-destructive",
    status === "warning" &&
      "border-warning focus-within:ring-warning",
    disabled && "cursor-not-allowed opacity-50",
  );
}

interface PickerTriggerClassOptions {
  fill?: boolean;
}

export function pickerTriggerClass({
  fill = true,
}: PickerTriggerClassOptions = {}) {
  return cn(
    "flex min-w-0 items-center gap-2 self-stretch text-left outline-none disabled:cursor-not-allowed",
    fill ? "flex-1" : "flex-none",
  );
}

export function PickerChevron({
  className,
  ...props
}: ComponentProps<typeof ChevronDown>) {
  return (
    <ChevronDown
      aria-hidden="true"
      data-slot="picker-chevron"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
      {...props}
    />
  );
}
