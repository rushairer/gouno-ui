import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface NotificationNotice {
  title: ReactNode;
  description?: ReactNode;
  duration?: number;
}

export interface NotificationProviderProps {
  children: ReactNode;
}

type NotificationOpen = (notice: NotificationNotice) => void;
type NotificationItem = NotificationNotice & { id: number };

const NotificationContext = createContext<NotificationOpen | null>(null);

const DEFAULT_DURATION = 4500;

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

  const open = useCallback<NotificationOpen>((notice) => {
    nextId.current += 1;
    const id = nextId.current;
    setItems((current) => [...current, { ...notice, id }]);

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
        className="fixed right-4 top-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {items.map((item) => (
          <section
            key={item.id}
            data-slot="notification"
            role="status"
            aria-atomic="true"
            className="rounded-lg border bg-popover p-4 shadow-overlay"
          >
            <strong>{item.title}</strong>
            {item.description ? (
              <div className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </div>
            ) : null}
          </section>
        ))}
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
