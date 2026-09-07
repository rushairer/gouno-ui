import type { ReactNode } from "react";

export interface SpinProps {
  spinning?: boolean;
  tip?: ReactNode;
  children?: ReactNode;
}

export function Spin({ spinning = true, tip, children }: SpinProps) {
  return (
    <div className="relative">
      {children}
      {spinning ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70" role="status">
          <span className="size-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          {tip ? <span className="text-sm text-muted-foreground">{tip}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
