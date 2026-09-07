import { LoaderCircle } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import type { TableDensity } from "../components/primitives/table";
import { cn } from "../lib/utils";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">{title}</h1>
        {description ? <div className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</div> : null}
      </div>
      {action || actions ? <ActionGroup>{action || actions}</ActionGroup> : null}
    </header>
  );
}

export interface AdminPageStateProps {
  title: ReactNode;
  description?: ReactNode;
  label: ReactNode;
}

export function AdminPageState({ title, description, label }: AdminPageStateProps) {
  return (
    <AdminPage>
      <PageHeader title={title} description={description} />
      <div role="status" className="flex items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
        {label}
      </div>
    </AdminPage>
  );
}

export type AdminPageProps = HTMLAttributes<HTMLDivElement>;
export function AdminPage({ className, ...props }: AdminPageProps) {
  return <div {...props} data-slot="admin-page" className={cn("mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-6", className)} />;
}

export type ContentStackProps = HTMLAttributes<HTMLDivElement>;
export function ContentStack({ className, ...props }: ContentStackProps) {
  return <div {...props} className={cn("flex min-w-0 flex-col gap-6", className)} />;
}

export type ActionGroupProps = HTMLAttributes<HTMLDivElement>;
export function ActionGroup({ className, ...props }: ActionGroupProps) {
  return <div {...props} className={cn("flex flex-wrap items-center gap-2", className)} />;
}

export type FilterBarProps = HTMLAttributes<HTMLDivElement>;
export function FilterBar({ className, ...props }: FilterBarProps) {
  return <div {...props} className={cn("flex flex-wrap items-end gap-3", className)} />;
}

export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  density?: TableDensity;
}
export function TableContainer({ density = "default", className, ...props }: TableContainerProps) {
  return <div {...props} data-slot="table-container" data-density={density} className={cn("min-w-0 overflow-x-auto rounded-lg border", className)} />;
}

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
  compact?: boolean;
}
export function ButtonGroup({ align, compact: _compact, className, ...props }: ButtonGroupProps) {
  return <ActionGroup {...props} className={cn(align === "right" && "justify-end", className)} />;
}
