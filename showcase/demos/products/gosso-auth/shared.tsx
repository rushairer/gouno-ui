import type { ReactNode } from "react";
import gossoLogo from "../../../../assets/brand-icons/gosso.svg";
import { Card, Heading, Text } from "../../../../src/core";
import { FixtureDock } from "../../../components/fixture-dock";

export function AuthSurface({
  children,
  route,
  title,
  description,
  fixtureControl,
}: {
  children: ReactNode;
  route: string;
  title: ReactNode;
  description?: ReactNode;
  fixtureControl?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
      <FixtureDock
        route={route}
        note="认证状态与路由均为 Showcase 静态 fixture；真实产品页面不会渲染这个工具。"
        controls={fixtureControl}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_38%),radial-gradient(circle_at_90%_90%,color-mix(in_srgb,var(--muted-foreground)_10%,transparent),transparent_42%)]" />
      <div className="relative w-full max-w-md">
        <Card padding="lg" variant="elevated" className="w-full border-border/80 bg-raised/95 backdrop-blur">
          <div className="mb-7 text-center">
            <img src={gossoLogo} alt="" aria-hidden="true" className="mx-auto mb-4 size-14" />
            <Heading level={1} className="text-2xl font-bold tracking-tight">{title}</Heading>
            {description ? <Text tone="muted" size="sm" className="mt-2 leading-relaxed">{description}</Text> : null}
          </div>
          {children}
        </Card>
      </div>
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