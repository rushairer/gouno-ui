import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/primitives/dialog";
import { cn } from "../lib/utils";
const closeText = () => typeof document !== "undefined" && document.documentElement.lang.startsWith("en") ? "Close" : "关闭";
export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  isOpen?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  afterOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl";
  maxWidth?: string;
  className?: string;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  ariaLabel?: string;
  contentStyle?: CSSProperties;
  loading?: boolean;
}
export function Modal({
  open,
  defaultOpen = false,
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  onOpenChange,
  afterOpenChange,
  size = "md",
  maxWidth,
  className,
  closeOnEsc = true,
  closeOnBackdrop = false,
  showCloseButton = true,
  ariaLabel,
  contentStyle,
  loading = false,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const previousFocus = useRef<HTMLElement | null>(null);
  const controlled = open !== undefined || isOpen !== undefined;
  const visible = open ?? isOpen ?? internalOpen;
  const changeOpen = (next: boolean) => {
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) onClose?.();
  };
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
  useEffect(() => { afterOpenChange?.(visible); }, [afterOpenChange, visible]);
  return (
    <Dialog
      open={visible}
      onOpenChange={changeOpen}
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
        <div className="min-w-0 py-2" aria-busy={loading || undefined}>{loading ? <div role="status" className="py-8 text-center text-sm text-muted-foreground">加载中…</div> : children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
