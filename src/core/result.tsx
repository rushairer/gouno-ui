import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { cn } from "../lib/utils";
import type { HeadingLevel } from "./typography";

export type ResultStatus = "success" | "error" | "info" | "warning";

export interface ResultProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  status?: ResultStatus;
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  headingLevel?: HeadingLevel;
}

const statusIcons: Record<ResultStatus, ReactNode> = {
  success: <CircleCheck aria-hidden="true" />,
  error: <CircleX aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
  warning: <TriangleAlert aria-hidden="true" />,
};

const statusClassName: Record<ResultStatus, string> = {
  success: "bg-success-subtle text-success",
  error: "bg-danger-subtle text-destructive",
  info: "bg-info-subtle text-info",
  warning: "bg-warning-subtle text-warning",
};

export function Result({
  status = "info",
  title,
  description,
  extra,
  children,
  headingLevel = 2,
  className,
  ...props
}: ResultProps) {
  const Title = `h${headingLevel}` as ElementType;

  return (
    <section
      {...props}
      data-slot="result"
      data-status={status}
      className={cn(
        "flex flex-col items-center gap-3 p-8 text-center",
        className,
      )}
    >
      <div
        data-slot="result-icon"
        aria-hidden="true"
        className={cn(
          "flex size-12 items-center justify-center rounded-full [&_svg]:size-7",
          statusClassName[status],
        )}
      >
        {statusIcons[status]}
      </div>
      <Title
        data-slot="result-title"
        className={cn(
          "font-semibold tracking-tight text-foreground",
          headingLevel === 1 ? "text-2xl" : "text-xl",
        )}
      >
        {title}
      </Title>
      {description != null ? (
        <div
          data-slot="result-description"
          className="max-w-xl text-sm text-muted-foreground"
        >
          {description}
        </div>
      ) : null}
      {extra != null ? <div data-slot="result-extra">{extra}</div> : null}
      {children != null ? (
        <div data-slot="result-content" className="w-full">
          {children}
        </div>
      ) : null}
    </section>
  );
}
