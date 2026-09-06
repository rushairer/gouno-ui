import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/primitives/dialog";
import { Button, type ButtonProps } from "./button";
import { useOverlayBody } from "../hooks/use-overlay-body";
import { cn } from "../lib/utils";
const closeText = () =>
  typeof document !== "undefined" &&
  document.documentElement.lang.startsWith("en")
    ? "Close"
    : "关闭";
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
  centered?: boolean;
  mask?: boolean;
  zIndex?: number;
  destroyOnClose?: boolean;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  confirmLoading?: boolean;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  styles?: {
    header?: CSSProperties;
    body?: CSSProperties;
    footer?: CSSProperties;
    mask?: CSSProperties;
  };
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
  centered = true,
  mask = true,
  zIndex = 50,
  destroyOnClose = true,
  onOk,
  onCancel,
  okText = "确定",
  cancelText = "取消",
  confirmLoading = false,
  okButtonProps,
  cancelButtonProps,
  styles,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const previousFocus = useRef<HTMLElement | null>(null);
  const controlled = open !== undefined || isOpen !== undefined;
  const visible = open ?? isOpen ?? internalOpen;
  const retained = useOverlayBody(children, visible, destroyOnClose);
  const changeOpen = (next: boolean) => {
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      onCancel?.();
      onClose?.();
    }
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
  return (
    <>
      {retained.portal}
      <Dialog open={visible} onOpenChange={changeOpen}>
        <DialogContent
          className={cn(
            {
              sm: "sm:max-w-md",
              md: "sm:max-w-xl",
              lg: "sm:max-w-3xl",
              xl: "sm:max-w-5xl",
            }[size],
            !centered && "top-[10vh] translate-y-0",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto",
            className,
          )}
          style={{ maxWidth, zIndex, ...contentStyle }}
          mask={mask}
          zIndex={zIndex}
          maskStyle={styles?.mask}
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
          <DialogHeader style={styles?.header}>
            <DialogTitle className={title ? undefined : "sr-only"}>
              {title || ariaLabel || closeText()}
            </DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <div
            className="min-w-0 py-2"
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
          {(footer !== undefined ? footer !== null : Boolean(onOk)) && (
            <div
              className="flex flex-wrap justify-end gap-3 border-t pt-4"
              style={styles?.footer}
            >
              {footer !== undefined ? (
                footer
              ) : (
                <>
                  <Button
                    {...cancelButtonProps}
                    disabled={confirmLoading || cancelButtonProps?.disabled}
                    onClick={(event) => {
                      cancelButtonProps?.onClick?.(event);
                      if (!event.defaultPrevented) changeOpen(false);
                    }}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant="primary"
                    {...okButtonProps}
                    loading={confirmLoading || okButtonProps?.loading}
                    onClick={(event) => {
                      okButtonProps?.onClick?.(event);
                      if (!event.defaultPrevented) void onOk?.();
                    }}
                  >
                    {okText}
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
