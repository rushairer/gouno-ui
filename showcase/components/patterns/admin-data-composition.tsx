import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, Heading, Text } from "../../../src/core";

export function CompositionContractLead({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header
      data-slot="showcase-composition-contract-lead"
      className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="min-w-0">
        <Heading level={2} variant="section" className="text-foreground">{title}</Heading>
        <Text size="sm" tone="muted" leading="relaxed" className="mt-1 max-w-3xl">
          {description}
        </Text>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

export function CollectionComposition({
  feedback,
  summary,
  toolbar,
  data,
  pagination,
  selection,
}: {
  feedback?: ReactNode;
  summary?: ReactNode;
  toolbar: ReactNode;
  data: ReactNode;
  pagination?: ReactNode;
  selection?: ReactNode;
}) {
  return (
    <section data-pattern="collection-composition" className="flex min-w-0 flex-col gap-5">
      {feedback ? <div data-slot="collection-feedback">{feedback}</div> : null}
      {summary ? <div data-slot="collection-summary">{summary}</div> : null}
      <div data-slot="collection-toolbar">{toolbar}</div>
      {selection ? <div data-slot="collection-selection">{selection}</div> : null}
      <div data-slot="collection-data-view">{data}</div>
      {pagination ? <div data-slot="collection-pagination">{pagination}</div> : null}
    </section>
  );
}

export function RecordDetailComposition({
  identity,
  feedback,
  summary,
  children,
  actions,
}: {
  identity: ReactNode;
  feedback?: ReactNode;
  summary?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section data-pattern="record-detail-composition" className="flex min-w-0 flex-col gap-5">
      <div data-slot="record-identity">{identity}</div>
      {feedback ? <div data-slot="record-feedback">{feedback}</div> : null}
      {summary ? <div data-slot="record-summary">{summary}</div> : null}
      <div data-slot="record-sections" className="flex min-w-0 flex-col gap-5">
        {children}
      </div>
      {actions ? <div data-slot="record-actions">{actions}</div> : null}
    </section>
  );
}

export function MasterDetailComposition({
  master,
  detail,
}: {
  master: ReactNode;
  detail: ReactNode;
}) {
  return (
    <section
      data-pattern="master-detail-composition"
      className="grid min-h-[30rem] min-w-0 overflow-hidden rounded-xl border bg-background xl:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]"
    >
      <aside
        data-slot="master-detail-master"
        aria-label="Master"
        className="min-w-0 border-b bg-muted/[0.08] xl:border-b-0 xl:border-r"
      >
        {master}
      </aside>
      <div data-slot="master-detail-detail" className="min-w-0">
        {detail}
      </div>
    </section>
  );
}

export function SettingsComposition({
  feedback,
  children,
  actions,
}: {
  feedback?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section data-pattern="settings-composition" className="flex min-w-0 flex-col gap-5">
      {feedback ? <div data-slot="settings-feedback">{feedback}</div> : null}
      <div data-slot="settings-sections" className="flex min-w-0 flex-col gap-5">
        {children}
      </div>
      {actions ? <div data-slot="settings-actions">{actions}</div> : null}
    </section>
  );
}

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card padding="none" data-pattern="settings-section" className="overflow-hidden">
      <CardHeader className="border-b p-6">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <Text size="xs" tone="muted" leading="relaxed" className="mt-1">
              {description}
            </Text>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

export function DataSummaryComposition({
  items,
}: {
  items: Array<{
    label: ReactNode;
    value: ReactNode;
    detail?: ReactNode;
  }>;
}) {
  return (
    <section
      data-pattern="data-summary-composition"
      aria-label="数据摘要"
      className="grid overflow-hidden rounded-xl border bg-background sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="min-w-0 border-b p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
        >
          <Text size="xs" tone="muted">{item.label}</Text>
          <div data-typography-role="metric-compact" className="mt-1 type-metric-compact">{item.value}</div>
          {item.detail ? (
            <Text size="xs" tone="muted" className="mt-1">
              {item.detail}
            </Text>
          ) : null}
        </div>
      ))}
    </section>
  );
}
