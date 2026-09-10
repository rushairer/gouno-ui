import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import { FieldGroup, FieldLegend, FieldSet } from "../components/primitives/field";
import { cn } from "../lib/utils";

export type CheckProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: ReactNode };

function CheckControl({ label, id, kind, className, ...props }: CheckProps & { kind: "checkbox" | "radio" }) {
  const generated = useId();
  const controlId = id || generated;
  const control = <input {...props} id={controlId} type={kind} className={cn("size-4 shrink-0 accent-primary disabled:opacity-50", className)} />;
  return label ? <label htmlFor={controlId} className="flex items-center gap-2 text-sm">{control}<span>{label}</span></label> : control;
}

export const Checkbox = (props: CheckProps) => <CheckControl {...props} kind="checkbox" />;
export const Radio = (props: CheckProps) => <CheckControl {...props} kind="radio" />;

export function Switch({ label, id, className, ...props }: CheckProps) {
  const generated = useId();
  const controlId = id || generated;
  return <label className={cn("flex items-center gap-3", className)} htmlFor={controlId}>
    <input {...props} id={controlId} type="checkbox" role="switch" className="peer sr-only" />
    <span className="flex h-6 w-10 shrink-0 items-center rounded-full border border-border bg-secondary p-0.5 peer-checked:justify-end peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-disabled:opacity-50"><span className="size-4 rounded-full bg-background" /></span>
    {label ? <span>{label}</span> : null}
  </label>;
}

export const CheckboxField = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(function CheckboxField({ children, className, ...props }, ref) {
  return (
    <label
      {...props}
      ref={ref}
      data-slot="checkbox-field"
      className={cn("flex items-center gap-2", className)}
    >
      {children}
    </label>
  );
});

export function CheckboxGroup({ label, children }: { label: string; children: ReactNode }) {
  return <FieldSet><FieldLegend>{label}</FieldLegend><FieldGroup className="flex-row flex-wrap gap-4">{children}</FieldGroup></FieldSet>;
}
