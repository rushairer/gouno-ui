import { cloneElement, isValidElement, useId, type ReactNode } from "react";
import { Field as FieldRoot, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../components/primitives/field";
import { cn } from "../lib/utils";

export { FieldGroup, FieldSet, FieldLegend, FieldLabel };

export interface FieldProps {
  label: ReactNode;
  children: ReactNode;
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  hideLabel?: boolean;
}

export function Field({ label, children, id, hint, error, required = false, className, hideLabel = false }: FieldProps) {
  const generated = useId();
  const child = isValidElement<{ id?: string; required?: boolean; "aria-describedby"?: string; "aria-invalid"?: boolean }>(children) ? children : null;
  const controlId = id || child?.props.id || `field-${generated}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  return (
    <FieldRoot data-invalid={error ? true : undefined} className={cn("field min-w-0", className)}>
      <FieldLabel htmlFor={controlId} className={hideLabel ? "sr-only" : undefined}>
        {label}{required ? <span aria-hidden="true" className="text-destructive">*</span> : null}
      </FieldLabel>
      {child ? cloneElement(child, {
        id: controlId,
        required: child.props.required ?? required,
        "aria-describedby": [child.props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined,
        "aria-invalid": child.props["aria-invalid"] || Boolean(error) || undefined,
      }) : children}
      {hint ? <FieldDescription id={hintId}>{hint}</FieldDescription> : null}
      {error ? <FieldError id={errorId} role="alert">{error}</FieldError> : null}
    </FieldRoot>
  );
}

export const FormField = Field;
