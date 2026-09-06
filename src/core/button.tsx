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

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "text" | "dashed" | "outline" | "default" | "destructive";
export type ButtonSize = "sm" | "small" | "default" | "middle" | "lg" | "large" | "icon" | "regular" | "base" | "compact";
export type ButtonIconPosition = "left" | "right";
export type ButtonShape = "default" | "round" | "circle";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: ReactNode;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  shape?: ButtonShape;
  block?: boolean;
  ref?: Ref<HTMLButtonElement>;
}
const variants = { primary: "default", default: "default", secondary: "outline", outline: "outline", dashed: "outline", danger: "destructive", destructive: "destructive", ghost: "ghost", text: "ghost", link: "link" } as const;
const sizes = { sm: "sm", small: "sm", compact: "sm", default: "default", middle: "default", regular: "default", base: "default", lg: "lg", large: "lg", icon: "icon" } as const;
const shapeClass = { default: undefined, round: "rounded-full", circle: "rounded-full aspect-square px-0" } as const;

export function Button({ variant = "secondary", size = "default", loading = false, loadingText, icon, iconPosition = "left", shape = "default", block = false, children, disabled, className, type = "button", ...props }: ButtonProps) {
  const hasLabel = children !== undefined && children !== null && children !== "";
  return <PrimitiveButton {...props} type={type} variant={variants[variant]} size={sizes[size]} disabled={disabled || loading} aria-busy={loading || undefined} className={cn("btn", loading && "is-loading", (size === "sm" || size === "small" || size === "compact") && "btn-sm", variant === "dashed" && "border-dashed", variant === "text" && "shadow-none", shapeClass[shape], block && "w-full", className)}>
    {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon && iconPosition === "left" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
    {hasLabel || loadingText ? <span>{loading && loadingText ? loadingText : children}</span> : null}
    {!loading && icon && iconPosition === "right" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
  </PrimitiveButton>;
}

export interface LinkAdapterProps extends AnchorHTMLAttributes<HTMLAnchorElement> { to: string; ref?: Ref<HTMLAnchorElement>; }
const LinkContext = createContext<ComponentType<LinkAdapterProps>>(({ to, ...props }) => <a href={to} {...props} />);
export function NavigationProvider({ link, children }: { link: ComponentType<LinkAdapterProps>; children: ReactNode }) { return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>; }
export interface ButtonLinkProps extends Omit<LinkAdapterProps, "to"> {
  to?: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  shape?: ButtonShape;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  block?: boolean;
}
export function ButtonLink({ to, href, variant = "link", size = "default", icon, iconPosition = "left", shape = "default", disabled, loading, loadingText, block, children, onClick, className, ...props }: ButtonLinkProps) {
  const Link = useContext(LinkContext);
  const inactive = disabled || loading;
  return <PrimitiveButton asChild variant={variants[variant]} size={sizes[size]}><Link {...props} to={to ?? href ?? "#"} className={cn("btn", `btn-${variant}`, variant === "dashed" && "border-dashed", shapeClass[shape], block && "w-full", inactive && "pointer-events-none opacity-50", className)} aria-disabled={inactive || undefined} aria-busy={loading || undefined} tabIndex={inactive ? -1 : props.tabIndex} onClick={(event) => { if (inactive) { event.preventDefault(); return; } onClick?.(event); }}>
    {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon && iconPosition === "left" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}<span>{loading && loadingText ? loadingText : children}</span>{!loading && icon && iconPosition === "right" ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
  </Link></PrimitiveButton>;
}
export function IconButtonLink({ label, icon, className, variant = "secondary", ...props }: ButtonLinkProps & { label: string; icon: ReactNode }) { return <ButtonLink {...props} size="icon" shape="circle" icon={icon} variant={variant} className={cn("icon-button", className)} aria-label={label} title={label} />; }
export function ChoiceButton({ selected, className, ...props }: ButtonProps & { selected?: boolean }) { return <Button {...props} className={cn("justify-start", className)} variant={selected ? "primary" : "ghost"} aria-pressed={selected} />; }
