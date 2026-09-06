import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../components/primitives/sheet";
import { cn } from "../lib/utils";
import type { ModalProps } from "./modal";

const closeText = () => typeof document !== "undefined" && document.documentElement.lang.startsWith("en") ? "Close" : "关闭";
export type DrawerPlacement = "top" | "right" | "bottom" | "left";

export interface DrawerProps extends Omit<ModalProps, "maxWidth" | "size"> {
  placement?: DrawerPlacement;
  width?: number | string;
  height?: number | string;
}

export function Drawer({
  open,
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  className,
  closeOnEsc = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  ariaLabel,
  contentStyle,
  placement = "right",
  width,
  height,
}: DrawerProps) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const visible = open ?? isOpen ?? false;
  useEffect(() => {
    if (visible) previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      if (previousFocus.current?.isConnected) previousFocus.current.focus();
    };
  }, [visible]);
  const dimensionStyle: CSSProperties = placement === "left" || placement === "right"
    ? { maxWidth: width }
    : { maxHeight: height };

  return (
    <Sheet open={visible} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side={placement}
        showCloseButton={showCloseButton}
        className={cn(
          "flex flex-col gap-0",
          placement === "left" || placement === "right" ? "w-full sm:max-w-xl" : "max-w-none",
          className,
        )}
        style={{ ...dimensionStyle, ...contentStyle }}
        onEscapeKeyDown={(event) => { if (!closeOnEsc) event.preventDefault(); }}
        onPointerDownOutside={(event) => { if (!closeOnBackdrop) event.preventDefault(); }}
        onCloseAutoFocus={(event) => {
          if (previousFocus.current?.isConnected) {
            event.preventDefault();
            previousFocus.current.focus();
          }
        }}
      >
        <SheetHeader className="border-b p-5">
          <SheetTitle>{title || ariaLabel || closeText()}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto p-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-3 border-t p-5">{footer}</div> : null}
      </SheetContent>
    </Sheet>
  );
}
