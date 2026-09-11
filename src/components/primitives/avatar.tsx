"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar as AvatarPrimitive } from "radix-ui";

type AvatarPrimitiveSize =
  | "small"
  | "middle"
  | "large"
  | number
  | "sm"
  | "default"
  | "lg";
type AvatarPrimitiveShape = "circle" | "square";

type AvatarRootProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  size?: AvatarPrimitiveSize;
  shape?: AvatarPrimitiveShape;
};

function normalizeSize(size: AvatarPrimitiveSize) {
  if (typeof size === "number") return Math.max(0, size);
  if (size === "sm") return "small" as const;
  if (size === "default") return "middle" as const;
  if (size === "lg") return "large" as const;
  return size;
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarRootProps
>(function Avatar(
  { className, size = "middle", shape = "circle", style, ...props },
  ref,
) {
  const resolvedSize = normalizeSize(size);
  const numericSize = typeof resolvedSize === "number" ? resolvedSize : undefined;

  return (
    <AvatarPrimitive.Root
      {...props}
      ref={ref}
      data-slot="avatar"
      data-size={numericSize === undefined ? resolvedSize : "custom"}
      data-shape={shape}
      className={cn(
        "group/avatar relative flex shrink-0 overflow-hidden select-none",
        numericSize === undefined && resolvedSize === "small" && "size-6",
        numericSize === undefined && resolvedSize === "middle" && "size-8",
        numericSize === undefined && resolvedSize === "large" && "size-10",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className,
      )}
      style={{
        ...style,
        ...(numericSize !== undefined
          ? { width: numericSize, height: numericSize }
          : undefined),
      }}
    />
  );
});

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      {...props}
      ref={ref}
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
    />
  );
});

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted text-sm text-muted-foreground",
        "group-data-[size=small]/avatar:text-xs",
        className,
      )}
    />
  );
});

const AvatarBadge = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  function AvatarBadge({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        data-slot="avatar-badge"
        className={cn(
          "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
          "group-data-[size=small]/avatar:size-2 group-data-[size=small]/avatar:[&>svg]:hidden",
          "group-data-[size=middle]/avatar:size-2.5 group-data-[size=middle]/avatar:[&>svg]:size-2",
          "group-data-[size=large]/avatar:size-3 group-data-[size=large]/avatar:[&>svg]:size-2",
          className,
        )}
      />
    );
  },
);

const AvatarGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function AvatarGroup({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        data-slot="avatar-group"
        className={cn(
          "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
          className,
        )}
      />
    );
  },
);

const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function AvatarGroupCount({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background",
        "group-has-data-[size=large]/avatar-group:size-10 group-has-data-[size=small]/avatar-group:size-6",
        "[&>svg]:size-4 group-has-data-[size=large]/avatar-group:[&>svg]:size-5 group-has-data-[size=small]/avatar-group:[&>svg]:size-3",
        className,
      )}
    />
  );
});

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
