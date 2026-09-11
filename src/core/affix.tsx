import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";

export interface AffixProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  offsetTop?: number;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export interface BackTopProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "aria-label"
  > {
  "aria-label": string;
  visibilityHeight?: number;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

export function Affix({
  offsetTop = 0,
  children,
  ref,
  className,
  style,
  ...props
}: AffixProps) {
  const top = finiteOr(offsetTop, 0);

  return (
    <div
      {...props}
      ref={ref}
      data-slot="affix"
      className={cn("z-20", className)}
      style={{ zIndex: 20, ...style, position: "sticky", top }}
    >
      {children}
    </div>
  );
}

export function BackTop({
  visibilityHeight = 200,
  children,
  ref,
  className,
  onClick,
  type = "button",
  ...props
}: BackTopProps) {
  const threshold = Math.max(0, finiteOr(visibilityHeight, 200));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY >= threshold);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      data-slot="back-top"
      data-visibility-height={threshold}
      className={cn(
        "fixed right-6 bottom-6 z-40 inline-flex size-10 items-center justify-center rounded-full border bg-popover text-foreground shadow-overlay transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {children ?? <ArrowUp aria-hidden="true" />}
    </button>
  );
}
