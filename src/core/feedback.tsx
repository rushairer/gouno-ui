import type { ComponentProps } from "react";
import { Skeleton as PrimitiveSkeleton } from "../components/primitives/skeleton";

type SkeletonProps = ComponentProps<typeof PrimitiveSkeleton>;

export function Skeleton({
  "aria-hidden": ariaHidden,
  ...props
}: SkeletonProps) {
  return <PrimitiveSkeleton {...props} aria-hidden={ariaHidden ?? true} />;
}
