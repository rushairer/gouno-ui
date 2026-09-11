import {
  forwardRef,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";

interface InputOTPRuntimeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange" | "role" | "aria-disabled"
> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  mask?: boolean;
  size?: ControlSize;
  status?: "error" | "warning";
}

const inputSizeClass: Record<ControlSize, string> = {
  small: "size-8 text-sm",
  middle: "size-9 text-base",
  large: "size-11 text-lg",
};

export const InputOTP = forwardRef<HTMLDivElement, InputOTPRuntimeProps>(
  function InputOTP(
    {
      length = 6,
      value,
      defaultValue = "",
      onChange,
      disabled = false,
      mask = false,
      size = "middle",
      status,
      className,
      ...props
    },
    ref,
  ) {
    const itemCount = Math.max(1, Math.floor(length));
    const [inner, setInner] = useState(
      defaultValue.replace(/\D/g, "").slice(0, itemCount),
    );
    const itemRefs = useRef<Array<HTMLInputElement | null>>([]);
    const canonicalValue = (value ?? inner).replace(/\D/g, "").slice(0, itemCount);
    const current = canonicalValue.padEnd(itemCount, " ");
    const invalid = status === "error" ? true : props["aria-invalid"];

    const commit = (next: string) => {
      const normalized = next.replace(/[^\d ]/g, "").slice(0, itemCount).trimEnd();
      if (value === undefined) setInner(normalized);
      onChange?.(normalized);
    };

    const writeAt = (index: number, raw: string) => {
      const digit = raw.replace(/\D/g, "").slice(-1);
      const chars = current.split("");
      chars[index] = digit || " ";
      commit(chars.join(""));
      if (digit && index < itemCount - 1) itemRefs.current[index + 1]?.focus();
    };

    const pasteAt = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
      const digits = event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, itemCount - index);
      if (!digits) return;
      event.preventDefault();
      const chars = current.split("");
      for (let offset = 0; offset < digits.length; offset += 1) {
        chars[index + offset] = digits[offset] ?? " ";
      }
      commit(chars.join(""));
      const nextIndex = Math.min(index + digits.length, itemCount - 1);
      itemRefs.current[nextIndex]?.focus();
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (event.key === "Backspace" && !current[index]?.trim() && index > 0) {
        event.preventDefault();
        const chars = current.split("");
        chars[index - 1] = " ";
        commit(chars.join(""));
        itemRefs.current[index - 1]?.focus();
      } else if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        itemRefs.current[index - 1]?.focus();
      } else if (event.key === "ArrowRight" && index < itemCount - 1) {
        event.preventDefault();
        itemRefs.current[index + 1]?.focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        itemRefs.current[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        itemRefs.current[itemCount - 1]?.focus();
      }
    };

    return (
      <div
        {...props}
        ref={ref}
        role="group"
        aria-disabled={disabled || undefined}
        aria-invalid={invalid}
        data-slot="input-otp"
        data-status={status}
        className={cn("flex gap-2", className)}
      >
        {Array.from({ length: itemCount }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            data-slot="input-otp-input"
            data-index={index}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            type={mask ? "password" : "text"}
            maxLength={1}
            disabled={disabled}
            value={current[index]?.trim() || ""}
            aria-label={String(index + 1)}
            aria-invalid={invalid}
            onChange={(event) => writeAt(index, event.target.value)}
            onPaste={(event) => pasteAt(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "rounded-md border bg-input text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              inputSizeClass[size],
              status === "error" &&
                "border-destructive focus-visible:ring-destructive/30",
              status === "warning" &&
                "border-warning focus-visible:ring-warning/30",
            )}
          />
        ))}
      </div>
    );
  },
);
