export type ControlSize = "small" | "middle" | "large";

export function controlSizeClass(size: ControlSize) {
  return {
    small: "h-8 text-sm",
    middle: "h-9 text-sm",
    large: "h-11 text-base",
  }[size];
}
