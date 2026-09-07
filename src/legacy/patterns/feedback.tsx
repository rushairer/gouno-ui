import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Alert } from "../components/primitives/alert";
import { cn } from "../lib/utils";
import {
  feedbackToneClasses,
  type FeedbackType,
} from "./feedback-tones";

export type { FeedbackType } from "./feedback-tones";

export interface FeedbackProps {
  type: FeedbackType;
  children: ReactNode;
  className?: string;
}

export function Feedback({ type, children, className }: FeedbackProps) {
  const Icon =
    type === "success" ? CheckCircle2 : type === "info" ? Info : AlertTriangle;

  return (
    <Alert
      role={type === "error" ? "alert" : "status"}
      className={cn(
        `feedback-${type}`,
        "feedback flex items-center gap-3 text-sm",
        feedbackToneClasses[type],
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </Alert>
  );
}
