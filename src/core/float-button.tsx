import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface FloatButtonProps {
  icon?: ReactNode;
  tooltip?: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export function FloatButton({ icon, tooltip, onClick, href, className, style }: FloatButtonProps) {
  const content = <span aria-hidden={!tooltip}>{icon || "↑"}</span>;
  const commonProps = {
    className: cn("fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full border bg-background shadow-lg hover:bg-accent", className),
    style,
    title: typeof tooltip === "string" ? tooltip : undefined,
    "aria-label": typeof tooltip === "string" ? tooltip : undefined,
  };
  return href ? (
    <a {...commonProps} href={href}>{content}</a>
  ) : (
    <button {...commonProps} type="button" onClick={onClick}>{content}</button>
  );
}
