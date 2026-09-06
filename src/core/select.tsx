import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: ControlSize;
  status?: "error" | "warning";
  loading?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size = "middle", status, loading, placeholder, className, children, disabled, ...props },
  ref,
) {
  return (
    <span className="relative block min-w-0">
      <select
        {...props}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-invalid={status === "error" || props["aria-invalid"] || undefined}
        data-slot="select-trigger"
        data-status={status}
        className={cn("w-full appearance-none rounded-md border border-border bg-input px-3 pr-9 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", controlSizeClass(size), status === "warning" && "border-warning focus-visible:ring-warning", className)}
      >
        {placeholder ? <option value="" disabled>{placeholder}</option> : null}
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </span>
  );
});
