import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
} from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/primitives/alert-dialog";
import { Button } from "./button";

export interface PopconfirmProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children" | "title"
> {
  title: string;
  description?: string;
  children: ReactElement;
  okText: string;
  cancelText: string;
  danger?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
}

export const Popconfirm = forwardRef<HTMLSpanElement, PopconfirmProps>(
  function Popconfirm(
    {
      title,
      description,
      children,
      okText,
      cancelText,
      danger = false,
      onConfirm,
      onCancel,
      disabled = false,
      onClick,
      className,
      ...props
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const handleOpenChange = (nextOpen: boolean) => {
      if (busy && !nextOpen) return;
      setOpen(nextOpen);
    };

    const handleTriggerClick = (event: MouseEvent<HTMLSpanElement>) => {
      onClick?.(event);
      if (disabled || busy || event.defaultPrevented) return;
      setOpen(true);
    };

    const handleCancel = () => {
      if (busy) return;
      setOpen(false);
      onCancel?.();
    };

    const handleConfirm = async () => {
      if (busy) return;
      setBusy(true);
      try {
        await onConfirm?.();
        setOpen(false);
      } catch {
        // Keep the confirmation context visible. Product feedback belongs to
        // the caller's onConfirm implementation rather than Core.
      } finally {
        setBusy(false);
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <span
          {...props}
          ref={ref}
          data-slot="popconfirm-trigger"
          data-disabled={disabled || undefined}
          aria-disabled={disabled || props["aria-disabled"] || undefined}
          className={className}
          onClick={handleTriggerClick}
        >
          {children}
        </span>
        <AlertDialogContent
          data-slot="popconfirm-content"
          aria-busy={busy || undefined}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button disabled={busy} onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button
              loading={busy}
              variant="solid"
              color={danger ? "error" : "primary"}
              onClick={handleConfirm}
            >
              {okText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);
