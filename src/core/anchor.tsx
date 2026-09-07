import type { ReactNode } from "react";

export interface AnchorItem {
  key: string;
  title: ReactNode;
  href?: string;
}

export interface AnchorProps {
  items: readonly AnchorItem[];
  offset?: number;
}

export function Anchor({ items, offset = 0 }: AnchorProps) {
  return (
    <nav aria-label="On this page" className="space-y-1">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href || `#${item.key}`}
          onClick={() => {
            if (offset) window.scrollTo({ top: offset, behavior: "smooth" });
          }}
          className="block rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
