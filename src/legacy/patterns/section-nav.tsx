import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface SectionNavItem {
  id: string;
  label: ReactNode;
}

export interface SectionNavProps {
  label: string;
  items: readonly SectionNavItem[];
  className?: string;
}

export function SectionNav({ label, items, className }: SectionNavProps) {
  return (
    <nav aria-label={label} className={cn("section-nav", className)}>
      {items.map((item, index) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={index === 0 ? "location" : undefined}
          className="section-nav__link"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
