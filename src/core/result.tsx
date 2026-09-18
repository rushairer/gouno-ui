import type { HTMLAttributes, ReactNode } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { cn } from "../lib/utils";
import { Heading, Text, type HeadingLevel, type HeadingVariant } from "./typography";

export type ResultStatus = "success" | "error" | "info" | "warning";

export interface ResultProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  status?: ResultStatus;
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  headingLevel?: HeadingLevel;
  /** Visual title role, independent from the document heading level. */
  titleVariant?: HeadingVariant;
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
  titleVariant,
  className,
  ...props
}: ResultProps) {
  const resolvedTitleVariant = titleVariant ?? (headingLevel === 1 ? "task" : "section");

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
      <Heading
        level={headingLevel}
        variant={resolvedTitleVariant}
        data-slot="result-title"
        className="text-foreground"
      >
        {title}
      </Heading>
      {description != null ? (
        <Text
          as="div"
          size="sm"
          tone="muted"
          data-slot="result-description"
          className="max-w-xl"
        >
          {description}
        </Text>
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
