import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type DefinitionListProps = HTMLAttributes<HTMLDListElement>;
export function DefinitionList({ className, ...props }: DefinitionListProps) {
  return <dl {...props} className={cn("divide-y divide-border", className)} />;
}

export interface DefinitionRowProps {
  label: ReactNode;
  children: ReactNode;
  mono?: boolean;
  className?: string;
}

export function DefinitionRow({ label, children, mono, className }: DefinitionRowProps) {
  return (
    <div className={cn("grid gap-2 py-3 sm:grid-cols-[minmax(140px,1fr)_2fr]", className)}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn("min-w-0 break-words text-sm", mono && "font-mono")}>{children}</dd>
    </div>
  );
}
