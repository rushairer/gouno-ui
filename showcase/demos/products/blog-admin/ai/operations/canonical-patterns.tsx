import type { ReactNode } from "react";
import { Text } from "../../../../../../src/core";

export type OpsSummaryItem = {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
};

export function OpsObjectRow({
  title,
  status,
  meta,
  summary,
  signals,
  selected = false,
  onClick,
  ariaLabel,
}: {
  title: ReactNode;
  status?: ReactNode;
  meta?: ReactNode;
  summary?: ReactNode;
  signals?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={selected}
      className={[
        "group w-full border-b px-[18px] py-4 text-left last:border-b-0",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        selected ? "bg-primary/5" : "hover:bg-muted/35",
      ].join(" ")}
      onClick={onClick}
    >
      <span className="flex min-w-0 flex-col gap-2">
        <span className="flex min-w-0 items-start justify-between gap-3">
          <strong className="min-w-0 flex-1 text-sm font-semibold leading-5 text-foreground">
            {title}
          </strong>
          {status ? <span className="shrink-0 pt-px">{status}</span> : null}
        </span>
        {meta ? (
          <span className="block text-xs leading-4 text-muted-foreground">{meta}</span>
        ) : null}
        {summary ? (
          <span className="block text-sm leading-5 text-foreground/80">{summary}</span>
        ) : null}
        {signals ? (
          <span className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {signals}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function OpsSummaryStrip({
  items,
  ariaLabel,
}: {
  items: OpsSummaryItem[];
  ariaLabel?: string;
}) {
  return (
    <dl
      className="grid border-y py-3 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={[
            "min-w-0 py-2",
            index === 0 ? "xl:pr-5" : "xl:px-5",
            index === items.length - 1 ? "xl:pr-0" : "",
          ].join(" ")}
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 min-w-0 text-sm font-semibold text-foreground">
            {item.value}
          </dd>
          {item.detail ? (
            <Text size="xs" tone="muted" className="mt-1">
              {item.detail}
            </Text>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function OpsRegionHeading({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function OpsMeta({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5">{children}</span>;
}
