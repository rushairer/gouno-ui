import type { ReactNode } from "react";
import type { TableDensity } from "../components/primitives/table";
import { cn } from "../lib/utils";
import { PageHeader, Panel } from "./layout";

export interface DashboardTemplateProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  stateControls?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardTemplate({
  title,
  description,
  actions,
  stateControls,
  children,
  className,
}: DashboardTemplateProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-6", className)}>
      <PageHeader title={title} description={description} actions={actions} />
      {stateControls}
      {children}
    </div>
  );
}

export interface ListPageTemplateProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  stateControls?: ReactNode;
  children: ReactNode;
}

export function ListPageTemplate({
  title,
  description,
  action,
  stateControls,
  children,
}: ListPageTemplateProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader title={title} description={description} action={action} />
      {stateControls}
      {children}
    </div>
  );
}

export interface EditorWorkspaceTemplateProps {
  outline?: ReactNode;
  canvas: ReactNode;
  inspector: ReactNode;
  className?: string;
}

export function EditorWorkspaceTemplate({
  outline,
  canvas,
  inspector,
  className,
}: EditorWorkspaceTemplateProps) {
  return (
    <div
      data-slot="editor-workspace"
      className={cn(
        "grid min-w-0 gap-6 xl:grid-cols-[200px_minmax(0,1fr)_320px]",
        className,
      )}
    >
      {outline ? (
        <aside data-slot="editor-outline" className="hidden min-w-0 xl:block">
          <Panel className="h-full">{outline}</Panel>
        </aside>
      ) : null}
      <section data-slot="editor-canvas" className="min-w-0">
        {canvas}
      </section>
      <aside data-slot="editor-inspector" className="min-w-0">
        {inspector}
      </aside>
    </div>
  );
}

export interface ResponsiveListProps {
  table: ReactNode;
  mobile: ReactNode;
  density?: TableDensity;
}

export function ResponsiveList({
  table,
  mobile,
  density = "default",
}: ResponsiveListProps) {
  return (
    <div data-slot="responsive-list" data-density={density} className="min-w-0">
      <div className="hidden md:block">{table}</div>
      <div className="grid gap-3 md:hidden">{mobile}</div>
    </div>
  );
}
