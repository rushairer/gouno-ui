import type { HTMLAttributes, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/primitives/table";
import { Card } from "../core/card";
import { Skeleton } from "../core/feedback";
import { cn } from "../lib/utils";

export type PageSkeletonLayout = "collection" | "form" | "dashboard";

type PageSkeletonCommonProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "aria-busy" | "aria-label" | "aria-live" | "children" | "role"
> & {
  /** Localized accessible name for the loading region. */
  "aria-label": string;
};

export type PageSkeletonProps =
  | (PageSkeletonCommonProps & {
      layout: "collection";
      /** Number of placeholder rows. */
      rows?: number;
      /** Number of low-fidelity desktop placeholder columns. */
      columns?: number;
      /** Whether to reserve pagination geometry. */
      pagination?: boolean;
    })
  | (PageSkeletonCommonProps & {
      layout: "form";
      /** Number of field-shaped placeholders. */
      fields?: number;
    })
  | (PageSkeletonCommonProps & {
      layout: "dashboard";
      /** Number of statistic cards. */
      statistics?: number;
      /** Number of larger dashboard content sections. */
      sections?: number;
    });

function boundedCount(value: number | undefined, fallback: number, max: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(Math.floor(value ?? fallback), max));
}

function LoadingRegion({
  layout,
  label,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "aria-label" | "children"> & {
  layout: PageSkeletonLayout;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      {...props}
      data-slot="page-skeleton"
      data-layout={layout}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn("flex min-w-0 flex-col gap-5", className)}
    >
      {children}
    </div>
  );
}

function CollectionSkeleton({
  rows = 5,
  columns = 5,
  pagination = true,
  "aria-label": ariaLabel,
  className,
  ...props
}: Extract<PageSkeletonProps, { layout: "collection" }>) {
  const rowCount = boundedCount(rows, 5, 12);
  const columnCount = boundedCount(columns, 5, 8);
  const columnWidths = ["w-4/5", "w-20", "w-24", "w-16", "w-28", "w-14"];

  return (
    <LoadingRegion
      {...props}
      layout="collection"
      label={ariaLabel}
      className={className}
    >
      <div className="hidden md:block" aria-hidden="true">
        <Table density="compact" bordered>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }, (_, columnIndex) => (
                <TableHead key={columnIndex}>
                  <Skeleton className={cn("h-4", columnWidths[columnIndex % columnWidths.length])} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }, (_, columnIndex) => (
                  <TableCell key={columnIndex}>
                    <Skeleton
                      className={cn(
                        "h-4",
                        columnIndex === 0
                          ? rowIndex % 2 === 0
                            ? "w-4/5"
                            : "w-2/3"
                          : columnWidths[(columnIndex + rowIndex) % columnWidths.length],
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden" aria-hidden="true">
        {Array.from({ length: Math.min(rowCount, 5) }, (_, index) => (
          <Card key={index} padding="base">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-3 w-4/5" />
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pagination ? (
        <div
          aria-hidden="true"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ) : null}
    </LoadingRegion>
  );
}

function FormSkeleton({
  fields = 6,
  "aria-label": ariaLabel,
  className,
  ...props
}: Extract<PageSkeletonProps, { layout: "form" }>) {
  const fieldCount = boundedCount(fields, 6, 16);

  return (
    <LoadingRegion {...props} layout="form" label={ariaLabel} className={className}>
      <Card padding="none" className="gap-0" aria-hidden="true">
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          {Array.from({ length: fieldCount }, (_, index) => (
            <div key={index} className="flex min-w-0 flex-col gap-2">
              <Skeleton className={cn("h-4", index % 3 === 0 ? "w-28" : "w-20")} />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
      </Card>
    </LoadingRegion>
  );
}

function DashboardSkeleton({
  statistics = 4,
  sections = 2,
  "aria-label": ariaLabel,
  className,
  ...props
}: Extract<PageSkeletonProps, { layout: "dashboard" }>) {
  const statisticCount = boundedCount(statistics, 4, 8);
  const sectionCount = boundedCount(sections, 2, 6);

  return (
    <LoadingRegion
      {...props}
      layout="dashboard"
      label={ariaLabel}
      className={className}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {Array.from({ length: statisticCount }, (_, index) => (
          <Card key={index} padding="base">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2" aria-hidden="true">
        {Array.from({ length: sectionCount }, (_, index) => (
          <Card key={index} padding="base">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center justify-between gap-4">
                  <Skeleton className={cn("h-4", rowIndex % 2 === 0 ? "w-3/5" : "w-2/5")} />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </LoadingRegion>
  );
}

export function PageSkeleton(props: PageSkeletonProps) {
  if (props.layout === "collection") return <CollectionSkeleton {...props} />;
  if (props.layout === "form") return <FormSkeleton {...props} />;
  return <DashboardSkeleton {...props} />;
}
