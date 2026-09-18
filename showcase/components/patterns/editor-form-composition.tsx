import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormActions,
  Text,
} from "../../../src/core";

export function EditorFormStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="showcase-editor-form-stack"
      data-pattern="editor-form-composition"
      className={className ? `flex flex-col gap-5 ${className}` : "flex flex-col gap-5"}
    >
      {children}
    </div>
  );
}

export function EditorFieldStack({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="showcase-editor-field-stack"
      data-pattern="editor-field-stack"
      className="flex flex-col gap-5"
    >
      {children}
    </div>
  );
}

export function EditorFormSurfaceSection({
  title,
  description,
  actions,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card
      padding="none"
      data-slot="showcase-editor-form-section"
      data-pattern="editor-form-section"
      className="overflow-hidden"
    >
      <CardHeader className="border-b p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? (
              <Text size="xs" tone="muted" className="mt-1 leading-relaxed">
                {description}
              </Text>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

export function EditorFormActions({ children }: { children: ReactNode }) {
  return (
    <div data-slot="showcase-editor-form-actions" data-pattern="editor-form-actions">
      <FormActions>{children}</FormActions>
    </div>
  );
}
