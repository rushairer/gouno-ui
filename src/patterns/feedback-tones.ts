export type FeedbackType = "error" | "success" | "warning" | "info";
export type FeedbackTone = FeedbackType | "danger" | "neutral" | "brand";

export const feedbackToneClasses: Record<FeedbackTone, string> = {
  error: "border-destructive/40 bg-danger-subtle text-destructive",
  danger: "border-destructive/40 bg-danger-subtle text-destructive",
  success: "border-success/40 bg-success-subtle text-success",
  warning: "border-warning/40 bg-warning-subtle text-warning",
  info: "border-info/40 bg-info-subtle text-info",
  neutral: "border-border bg-muted text-muted-foreground",
  brand: "border-primary/40 bg-accent text-accent-foreground",
};
