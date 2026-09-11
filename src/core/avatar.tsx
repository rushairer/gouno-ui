import {
  Children,
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Avatar as PrimitiveAvatar,
  AvatarBadge as PrimitiveAvatarBadge,
  AvatarFallback as PrimitiveAvatarFallback,
  AvatarGroup as PrimitiveAvatarGroup,
  AvatarGroupCount as PrimitiveAvatarGroupCount,
  AvatarImage as PrimitiveAvatarImage,
} from "../components/primitives/avatar";
import type { ControlSize } from "./control-types";

export type AvatarSize = ControlSize | number;
export type AvatarShape = "circle" | "square";
/** @deprecated Use `small`, `middle`, `large`, or a numeric size. */
export type AvatarLegacySize = "sm" | "default" | "lg";

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof PrimitiveAvatar>, "size" | "shape"> {
  size?: AvatarSize | AvatarLegacySize;
  shape?: AvatarShape;
}

export const Avatar = forwardRef<
  React.ComponentRef<typeof PrimitiveAvatar>,
  AvatarProps
>(function Avatar(props, ref) {
  return <PrimitiveAvatar {...props} ref={ref} />;
});

export const AvatarImage = PrimitiveAvatarImage;
export const AvatarFallback = PrimitiveAvatarFallback;
export const AvatarBadge = PrimitiveAvatarBadge;
export const AvatarGroupCount = PrimitiveAvatarGroupCount;

export type AvatarImageProps = ComponentProps<typeof AvatarImage>;
export type AvatarFallbackProps = ComponentProps<typeof AvatarFallback>;
export type AvatarBadgeProps = ComponentProps<typeof AvatarBadge>;
export type AvatarGroupCountProps = ComponentProps<typeof AvatarGroupCount>;

export interface AvatarGroupProps
  extends Omit<ComponentPropsWithoutRef<typeof PrimitiveAvatarGroup>, "children"> {
  children?: ReactNode;
  max?: number;
  overflowRender?: (omittedCount: number) => ReactNode;
}

export const AvatarGroup = forwardRef<
  React.ComponentRef<typeof PrimitiveAvatarGroup>,
  AvatarGroupProps
>(function AvatarGroup({ children, max, overflowRender, ...props }, ref) {
  const items = Children.toArray(children);
  const finiteMax =
    max !== undefined && Number.isFinite(max)
      ? Math.max(1, Math.floor(max))
      : undefined;
  const hasOverflow = finiteMax !== undefined && items.length > finiteMax;
  const visibleCount = hasOverflow ? Math.max(0, finiteMax - 1) : items.length;
  const omittedCount = items.length - visibleCount;

  return (
    <PrimitiveAvatarGroup
      {...props}
      ref={ref}
      data-max={finiteMax}
      data-overflow={hasOverflow || undefined}
    >
      {items.slice(0, visibleCount)}
      {hasOverflow ? (
        <PrimitiveAvatarGroupCount>
          {overflowRender ? overflowRender(omittedCount) : `+${omittedCount}`}
        </PrimitiveAvatarGroupCount>
      ) : null}
    </PrimitiveAvatarGroup>
  );
});
