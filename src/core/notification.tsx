import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../lib/utils";

export type NotificationNotice = {
  title: ReactNode;
  description?: ReactNode;
  type?: "info" | "success" | "warning" | "error";
} & (
  | {
      persistent?: false;
      duration?: number;
      closable?: { "aria-label": string };
    }
  | {
      persistent: true;
      duration?: never;
      closable: { "aria-label": string };
    }
);

export interface NotificationProviderProps {
  children: ReactNode;
}

type NotificationOpen = (notice: NotificationNotice) => void;
type NotificationItem = NotificationNotice & { id: number };
type NotificationType = NonNullable<NotificationNotice["type"]>;

const NotificationContext = createContext<NotificationOpen | null>(null);

const DEFAULT_DURATION = 4500;
const noticeStyles: Record<NotificationType, { border: string; icon: string }> = {
  info: { border: "border-info/35", icon: "text-info" },
  success: { border: "border-success/35", icon: "text-success" },
  warning: { border: "border-warning/35", icon: "text-warning" },
  error: { border: "border-destructive/35", icon: "text-destructive" },
};
const noticeIcons: Record<NotificationType, ReactNode> = {
  info: <Info aria-hidden="true" />,
  success: <CircleCheck aria-hidden="true" />,
  warning: <TriangleAlert aria-hidden="true" />,
  error: <CircleX aria-hidden="true" />,
};

function resolveDuration(duration: number | undefined) {
  if (duration === undefined) return DEFAULT_DURATION;
  if (!Number.isFinite(duration) || duration <= 0) return DEFAULT_DURATION;
  return duration;
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const open = useCallback<NotificationOpen>((notice) => {
    nextId.current += 1;
    const id = nextId.current;
    setItems((current) => [...current, { ...notice, id }]);

    if (notice.persistent) return;

    const timer = setTimeout(() => {
      timers.current.delete(id);
      setItems((current) => current.filter((item) => item.id !== id));
    }, resolveDuration(notice.duration));
    timers.current.set(id, timer);
  }, []);

  useEffect(
    () => () => {
      for (const timer of timers.current.values()) clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  return (
    <NotificationContext.Provider value={open}>
      {children}
      <div
        data-slot="notification-region"
        className="fixed right-4 top-4 layer-notice flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {items.map((item) => {
          const type = item.type ?? "info";
          const style = noticeStyles[type];
          const role = type === "error" || type === "warning" ? "alert" : "status";
          const hasDescription =
            item.description !== undefined && item.description !== null;

          return (
            <section
              key={item.id}
              data-slot="notification"
              data-type={type}
              data-persistent={item.persistent || undefined}
              role={role}
              aria-atomic="true"
              className={cn(
                "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-overlay",
                style.border,
              )}
            >
              <span
                data-slot="notification-icon"
                className={cn(
                  "mt-0.5 flex size-5 items-center justify-center [&_svg]:size-5",
                  style.icon,
                )}
              >
                {noticeIcons[type]}
              </span>
              <div data-slot="notification-content" className="min-w-0">
                <strong className="block font-medium leading-5">{item.title}</strong>
                {hasDescription ? (
                  <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </div>
                ) : null}
              </div>
              {item.closable ? (
                <button
                  type="button"
                  data-slot="notification-close"
                  aria-label={item.closable["aria-label"]}
                  className="-mr-1 -mt-1 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => dismiss(item.id)}
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : (
                <span aria-hidden="true" />
              )}
            </section>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const open = useContext(NotificationContext);
  if (!open) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return { open };
}
