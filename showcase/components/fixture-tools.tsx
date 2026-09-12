import { createContext, useContext, useState, type ReactNode } from "react";

const FixtureTarget = createContext<HTMLDivElement | null>(null);
export const useFixtureTarget = () => useContext(FixtureTarget);

/** Owns space outside the scrollable product viewport; never part of product chrome. */
export function FixtureTools({ children, navigation }: { children: ReactNode; navigation?: ReactNode }) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return <FixtureTarget.Provider value={target}>
    <div className="flex h-dvh min-w-0 flex-col" data-showcase-product-preview>
      <div aria-label="Showcase 工具" role="region" className="relative z-[60] flex min-h-12 shrink-0 items-center justify-between gap-2 border-b bg-background px-3 py-1">
        {navigation ?? <span className="text-xs text-muted-foreground">Showcase Fixture</span>}
        <div ref={setTarget} data-showcase-fixture-target className="flex shrink-0 items-center gap-2" />
      </div>
      <div data-showcase-product-viewport className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  </FixtureTarget.Provider>;
}
