import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/primitives/tooltip";
import { cn } from "../lib/utils";

export interface FloatButtonProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  icon: ReactNode;
  tooltip?: ReactNode;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  download?: boolean | string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

const floatButtonClass =
  "fixed right-6 bottom-6 z-40 inline-flex size-12 items-center justify-center rounded-full border bg-popover text-foreground shadow-overlay transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function withTooltip(trigger: ReactElement, tooltip: ReactNode | undefined) {
  if (tooltip === undefined || tooltip === null) return trigger;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function FloatButton({
  icon,
  tooltip,
  href,
  target,
  rel,
  download,
  disabled = false,
  type = "button",
  ref,
  className,
  onClick,
  tabIndex,
  ...props
}: FloatButtonProps) {
  const content = (
    <span data-slot="float-button-icon" aria-hidden="true">
      {icon}
    </span>
  );

  if (href !== undefined) {
    return withTooltip(
      <a
        {...props}
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        download={download}
        aria-disabled={disabled ? true : props["aria-disabled"]}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        data-slot="float-button"
        className={cn(floatButtonClass, disabled && "pointer-events-none opacity-50", className)}
      >
        {content}
      </a>,
      tooltip,
    );
  }

  return withTooltip(
    <button
      {...props}
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={(event) => onClick?.(event)}
      data-slot="float-button"
      className={cn(floatButtonClass, "disabled:pointer-events-none disabled:opacity-50", className)}
    >
      {content}
    </button>,
    tooltip,
  );
}
