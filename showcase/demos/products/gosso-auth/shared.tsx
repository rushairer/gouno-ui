import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, Tag, Text } from "../../../../src/core";

export function AuthSurface({
  children,
  route,
  title,
  description,
}: {
  children: ReactNode;
  route: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_38%),radial-gradient(circle_at_90%_90%,color-mix(in_srgb,var(--muted-foreground)_10%,transparent),transparent_42%)]" />
      <Card padding="lg" className="relative w-full max-w-md border-border/80 bg-card/95 shadow-xl backdrop-blur">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck aria-hidden="true" className="size-6" />
          </div>
          <div className="text-2xl font-bold tracking-tight">{title}</div>
          {description ? <Text tone="muted" size="sm" className="mt-2 leading-relaxed">{description}</Text> : null}
        </div>
        {children}
        <div className="mt-6 flex items-center justify-center gap-2 border-t pt-4">
          <Tag>静态 Fixture</Tag>
          <code className="text-xs text-muted-foreground">{route}</code>
        </div>
      </Card>
    </div>
  );
}

export function DividerLabel({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-5 flex items-center justify-center">
      <div className="absolute inset-x-0 border-t" />
      <span className="relative bg-card px-2 text-xs uppercase text-muted-foreground">{children}</span>
    </div>
  );
}
