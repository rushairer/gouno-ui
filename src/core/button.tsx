import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentType,
  type ReactNode,
  type Ref,
} from "react";
import { LoaderCircle } from "lucide-react";
import { Button as PrimitiveButton } from "../components/primitives/button";
import { cn } from "../lib/utils";

export type ButtonVariant = "solid" | "outline" | "ghost" | "link" | "text" | "dashed";
export type ButtonColor = "default" | "primary" | "success" | "warning" | "error" | "info";
export type ButtonSize = "small" | "middle" | "large";
export type ButtonIconPlacement = "start" | "end";
export type ButtonShape = "default" | "round" | "circle";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: ReactNode;
  icon?: ReactNode;
  iconPlacement?: ButtonIconPlacement;
  shape?: ButtonShape;
  block?: boolean;
  ref?: Ref<HTMLButtonElement>;
}
const variants = { solid: "default", outline: "outline", dashed: "outline", ghost: "ghost", text: "ghost", link: "link" } as const;
const sizes = { small: "sm", middle: "default", large: "lg" } as const;
const shapeClass = { default: undefined, round: "rounded-full", circle: "rounded-full aspect-square px-0" } as const;

export function Button({ variant = "outline", color = "default", size = "middle", loading = false, loadingText, icon, iconPlacement = "start", shape = "default", block = false, children, disabled, className, type = "button", ...props }: ButtonProps) {
  const hasLabel = children !== undefined && children !== null && children !== "";
  const primitiveVariant = color === "error" && variant === "solid" ? "destructive" : variants[variant];
  return <PrimitiveButton {...props} type={type} variant={primitiveVariant} size={sizes[size]} disabled={disabled || loading} aria-busy={loading || undefined} className={cn("btn", color !== "default" && `btn-color-${color}`, loading && "is-loading", size === "small" && "btn-sm", variant === "dashed" && "border-dashed", variant === "text" && "shadow-none", shapeClass[shape], block && "w-full", className)}>
    {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon && iconPlacement === "start" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
    {hasLabel || loadingText ? <span>{loading && loadingText ? loadingText : children}</span> : null}
    {!loading && icon && iconPlacement === "end" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
  </PrimitiveButton>;
}

export interface LinkAdapterProps extends AnchorHTMLAttributes<HTMLAnchorElement> { to: string; ref?: Ref<HTMLAnchorElement>; }
const LinkContext = createContext<ComponentType<LinkAdapterProps>>(({ to, ...props }) => <a href={to} {...props} />);
export function NavigationProvider({ link, children }: { link: ComponentType<LinkAdapterProps>; children: ReactNode }) { return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>; }
export interface ButtonLinkProps extends Omit<LinkAdapterProps, "to"> {
  to?: string;
  href?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPlacement?: ButtonIconPlacement;
  shape?: ButtonShape;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  block?: boolean;
}
export function ButtonLink({ to, href, variant = "link", color = "default", size = "middle", icon, iconPlacement = "start", shape = "default", disabled, loading, loadingText, block, children, onClick, className, ...props }: ButtonLinkProps) {
  const Link = useContext(LinkContext);
  const inactive = disabled || loading;
  const primitiveVariant = color === "error" && variant === "solid" ? "destructive" : variants[variant];
  return <PrimitiveButton asChild variant={primitiveVariant} size={sizes[size]}><Link {...props} to={to ?? href ?? "#"} className={cn("btn", `btn-${variant}`, color !== "default" && `btn-color-${color}`, variant === "dashed" && "border-dashed", shapeClass[shape], block && "w-full", inactive && "pointer-events-none opacity-50", className)} aria-disabled={inactive || undefined} aria-busy={loading || undefined} tabIndex={inactive ? -1 : props.tabIndex} onClick={(event) => { if (inactive) { event.preventDefault(); return; } onClick?.(event); }}>
    {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon && iconPlacement === "start" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}<span>{loading && loadingText ? loadingText : children}</span>{!loading && icon && iconPlacement === "end" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
  </Link></PrimitiveButton>;
}
export function IconButtonLink({ label, icon, className, variant = "outline", ...props }: ButtonLinkProps & { label: string; icon: ReactNode }) { return <ButtonLink {...props} size="small" shape="circle" icon={icon} variant={variant} className={cn("icon-button", className)} aria-label={label} title={label} />; }
export function ChoiceButton({ selected, className, ...props }: ButtonProps & { selected?: boolean }) { return <Button {...props} className={cn("justify-start", className)} variant={selected ? "solid" : "ghost"} color={selected ? "primary" : "default"} aria-pressed={selected} />; }
