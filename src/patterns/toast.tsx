import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
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

type ToastItem = {
  id: number;
  message: string;
  type: FeedbackType;
};

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
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  const notify = useCallback(
    (
      message: string,
      type: FeedbackType = "success",
      options?: ToastOptions,
    ) => {
      const id = nextId.current++;
      setItems((current) => [...current, { id, message, type }]);
      if (options?.duration === 0) return;

      const timer = setTimeout(() => {
        timers.current.delete(timer);
        setItems((current) => current.filter((item) => item.id !== id));
      }, options?.duration ?? 4000);
      timers.current.add(timer);
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

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-3"
        data-theme={resolvedMode}
      >
        {items.map((item) => (
          <div
            key={item.id}
            role={
              item.type === "warning" || item.type === "error"
                ? "alert"
                : "status"
            }
            className={cn(
              `toast--${item.type}`,
              "flex min-w-72 items-center gap-3 rounded-lg border bg-popover p-4 text-sm text-popover-foreground shadow-lg",
              feedbackToneClasses[item.type],
            )}
          >
            <span className="min-w-0 flex-1">{item.message}</span>
            <button
              type="button"
              aria-label="关闭提示"
              className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              onClick={() => dismiss(item.id)}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ))}
      </div>
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
    const id = toast[kind](message.message, {
      onDismiss: () => onDismiss?.(),
      onAutoClose: () => onDismiss?.(),
    });
    return () => {
      toast.dismiss(id);
    };
  }, [message.message, message.type, message.tone, onDismiss]);

  return null;
}
