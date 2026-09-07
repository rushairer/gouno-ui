import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "../core/icon-button";
import { cn } from "../lib/utils";
import { ActionGroup } from "./page";

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

export function Panel({ as: Component = "section", className, children, ...props }: PanelProps) {
  return (
    <Component
      {...props}
      data-slot="panel"
      className={cn("flex min-w-0 flex-col gap-5 rounded-lg border bg-card p-4 text-card-foreground md:p-6", className)}
    >
      {children}
    </Component>
  );
}

export interface PanelHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
}

export function PanelHeader({ title, description, actions, action, headingLevel = 2, className }: PanelHeaderProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="min-w-0">
        <Heading className="text-base font-semibold tracking-tight">{title}</Heading>
        {description ? <div className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</div> : null}
      </div>
      {actions || action ? <ActionGroup>{actions || action}</ActionGroup> : null}
    </header>
  );
}

export type PanelBodyProps = HTMLAttributes<HTMLDivElement> & { stack?: boolean; flush?: boolean };

export function PanelBody({ stack, flush: _flush, className, ...props }: PanelBodyProps) {
  return <div {...props} className={cn("min-w-0", stack && "flex flex-col gap-6", className)} />;
}

export interface PlainSectionProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PlainSection({ title, children, className }: PlainSectionProps) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4 border-t py-5 first:border-0 first:pt-0", className)}>
      {title ? <h3 className="text-sm font-semibold">{title}</h3> : null}
      {children}
    </section>
  );
}

export interface SectionHeadingProps {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, action, className }: SectionHeadingProps) {
  return <PanelHeader title={title} action={action} className={className} />;
}

export interface EditorPanelProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function EditorPanel({ title, description, icon, closeLabel, onClose, children, className }: EditorPanelProps) {
  return (
    <Panel className={cn("editor-panel", className)}>
      <PanelHeader
        title={<span className="flex items-center gap-2">{icon}{title}</span>}
        description={description}
        action={<IconButton label={closeLabel} icon={<X />} onClick={onClose} />}
      />
      {children}
    </Panel>
  );
}
