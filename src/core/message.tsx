import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MessageTone = "info" | "success" | "warning" | "error";
type MessageOpen = (content: ReactNode, tone?: MessageTone) => void;

type MessageItem = {
  id: number;
  content: ReactNode;
  tone: MessageTone;
};

export interface MessageProviderProps {
  children: ReactNode;
  duration?: number;
}

const MessageContext = createContext<MessageOpen | null>(null);

export function MessageProvider({
  children,
  duration = 2500,
}: MessageProviderProps) {
  const [items, setItems] = useState<MessageItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const show = useCallback<MessageOpen>(
    (content, tone = "info") => {
      nextId.current += 1;
      const id = nextId.current;
      setItems((current) => [...current, { id, content, tone }]);

      const timer = setTimeout(() => {
        timers.current.delete(id);
        setItems((current) => current.filter((item) => item.id !== id));
      }, Math.max(0, duration));
      timers.current.set(id, timer);
    },
    [duration],
  );

  useEffect(
    () => () => {
      for (const timer of timers.current.values()) clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  return (
    <MessageContext.Provider value={show}>
      {children}
      <div
        data-slot="message-region"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-slot="message"
            data-tone={item.tone}
            role={item.tone === "error" ? "alert" : "status"}
            aria-atomic="true"
            className="rounded-md border bg-popover px-4 py-2 text-sm shadow-overlay"
          >
            {item.content}
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const open = useContext(MessageContext);
  if (!open) throw new Error("useMessage must be used inside MessageProvider");

  return {
    open,
    info: (content: ReactNode) => open(content, "info"),
    success: (content: ReactNode) => open(content, "success"),
    warning: (content: ReactNode) => open(content, "warning"),
    error: (content: ReactNode) => open(content, "error"),
  };
}
