import type { ReactNode } from "react";
import { Heading, Text } from "../core/typography";
import { cn } from "../lib/utils";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <Heading level={1} className="text-2xl leading-tight tracking-tight">
          {title}
        </Heading>
        {description ? (
          <Text tone="muted" size="sm" className="mt-2 max-w-3xl leading-relaxed">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
