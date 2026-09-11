import {
  cloneElement,
  forwardRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
} from "react";
import { cn } from "../lib/utils";

export type IconSize = "small" | "middle" | "large" | number;
type IconSvgProps = ComponentPropsWithRef<"svg">;

export interface IconProps extends Omit<IconSvgProps, "children"> {
  /** SVG icon element to render. */
  icon: ReactElement<IconSvgProps>;
  /** Apply the canonical loading rotation animation. */
  spin?: boolean;
  /** Clockwise rotation in degrees. */
  rotate?: number;
  /** Semantic icon size or an explicit pixel size. */
  size?: IconSize;
}

const sizeClass: Record<Exclude<IconSize, number>, string> = {
  small: "size-3.5",
  middle: "size-4",
  large: "size-5",
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    icon,
    spin = false,
    rotate,
    size = "middle",
    className,
    style,
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-hidden": ariaHidden,
    ...props
  },
  ref,
) {
  const labelled = Boolean(ariaLabel || ariaLabelledBy);
  const numericSize = typeof size === "number" ? Math.max(0, size) : undefined;
  const transforms = [
    icon.props.style?.transform,
    rotate !== undefined ? `rotate(${rotate}deg)` : undefined,
    style?.transform,
  ].filter(Boolean);

  const mergedStyle: CSSProperties = {
    ...icon.props.style,
    ...style,
    ...(numericSize !== undefined
      ? { width: numericSize, height: numericSize }
      : undefined),
    ...(transforms.length > 0 ? { transform: transforms.join(" ") } : undefined),
  };

  return cloneElement(icon, {
    ...props,
    ref,
    "data-slot": "icon",
    className: cn(
      "inline-block shrink-0",
      typeof size === "number" ? undefined : sizeClass[size],
      spin && "animate-spin",
      icon.props.className,
      className,
    ),
    style: mergedStyle,
    role: role ?? icon.props.role ?? (labelled ? "img" : undefined),
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-hidden": ariaHidden ?? (labelled ? undefined : true),
  });
});
