import { useEffect, useLayoutEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/primitives/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/primitives/sheet";
import { cn } from "../lib/utils";
const closeText = () => typeof document !== "undefined" && document.documentElement.lang.startsWith("en") ? "Close" : "关闭";
export interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  maxWidth?: string;
  className?: string;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  ariaLabel?: string;
  contentStyle?: CSSProperties;
}
export function Modal({
  open,
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  size = "md",
  maxWidth,
  className,
  closeOnEsc = true,
  closeOnBackdrop = false,
  showCloseButton = true,
  ariaLabel,
  contentStyle,
}: ModalProps) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const visible = open ?? isOpen ?? false;
  useEffect(() => {
    if (visible)
      previousFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    return () => {
      if (previousFocus.current?.isConnected) previousFocus.current.focus();
    };
  }, [visible]);
  useLayoutEffect(() => {
    if (visible) {
      const control = document.querySelector<HTMLElement>(
        "[data-state='open'] [autofocus], [data-state='open'] [autoFocus]",
      );
      control?.focus();
    }
  }, [visible]);
  useEffect(() => {
    if (!visible || !closeOnEsc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, closeOnEsc, onClose]);
  return (
    <Dialog
      open={visible}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        className={cn(
          {
            sm: "sm:max-w-md",
            md: "sm:max-w-xl",
            lg: "sm:max-w-3xl",
            xl: "sm:max-w-5xl",
          }[size],
          className,
        )}
        style={{ maxWidth, ...contentStyle }}
        showCloseButton={showCloseButton}
        onEscapeKeyDown={(e) => {
          if (!closeOnEsc) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (!closeOnBackdrop) e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          if (previousFocus.current?.isConnected) {
            e.preventDefault();
            previousFocus.current.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className={title ? undefined : "sr-only"}>
            {title || ariaLabel || closeText()}
          </DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="min-w-0 py-2">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
