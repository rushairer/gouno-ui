"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type TableDensity = "default" | "compact" | "touch";
export type CaptionSide = "top" | "bottom";
export interface TableProps extends React.ComponentProps<"table"> {
  density?: TableDensity;
  bordered?: boolean;
  fixed?: boolean;
  stickyHeader?: boolean;
  containerClassName?: string;
}
export type TableHeaderProps = React.ComponentProps<"thead">;
export type TableBodyProps = React.ComponentProps<"tbody">;
export type TableFooterProps = React.ComponentProps<"tfoot">;
export type TableRowProps = React.ComponentProps<"tr">;
export type TableHeadProps = React.ComponentProps<"th">;
export type TableCellProps = React.ComponentProps<"td">;
export interface TableCaptionProps extends React.ComponentProps<"caption"> {
  captionSide?: CaptionSide;
}

function Table({
  density = "default",
  bordered = false,
  fixed = false,
  stickyHeader = false,
  containerClassName,
  className,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      data-density={density}
      data-bordered={bordered || undefined}
      data-sticky-header={stickyHeader || undefined}
      className={cn(
        "relative w-full overflow-x-auto rounded-lg",
        bordered ? "border border-border/80 bg-card shadow-surface" : "bg-card/40",
        containerClassName,
      )}
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm text-foreground",
          density === "compact"
            ? "[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2"
            : density === "touch"
              ? "[&_th]:px-4 [&_th]:py-4 [&_td]:px-4 [&_td]:py-4"
              : "[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3",
          bordered &&
            (density === "compact"
              ? "[&_tr>*:first-child]:pl-4 [&_tr>*:last-child]:pr-4"
              : "[&_tr>*:first-child]:pl-6 [&_tr>*:last-child]:pr-6"),
          "[&_tfoot_th]:align-middle [&_tfoot_td]:align-middle",
          density === "compact"
            ? "[&_tfoot_th]:h-10 [&_tfoot_td]:h-10"
            : density === "touch"
              ? "[&_tfoot_th]:h-14 [&_tfoot_td]:h-14"
              : "[&_tfoot_th]:h-12 [&_tfoot_td]:h-12",
          "[&_tfoot_tr]:border-t-2 [&_tfoot_tr]:border-border/80",
          fixed && "table-fixed",
          bordered &&
            "[&_td]:border-r [&_th]:border-r [&_tr>*:last-child]:border-r-0",
          stickyHeader &&
            "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-background",
          "[&_thead_th]:bg-muted/60",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-border/70", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/60 transition-colors hover:bg-accent/60 has-aria-expanded:bg-accent/40 data-[state=selected]:bg-primary/10",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  captionSide = "top",
  ...props
}: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      data-caption-side={captionSide}
      className={cn(
        "px-4 py-3 text-center text-sm leading-6 text-muted-foreground",
        captionSide === "bottom" &&
          "caption-side-bottom shadow-[inset_0_1px_0_color-mix(in_srgb,var(--border)_60%,transparent)]",
        captionSide === "top" &&
          "caption-side-top shadow-[inset_0_-1px_0_color-mix(in_srgb,var(--border)_60%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
