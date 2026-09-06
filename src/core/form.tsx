import { type FormEvent, type FormHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { FieldGroup } from "../components/primitives/field";
import { cn } from "../lib/utils";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  layout?: "vertical" | "horizontal" | "inline";
  disabled?: boolean;
  loading?: boolean;
  validateMessages?: Record<string, string>;
  onFinish?: (formData: FormData, values: Record<string, FormDataEntryValue>) => void;
  onFinishFailed?: (event: FormEvent<HTMLFormElement>) => void;
}

export function Form({ layout = "vertical", disabled = false, loading = false, onFinish, onFinishFailed, onSubmit, className, children, validateMessages, ...props }: FormProps) {
  return <form {...props} noValidate={props.noValidate ?? Boolean(validateMessages)} className={cn("form-layout flex min-w-0 flex-col gap-6", layout === "horizontal" && "form-layout--horizontal", layout === "inline" && "flex-row flex-wrap items-end gap-4", className)} aria-busy={loading || undefined} onSubmit={(event) => {
    onSubmit?.(event);
    if (event.defaultPrevented) return;
    if (!event.currentTarget.checkValidity()) {
      event.preventDefault();
      const invalid = event.currentTarget.querySelector<HTMLElement>(":invalid");
      if (invalid && validateMessages) {
        const input = invalid as HTMLInputElement;
        const message = input.validity.valueMissing ? validateMessages.required : input.validity.typeMismatch ? validateMessages.type : validateMessages.required;
        if (message) {
          input.setCustomValidity(message);
          window.setTimeout(() => input.setCustomValidity(""), 0);
        }
      }
      onFinishFailed?.(event);
      return;
    }
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onFinish?.(formData, Object.fromEntries(formData.entries()));
  }}>
    <fieldset disabled={disabled || loading} className="contents">{children}</fieldset>
  </form>;
}

export function FormLayout({ className, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props} className={cn("form-layout flex min-w-0 flex-col gap-6", className)} />;
}

export function FormGrid({ columns = 2, className, ...props }: HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4 | 5 }) {
  return <FieldGroup {...props} className={cn("grid gap-5", { 1: "grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4", 5: "md:grid-cols-3 xl:grid-cols-5" }[columns], className)} />;
}

export function FormActions({ surface, className, ...props }: HTMLAttributes<HTMLDivElement> & { surface?: boolean }) {
  return <div {...props} className={cn("flex flex-wrap items-center justify-end gap-3 border-t pt-5", surface && "form-actions--surface", className)} />;
}

export function OverlayForm({ actions, actionClassName, children, ...props }: FormHTMLAttributes<HTMLFormElement> & { actions: ReactNode; actionClassName?: string }) {
  return <FormLayout {...props}>{children}<FormActions className={actionClassName}>{actions}</FormActions></FormLayout>;
}
