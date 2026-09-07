import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useTheme } from "../theme/provider";
import { cn } from "../lib/utils";
import {
  feedbackToneClasses,
  type FeedbackType,
} from "./feedback-tones";

export interface ToastOptions {
  duration?: number;
}

export interface ToastApi {
  notify: (message: string, type?: FeedbackType, options?: ToastOptions) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

interface NotifyToastOptions extends ToastOptions {
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

function notifyToast(
  message: string,
  type: FeedbackType = "success",
  options?: NotifyToastOptions,
) {
  let id: string | number;
  id = toast.custom(
    () => (
      <div
        role={type === "warning" || type === "error" ? "alert" : "status"}
        className={cn(
          `toast--${type}`,
          "flex min-w-72 items-center gap-3 rounded-lg border bg-popover p-4 text-sm text-popover-foreground shadow-lg",
          feedbackToneClasses[type],
        )}
      >
        <span className="min-w-0 flex-1">{message}</span>
        <button
          type="button"
          aria-label="关闭提示"
          className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
          onClick={() => toast.dismiss(id)}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    ),
    {
      duration: options?.duration === 0 ? Infinity : options?.duration,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    },
  );
  return id;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within a ToastProvider");
  return value;
}

export interface ToastProviderProps {
  children: ReactNode;
}

function ToastProviderRoot({ children }: ToastProviderProps) {
  const { resolvedMode } = useTheme();
  const notify = useCallback<ToastApi["notify"]>(
    (message, type = "success", options) => {
      notifyToast(message, type, options);
    },
    [],
  );
  const api = useMemo<ToastApi>(
    () => ({
      notify,
      showSuccess: (message) => notify(message, "success"),
      showError: (message) => notify(message, "error"),
      showInfo: (message) => notify(message, "info"),
    }),
    [notify],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster theme={resolvedMode} position="bottom-right" />
    </ToastContext.Provider>
  );
}

export function ToastProvider({ children }: ToastProviderProps) {
  const parent = useContext(ToastContext);
  return parent ? <>{children}</> : <ToastProviderRoot>{children}</ToastProviderRoot>;
}

export interface ToastProps {
  toast: {
    id?: number;
    message: string;
    type?: FeedbackType;
    tone?: string;
  };
  onDismiss?: () => void;
}

export function Toast({ toast: message, onDismiss }: ToastProps) {
  useEffect(() => {
    const kind: FeedbackType =
      message.type ??
      (message.tone === "error"
        ? "error"
        : message.tone === "warning"
          ? "warning"
          : message.tone === "success"
            ? "success"
            : "info");
    const id = notifyToast(message.message, kind, {
      onDismiss,
      onAutoClose: onDismiss,
    });
    return () => {
      toast.dismiss(id);
    };
  }, [message.message, message.type, message.tone, onDismiss]);

  return null;
}
