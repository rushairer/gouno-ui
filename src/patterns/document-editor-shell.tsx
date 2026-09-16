import type { HTMLAttributes, ReactNode } from "react";
import { Card } from "../core/card";
import { cn } from "../lib/utils";

export interface DocumentEditorShellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  header: ReactNode;
  navigator?: ReactNode;
  inspector?: ReactNode;
  children: ReactNode;
  canvasAriaLabel?: string;
  navigatorAriaLabel?: string;
  inspectorAriaLabel?: string;
}

export function DocumentEditorShell({
  header,
  navigator,
  inspector,
  children,
  canvasAriaLabel = "文档编辑画布",
  navigatorAriaLabel = "文档导航",
  inspectorAriaLabel = "文档属性",
  className,
  "aria-label": ariaLabel = "文档编辑器",
  ...props
}: DocumentEditorShellProps) {
  const columns = navigator
    ? "xl:grid-cols-[14rem_minmax(0,1fr)_20rem]"
    : "xl:grid-cols-[minmax(0,1fr)_20rem]";

  return (
    <Card
      padding="none"
      className={cn("gap-0 overflow-clip", className)}
      aria-label={ariaLabel}
      data-slot="document-editor-shell"
      {...props}
    >
      <header
        className="flex min-h-16 flex-col gap-3 border-b px-5 py-3 lg:flex-row lg:items-center"
        data-slot="document-editor-command-bar"
      >
        {header}
      </header>

      <div className={cn("grid min-w-0", columns)} data-slot="document-editor-workspace">
        {navigator ? (
          <aside
            className="min-w-0 border-b bg-muted/10 p-4 xl:border-b-0 xl:border-r"
            aria-label={navigatorAriaLabel}
            data-slot="document-editor-navigator"
          >
            {navigator}
          </aside>
        ) : null}

        <main
          className="min-w-0 border-b p-5 xl:border-b-0 xl:p-6"
          aria-label={canvasAriaLabel}
          data-slot="document-editor-canvas"
        >
          {children}
        </main>

        {inspector ? (
          <aside
            className="min-w-0 bg-muted/[0.025] p-5 xl:border-l"
            aria-label={inspectorAriaLabel}
            data-slot="document-editor-inspector"
          >
            {inspector}
          </aside>
        ) : null}
      </div>
    </Card>
  );
}
