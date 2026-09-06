import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "../components/primitives/alert-dialog";
import { Button } from "../core/button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  confirmVariant?: "danger" | "primary";
  busy?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({ open, title, description, message, confirmLabel, cancelLabel, danger = false, confirmVariant, busy, loading, onConfirm, onClose, onCancel }: ConfirmDialogProps) {
  const pending = Boolean(busy || loading);
  const close = onClose || onCancel || (() => {});
  useEffect(() => {
    if (!open || pending) return;
    const handleBackdropClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest('[data-slot="alert-dialog-content"]')) close();
    };
    document.addEventListener("click", handleBackdropClick);
    return () => document.removeEventListener("click", handleBackdropClick);
  }, [open, pending, close]);
  return <AlertDialog open={open} onOpenChange={(next) => { if (!next && !pending) close(); }}>
    <AlertDialogContent role="dialog">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription asChild><div>{message || description}</div></AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button autoFocus onClick={close} disabled={pending}>{cancelLabel || "Cancel"}</Button>
        <Button variant={danger || confirmVariant === "danger" ? "danger" : "primary"} onClick={() => void onConfirm()} loading={pending}>{confirmLabel || "Confirm"}</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}

export interface ConfirmOptions { title: string; message: string; confirmLabel?: string; confirmVariant?: "danger" | "primary"; }
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const settle = useCallback((value: boolean) => { resolver.current?.(value); resolver.current = null; setOptions(null); }, []);
  const confirm = useCallback((next: ConfirmOptions) => { resolver.current?.(false); return new Promise<boolean>((resolve) => { resolver.current = resolve; setOptions(next); }); }, []);
  useEffect(() => () => { resolver.current?.(false); }, []);
  return { confirm, confirmDialog: <ConfirmDialog open={!!options} title={options?.title || ""} message={options?.message} confirmLabel={options?.confirmLabel} confirmVariant={options?.confirmVariant || "danger"} onConfirm={() => settle(true)} onCancel={() => settle(false)} /> };
}
