import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface AnchorItem {
  key: string;
  title: ReactNode;
  href?: string;
}

export interface AnchorProps extends HTMLAttributes<HTMLElement> {
  items: readonly AnchorItem[];
  /**
   * Top offset in pixels for local hash targets. Leave at 0 to preserve native
   * anchor scrolling; document headings can instead own sticky-header spacing
   * through CSS `scroll-margin-top`.
   */
  offset?: number;
}

function localHashTarget(href: string) {
  if (!href.startsWith("#") || href.length === 1) return null;
  try {
    return document.getElementById(decodeURIComponent(href.slice(1)));
  } catch {
    return null;
  }
}

export function Anchor({
  items,
  offset = 0,
  className,
  "aria-label": ariaLabel = "On this page",
  ...props
}: AnchorProps) {
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!offset || event.defaultPrevented) return;
    const target = localHashTarget(href);
    if (!target) return;

    event.preventDefault();
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
  };

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      data-slot="anchor"
      className={cn("space-y-1", className)}
    >
      {items.map((item) => {
        const href = item.href || `#${item.key}`;
        return (
          <a
            key={item.key}
            href={href}
            onClick={(event) => handleLinkClick(event, href)}
            className="block rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}