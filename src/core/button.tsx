import { LoaderCircle } from "lucide-react";
import { Button as PrimitiveButton } from "../components/primitives/button";
import { cn } from "../lib/utils";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "outline";
export type ButtonSize = "sm" | "default" | "lg" | "icon";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; icon?: ReactNode; iconPosition?: "left" | "right"; ref?: Ref<HTMLButtonElement>; }
const variants = { primary: "default", secondary: "outline", danger: "destructive", ghost: "ghost", link: "link", outline: "outline" } as const;
export function Button({ variant = "secondary", size = "default", loading = false, icon, iconPosition = "left", children, disabled, className, type = "button", ...props }: ButtonProps) {
  return <PrimitiveButton {...props} type={type} variant={variants[variant]} size={size} disabled={disabled || loading} aria-busy={loading || undefined} className={cn("btn", loading && "is-loading", className)}>{loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon && iconPosition === "left" ? <span aria-hidden="true">{icon}</span> : null}<span>{children}</span>{!loading && icon && iconPosition === "right" ? <span aria-hidden="true">{icon}</span> : null}</PrimitiveButton>;
}
