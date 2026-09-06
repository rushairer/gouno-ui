import { createContext, useContext, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ComponentType, type ReactNode, type Ref } from "react";
import { LoaderCircle } from "lucide-react";
import { Button as PrimitiveButton } from "../components/primitives/button";
import { cn } from "../lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "outline" | "default" | "destructive";
export type ButtonSize = "sm" | "default" | "lg" | "icon" | "regular" | "base" | "compact";
export type ButtonIconPosition = "left" | "right";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; icon?: ReactNode; iconPosition?: ButtonIconPosition; ref?: Ref<HTMLButtonElement>; }
const variants = { primary: "default", default: "default", secondary: "outline", outline: "outline", danger: "destructive", destructive: "destructive", ghost: "ghost", link: "link" } as const;
const sizes = { sm: "sm", compact: "sm", default: "default", regular: "default", base: "default", lg: "lg", icon: "icon" } as const;
export function Button({ variant = "secondary", size = "default", loading = false, icon, iconPosition = "left", children, disabled, className, type = "button", ...props }: ButtonProps) {
  return <PrimitiveButton {...props} type={type} variant={variants[variant]} size={sizes[size]} disabled={disabled || loading} aria-busy={loading || undefined} className={cn("btn", loading && "is-loading", (size === "sm" || size === "compact") && "btn-sm", className)}>
    {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon && iconPosition === "left" ? <span aria-hidden="true">{icon}</span> : null}
    <span>{children}</span>
    {!loading && icon && iconPosition === "right" ? <span aria-hidden="true">{icon}</span> : null}
  </PrimitiveButton>;
}
export interface IconButtonProps extends Omit<ButtonProps, "children" | "icon"> { label: string; icon: ReactNode; }
export function IconButton({ label, icon, ...props }: IconButtonProps) { return <Button {...props} icon={icon} size="icon" aria-label={label} title={label} />; }
export interface LinkAdapterProps extends AnchorHTMLAttributes<HTMLAnchorElement> { to: string; ref?: Ref<HTMLAnchorElement>; }
const LinkContext = createContext<ComponentType<LinkAdapterProps>>(({ to, ...props }) => <a href={to} {...props} />);
export function NavigationProvider({ link, children }: { link: ComponentType<LinkAdapterProps>; children: ReactNode }) { return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>; }
export interface ButtonLinkProps extends LinkAdapterProps { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; iconPosition?: ButtonIconPosition; disabled?: boolean; }
export function ButtonLink({ variant = "secondary", size = "default", icon, iconPosition = "left", disabled, children, onClick, className, ...props }: ButtonLinkProps) {
  const Link = useContext(LinkContext);
  return <PrimitiveButton asChild variant={variants[variant]} size={sizes[size]}><Link {...props} className={cn("btn", `btn-${variant}`, className)} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} onClick={(event) => { if (disabled) { event.preventDefault(); return; } onClick?.(event); }}>
    {icon && iconPosition === "left" ? <span aria-hidden="true">{icon}</span> : null}<span>{children}</span>{icon && iconPosition === "right" ? <span aria-hidden="true">{icon}</span> : null}
  </Link></PrimitiveButton>;
}
export function IconButtonLink({ label, icon, className, variant = "secondary", ...props }: ButtonLinkProps & { label: string; icon: ReactNode }) { return <ButtonLink {...props} size="icon" icon={icon} variant={variant} className={cn("icon-button", className)} aria-label={label} title={label} />; }
export function ChoiceButton({ selected, className, ...props }: ButtonProps & { selected?: boolean }) { return <Button {...props} className={cn("justify-start", className)} variant={selected ? "primary" : "ghost"} aria-pressed={selected} />; }
