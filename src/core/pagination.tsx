import { useState, type ReactNode } from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface PaginationProps {
  page?: number;
  defaultPage?: number;
  total: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (page: number, pageSize: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  hideOnSinglePage?: boolean;
  simple?: boolean;
  showLessItems?: boolean;
  size?: "small" | "middle";
  align?: "start" | "center" | "end";
  className?: string;
  itemRender?: (page: number, type: "page" | "prev" | "next", originalElement: ReactNode) => ReactNode;
  prevText?: ReactNode;
  nextText?: ReactNode;
}

const positiveInteger = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? Math.max(1, Math.floor(value)) : fallback;

function pageItems(current: number, pages: number, less: boolean): (number | "before" | "after")[] {
  const radius = less ? 1 : 2;
  if (pages <= radius * 2 + 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(current - radius, pages - radius * 2 - 1));
  const end = Math.min(pages - 1, Math.max(current + radius, radius * 2 + 2));
  const items: (number | "before" | "after")[] = [1];
  if (start > 2) items.push("before");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < pages - 1) items.push("after");
  items.push(pages);
  return items;
}

export function Pagination({
  page, defaultPage = 1, total, pageSize, defaultPageSize = 10,
  onChange, onShowSizeChange, disabled = false, ariaLabel = "Pagination",
  showSizeChanger = false, pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false, showTotal, hideOnSinglePage = false, simple = false,
  showLessItems = false, size = "middle", align = "start", className, itemRender,
  prevText = "Previous", nextText = "Next",
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalSize, setInternalSize] = useState(defaultPageSize);
  const [jump, setJump] = useState("");
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const resolvedSize = positiveInteger(pageSize ?? internalSize, 10);
  const pages = Math.max(1, Math.ceil(count / resolvedSize));
  const current = Math.min(pages, positiveInteger(page ?? internalPage, 1));
  const range: [number, number] = count ? [(current - 1) * resolvedSize + 1, Math.min(current * resolvedSize, count)] : [0, 0];
  const options = [...new Set([...pageSizeOptions.filter(n => Number.isInteger(n) && n > 0), resolvedSize])].sort((a, b) => a - b);

  const update = (next: number, nextSize = resolvedSize) => {
    if (disabled) return;
    const bounded = Math.min(Math.max(1, Math.ceil(count / nextSize)), positiveInteger(next, 1));
    if (bounded === current && nextSize === resolvedSize) return;
    if (page === undefined) setInternalPage(bounded);
    if (pageSize === undefined) setInternalSize(nextSize);
    onChange?.(bounded, nextSize);
  };
  const submitJump = () => {
    if (jump.trim() && Number.isFinite(Number(jump))) update(Number(jump));
    setJump("");
  };
  const button = (target: number, type: "page" | "prev" | "next", label: ReactNode, unavailable = false) => (
    <Button
      key={`${type}-${target}`}
      size={size === "small" ? "small" : "middle"}
      variant={type === "page" && target === current ? "solid" : "outline"}
      color={type === "page" && target === current ? "primary" : "default"}
      disabled={disabled || unavailable}
      aria-label={type === "page" ? `Page ${target}` : type === "prev" ? String(prevText) : String(nextText)}
      aria-current={type === "page" && target === current ? "page" : undefined}
      onClick={() => update(target)}
    >
      {itemRender ? itemRender(target, type, label) : label}
    </Button>
  );

  if (hideOnSinglePage && pages === 1) return null;
  return (
    <nav aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", align === "center" && "justify-center", align === "end" && "justify-end", className)}>
      {showTotal && <span className="text-sm text-muted-foreground">{showTotal(count, range)}</span>}
      {button(current - 1, "prev", prevText, current <= 1)}
      {simple ? <span className="px-2 text-sm tabular-nums" aria-live="polite">{current} / {pages}</span> : pageItems(current, pages, showLessItems).map(item => typeof item === "number"
        ? button(item, "page", item)
        : <Button key={item} size="small" variant="text" disabled={disabled} aria-label={item === "before" ? "Jump backward" : "Jump forward"} onClick={() => update(current + (item === "before" ? -5 : 5))}>…</Button>)}
      {button(current + 1, "next", nextText, current >= pages)}
      {!simple && <span className="sr-only" aria-live="polite">{current} / {pages}</span>}
      {showSizeChanger && <label className="flex items-center gap-2 text-sm">
        <span className="sr-only">Page size</span>
        <select className="min-h-9 rounded-md border bg-background px-2 text-foreground" disabled={disabled} value={resolvedSize} onChange={event => {
          const nextSize = Number(event.target.value);
          const nextPage = Math.min(current, Math.max(1, Math.ceil(count / nextSize)));
          update(nextPage, nextSize);
          onShowSizeChange?.(nextPage, nextSize);
        }}>{options.map(option => <option key={option} value={option}>{option} / page</option>)}</select>
      </label>}
      {showQuickJumper && <label className="flex items-center gap-2 text-sm">
        <span>Go to</span>
        <input aria-label="Go to page" className="min-h-9 w-16 rounded-md border bg-background px-2 text-foreground" type="number" min={1} max={pages} disabled={disabled} value={jump} onChange={event => setJump(event.target.value)} onBlur={submitJump} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); submitJump(); } }} />
      </label>}
    </nav>
  );
}
