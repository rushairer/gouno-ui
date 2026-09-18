export type ControlSize = "small" | "middle" | "large";

export function controlSizeClass(size: ControlSize) {
  return {
    small: "h-[var(--control-height-small)] text-sm",
    middle: "h-[var(--control-height-middle)] text-sm",
    large: "h-[var(--control-height-large)] text-base",
  }[size];
}
