import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../components/primitives/empty";
import { Button } from "../core/button";
import { cn } from "../lib/utils";

export interface EmptyStateProps {
  title?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  label,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={cn("border-0 py-12", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon ?? <Inbox />}</EmptyMedia>
        <EmptyTitle>{label ?? title ?? "暂无数据"}</EmptyTitle>
        {description !== undefined ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action !== undefined ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}

export type ErrorStateProps = EmptyStateProps;

export function ErrorState(props: ErrorStateProps) {
  return (
    <div role="alert">
      <EmptyState
        {...props}
        title={props.title ?? "加载失败"}
        icon={props.icon ?? <AlertTriangle className="text-destructive" />}
      />
    </div>
  );
}

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label, className }: LoadingStateProps) {
  const resolvedLabel =
    label ??
    (typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
      ? "Loading…"
      : "正在加载…");

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-3 py-12 text-sm text-muted-foreground",
        className,
      )}
    >
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
      {resolvedLabel}
    </div>
  );
}

export interface AsyncStateProps {
  loading: boolean;
  loadingLabel?: string;
  loadingMessage?: string;
  skeleton?: ReactNode;
  error?: string | null;
  empty?: boolean;
  emptyState?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  emptyIcon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  children: ReactNode;
}

export function AsyncState({
  loading,
  loadingLabel,
  loadingMessage,
  skeleton,
  error,
  empty,
  emptyState,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyIcon,
  onRetry,
  retryLabel,
  children,
}: AsyncStateProps) {
  if (loading) {
    return <>{skeleton ?? <LoadingState label={loadingLabel ?? loadingMessage} />}</>;
  }

  if (error) {
    const fallbackRetryLabel = /[\u4e00-\u9fff]/.test(error) ? "重试" : "Retry";
    return (
      <ErrorState
        title={error}
        action={
          onRetry ? (
            <Button onClick={onRetry} aria-label={retryLabel ?? fallbackRetryLabel}>
              {retryLabel ?? fallbackRetryLabel}
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (empty) {
    return (
      <>
        {emptyState ?? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            icon={emptyIcon}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
