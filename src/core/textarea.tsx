import {
  forwardRef,
  useId,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { Textarea as PrimitiveTextarea } from "../components/primitives/textarea";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: ControlSize;
  status?: "error" | "warning";
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      size = "middle",
      status,
      showCount,
      maxLength,
      value,
      defaultValue,
      onChange,
      className,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const [count, setCount] = useState(
      () => String(value ?? defaultValue ?? "").length,
    );
    const countId = useId();
    return (
      <span className="block min-w-0">
        <PrimitiveTextarea
          {...props}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={(event) => {
            setCount(event.target.value.length);
            onChange?.(event);
          }}
          aria-invalid={
            status === "error" || props["aria-invalid"] || undefined
          }
          aria-describedby={
            [describedBy, showCount ? countId : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          data-size={size}
          data-status={status}
          className={cn(
            size === "small" && "min-h-16",
            size === "large" && "min-h-28 text-base",
            status === "warning" && "border-warning focus-visible:ring-warning",
            className,
          )}
        />
        {showCount ? (
          <span
            id={countId}
            className="mt-1 block text-right text-xs text-muted-foreground"
            aria-live="polite"
          >
            {value !== undefined ? String(value).length : count}
            {maxLength !== undefined ? ` / ${maxLength}` : ""}
          </span>
        ) : null}
      </span>
    );
  },
);
