import { useEffect, useLayoutEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/primitives/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/primitives/sheet";
import { cn } from "../lib/utils";
import type { ModalProps } from "./modal";
const closeText = () => typeof document !== "undefined" && document.documentElement.lang.startsWith("en") ? "Close" : "关闭";
export interface DrawerProps extends Omit<ModalProps, "maxWidth" | "size"> {
  width?: number | string;
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
  width,
}: DrawerProps) {
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
    <Sheet
      open={visible}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent
        className={cn("flex w-full flex-col gap-0 sm:max-w-xl", className)}
        style={width ? { maxWidth: width } : undefined}
        onEscapeKeyDown={(e) => {
          if (!closeOnEsc) e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          if (previousFocus.current?.isConnected) {
            e.preventDefault();
            previousFocus.current.focus();
          }
        }}
      >
        <SheetHeader className="border-b p-5">
          <SheetTitle>{title || closeText()}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto p-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-3 border-t p-5">
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
