import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, Text } from "../../src/core";

export interface FixtureDockProps {
  route?: string;
  note?: ReactNode;
  controls?: ReactNode;
}

export function FixtureDock({ route, note, controls }: FixtureDockProps) {
  return (
    <div data-showcase-fixture-dock className="fixed right-3 top-20 z-[90] sm:right-4">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="打开 Fixture 控制"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/85 px-2.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FlaskConical aria-hidden="true" className="size-3.5" />
            <span>Fixture</span>
          </button>
        </PopoverTrigger>
        <PopoverContent placement="bottom-end" className="w-[min(20rem,calc(100vw-1.5rem))] p-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FlaskConical aria-hidden="true" className="size-4 text-primary" />
              <Text as="div" size="sm" className="font-semibold">Showcase Fixture</Text>
            </div>
            {route ? (
              <div className="rounded-md bg-muted/50 px-2.5 py-2">
                <Text as="div" size="xs" tone="muted">真实产品路由</Text>
                <code className="mt-1 block break-all font-mono text-xs text-foreground">{route}</code>
              </div>
            ) : null}
            {note ? <Text size="xs" tone="muted" className="leading-relaxed">{note}</Text> : null}
            {controls ? <div className="border-t pt-3">{controls}</div> : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
