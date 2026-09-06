import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Input as PrimitiveInput } from "../components/primitives/input";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: ControlSize;
  prefix?: ReactNode;
  suffix?: ReactNode;
  allowClear?: boolean;
  status?: "error" | "warning";
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "middle", prefix, suffix, allowClear, status, onClear, className, disabled, readOnly, value, defaultValue, onChange, ...props },
  ref,
) {
  const [inner, setInner] = useState(() => defaultValue ?? "");
  const current = value === undefined ? inner : value;
  const clearable = allowClear && !disabled && !readOnly && String(current ?? "").length > 0;
  const control = (
    <PrimitiveInput
      {...props}
      ref={ref}
      value={current}
      disabled={disabled}
      readOnly={readOnly}
      onChange={(event) => { if (value === undefined) setInner(event.target.value); onChange?.(event); }}
      aria-invalid={status === "error" || props["aria-invalid"] || undefined}
      data-status={status}
      className={cn(
        "bg-input text-foreground placeholder:text-muted-foreground",
        controlSizeClass(size),
        prefix && "pl-9",
        (suffix || clearable) && "pr-9",
        status === "warning" && "border-warning focus-visible:ring-warning",
        className,
      )}
    />
  );
  if (!prefix && !suffix && !clearable) return control;
  return (
    <span data-slot="input-group" className="relative block min-w-0">
      {prefix ? <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">{prefix}</span> : null}
      {control}
      {clearable ? (
        <button type="button" aria-label="Clear input" className="absolute right-2 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => { if (value === undefined) setInner(""); onClear?.(); }}>×</button>
      ) : suffix ? <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">{suffix}</span> : null}
    </span>
  );
});

export function SearchField({ className, ...props }: InputProps) {
  return <Input {...props} type={props.type || "search"} prefix={<Search />} className={className} />;
}
