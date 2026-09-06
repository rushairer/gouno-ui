import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/primitives/sheet";
import { useOverlayBody } from "../hooks/use-overlay-body";
import { cn } from "../lib/utils";
import type { ModalProps } from "./modal";

const closeText = () =>
  typeof document !== "undefined" &&
  document.documentElement.lang.startsWith("en")
    ? "Close"
    : "关闭";
export type DrawerPlacement = "top" | "right" | "bottom" | "left";

export interface DrawerProps extends Omit<
  ModalProps,
  | "maxWidth"
  | "size"
  | "centered"
  | "onOk"
  | "onCancel"
  | "okText"
  | "cancelText"
  | "confirmLoading"
  | "okButtonProps"
  | "cancelButtonProps"
> {
  extra?: import("react").ReactNode;
  placement?: DrawerPlacement;
  width?: number | string;
  height?: number | string;
}

export function Drawer({
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
  className,
  closeOnEsc = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  ariaLabel,
  contentStyle,
  placement = "right",
  width = 378,
  height = 378,
  loading = false,
  mask = true,
  zIndex = 50,
  destroyOnClose = true,
  extra,
  styles,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const previousFocus = useRef<HTMLElement | null>(null);
  const controlled = open !== undefined || isOpen !== undefined;
  const visible = open ?? isOpen ?? internalOpen;
  const retained = useOverlayBody(children, visible, destroyOnClose);
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
  const notifyOpenChange = useEffectEvent((next: boolean) =>
    afterOpenChange?.(next),
  );
  useEffect(() => {
    notifyOpenChange(visible);
  }, [visible]);
  const dimensionStyle: CSSProperties =
    placement === "left" || placement === "right" ? { width } : { height };

  return (
    <>
      {retained.portal}
      <Sheet open={visible} onOpenChange={changeOpen}>
        <SheetContent
          side={placement}
          showCloseButton={showCloseButton}
          className={cn(
            "flex flex-col gap-0",
            placement === "left" || placement === "right"
              ? "max-w-[calc(100vw-1rem)]"
              : "max-w-none",
            className,
          )}
          style={{
            ...dimensionStyle,
            maxWidth: "100vw",
            maxHeight: "100dvh",
            zIndex,
            ...contentStyle,
          }}
          mask={mask}
          zIndex={zIndex}
          maskStyle={styles?.mask}
          onEscapeKeyDown={(event) => {
            if (!closeOnEsc) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!closeOnBackdrop) event.preventDefault();
          }}
          onCloseAutoFocus={(event) => {
            if (previousFocus.current?.isConnected) {
              event.preventDefault();
              previousFocus.current.focus();
            }
          }}
        >
          <SheetHeader className="border-b p-5 pr-12" style={styles?.header}>
            {extra && <div className="flex justify-end">{extra}</div>}
            <SheetTitle>{title || ariaLabel || closeText()}</SheetTitle>
            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>
          <div
            className="min-h-0 flex-1 overflow-auto p-5"
            style={styles?.body}
            aria-busy={loading || undefined}
          >
            {loading && (
              <div
                role="status"
                className="py-8 text-center text-sm text-muted-foreground"
              >
                加载中…
              </div>
            )}
            <div hidden={loading}>{retained.body}</div>
          </div>
          {footer != null && (
            <div
              className="flex flex-wrap justify-end gap-3 border-t p-5"
              style={styles?.footer}
            >
              {footer}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
