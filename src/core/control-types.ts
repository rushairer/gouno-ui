export type ControlSize = "small" | "middle" | "large";

export function controlSizeClass(size: ControlSize) {
  return {
    small: "control-height-small text-sm",
    middle: "control-height-middle text-sm",
    large: "control-height-large text-base",
  }[size];
}
