import { useRef, useState, type PointerEvent, type ReactNode } from "react";

export interface SplitterProps {
  first: ReactNode;
  second: ReactNode;
  defaultSize?: number;
  min?: number;
  max?: number;
  orientation?: "horizontal" | "vertical";
  onResize?: (size: number) => void;
}

export function Splitter({
  first,
  second,
  defaultSize = 50,
  min = 15,
  max = 85,
  orientation = "horizontal",
  onResize,
}: SplitterProps) {
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(defaultSize);
  const vertical = orientation === "vertical";
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!root.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = root.current.getBoundingClientRect();
    const raw = vertical
      ? ((event.clientY - rect.top) / rect.height) * 100
      : ((event.clientX - rect.left) / rect.width) * 100;
    const next = Math.min(max, Math.max(min, raw));
    setSize(next);
    onResize?.(next);
  };
  return (
    <div ref={root} className={`flex min-h-32 min-w-0 overflow-hidden rounded-md border ${vertical ? "flex-col" : "flex-row"}`}>
      <div style={vertical ? { height: `${size}%` } : { width: `${size}%` }} className="min-h-0 min-w-0 overflow-auto">{first}</div>
      <div role="separator" aria-orientation={vertical ? "horizontal" : "vertical"} tabIndex={0} onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={move} className={`${vertical ? "h-1 w-full cursor-row-resize" : "h-full w-1 cursor-col-resize"} shrink-0 bg-border hover:bg-primary`} />
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{second}</div>
    </div>
  );
}
