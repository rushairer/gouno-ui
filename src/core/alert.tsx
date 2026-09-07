import {
  Component,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AriaAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../lib/utils";

export type AlertType = "success" | "info" | "warning" | "error";
export type AlertVariant = "outlined" | "filled";
export type AlertSemantic = "root" | "icon" | "section" | "title" | "description" | "actions" | "close";

export interface AlertClosableConfig extends AriaAttributes {
  afterClose?: () => void;
  closeIcon?: ReactNode;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface AlertSemanticInfo {
  props: Readonly<{
    type: AlertType;
    variant: AlertVariant;
    banner: boolean;
    showIcon: boolean;
    closable: boolean;
    hasDescription: boolean;
  }>;
}

export type AlertClassNames = Partial<Record<AlertSemantic, string>> | ((info: AlertSemanticInfo) => Partial<Record<AlertSemantic, string>>);
export type AlertStyles = Partial<Record<AlertSemantic, CSSProperties>> | ((info: AlertSemanticInfo) => Partial<Record<AlertSemantic, CSSProperties>>);

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  type?: AlertType;
  showIcon?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  closable?: boolean | AlertClosableConfig;
  banner?: boolean;
  variant?: AlertVariant;
  classNames?: AlertClassNames;
  styles?: AlertStyles;
}

export interface AlertErrorBoundaryProps {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

type ToneClasses = { border: string; filled: string; outlined: string; icon: string };
const tones: Record<AlertType, ToneClasses> = {
  success: { border: "border-success/35", filled: "bg-success-subtle", outlined: "bg-success-subtle/35", icon: "text-success" },
  info: { border: "border-info/35", filled: "bg-info-subtle", outlined: "bg-info-subtle/35", icon: "text-info" },
  warning: { border: "border-warning/35", filled: "bg-warning-subtle", outlined: "bg-warning-subtle/35", icon: "text-warning" },
  error: { border: "border-destructive/35", filled: "bg-danger-subtle", outlined: "bg-danger-subtle/35", icon: "text-destructive" },
};
const defaultIcons: Record<AlertType, ReactNode> = {
  success: <CircleCheck aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
  warning: <TriangleAlert aria-hidden="true" />,
  error: <CircleX aria-hidden="true" />,
};
const closeDurationMs = 160;

const AlertBase = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { title, description, children, type, showIcon, icon, action, closable = false, banner = false, variant = "outlined", classNames, styles, className, style, role, ...props },
  ref,
) {
  const resolvedType: AlertType = type ?? (banner ? "warning" : "info");
  const resolvedShowIcon = showIcon ?? banner;
  const hasDescription = description !== undefined && description !== null;
  const hasContent = children !== undefined && children !== null;
  const closableConfig = typeof closable === "object" ? closable : undefined;
  const isClosable = Boolean(closable);
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const semanticInfo: AlertSemanticInfo = useMemo(() => ({ props: { type: resolvedType, variant, banner, showIcon: resolvedShowIcon, closable: isClosable, hasDescription } }), [banner, hasDescription, isClosable, resolvedShowIcon, resolvedType, variant]);
  const semanticClassNames = typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles = typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  if (!visible) return null;

  const tone = tones[resolvedType];
  const closeAria = closableConfig ? Object.fromEntries(Object.entries(closableConfig).filter(([key]) => key.startsWith("aria-"))) : {};
  const rich = hasDescription || (title !== undefined && title !== null && hasContent);

  return (
    <div
      {...props}
      ref={ref}
      role={role ?? "alert"}
      data-slot="alert"
      data-type={resolvedType}
      data-variant={variant}
      data-banner={banner || undefined}
      className={cn(
        "relative flex w-full min-w-0 gap-3 border text-sm text-foreground transition-[opacity,transform] duration-150",
        rich ? "items-start px-5 py-4 sm:px-6" : "items-center px-3 py-2.5",
        banner ? "rounded-none border-x-0" : "rounded-lg",
        variant === "filled" ? cn("border-transparent", tone.filled) : cn(tone.border, tone.outlined),
        closing && "pointer-events-none scale-[0.99] opacity-0",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      {resolvedShowIcon ? <span data-slot="alert-icon" className={cn("flex shrink-0 items-center justify-center [&_svg]:shrink-0", rich ? "mt-0.5 [&_svg]:size-6" : "[&_svg]:size-4", tone.icon, semanticClassNames.icon)} style={semanticStyles.icon}>{icon ?? defaultIcons[resolvedType]}</span> : null}
      <div data-slot="alert-section" className={cn("min-w-0 flex-1", semanticClassNames.section)} style={semanticStyles.section}>
        {title !== undefined && title !== null ? <div data-slot="alert-title" className={cn("font-medium leading-5 text-foreground", rich && "text-base leading-6", semanticClassNames.title)} style={semanticStyles.title}>{title}</div> : null}
        {hasDescription ? <div data-slot="alert-description" className={cn("text-sm leading-relaxed text-muted-foreground", title !== undefined && title !== null && "mt-1", semanticClassNames.description)} style={semanticStyles.description}>{description}</div> : null}
        {hasContent ? <div className={cn("text-sm leading-relaxed", (title !== undefined && title !== null) || hasDescription ? "mt-2" : undefined)}>{children}</div> : null}
      </div>
      {action ? <div data-slot="alert-actions" className={cn("flex shrink-0 items-center gap-2", rich && "pt-0.5", semanticClassNames.actions)} style={semanticStyles.actions}>{action}</div> : null}
      {isClosable ? (
        <button
          type="button"
          {...closeAria}
          data-slot="alert-close"
          aria-label={(closeAria as AriaAttributes)["aria-label"] ?? "Close alert"}
          className={cn("-mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-white/10", rich && "-mt-0.5", semanticClassNames.close)}
          style={semanticStyles.close}
          onClick={(event) => {
            closableConfig?.onClose?.(event);
            if (timerRef.current) clearTimeout(timerRef.current);
            setClosing(true);
            timerRef.current = setTimeout(() => { setVisible(false); closableConfig?.afterClose?.(); }, closeDurationMs);
          }}
        >
          {closableConfig?.closeIcon ?? <X aria-hidden="true" className="size-4" />}
        </button>
      ) : null}
    </div>
  );
});
AlertBase.displayName = "Alert";

class AlertErrorBoundary extends Component<AlertErrorBoundaryProps, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return <AlertBase type="error" showIcon title={this.props.title ?? "Something went wrong"} description={this.props.description ?? this.state.error.message} />;
  }
}

export const Alert = Object.assign(AlertBase, { ErrorBoundary: AlertErrorBoundary });
