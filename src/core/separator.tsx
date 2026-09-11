import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "solid" | "dashed" | "dotted";
export type SeparatorTitlePlacement = "start" | "center" | "end";
export type SeparatorSemantic = "root" | "line" | "content";
export type SeparatorClassNames = Partial<Record<SeparatorSemantic, string>>;
export type SeparatorStyles = Partial<Record<SeparatorSemantic, CSSProperties>>;

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Separator axis. */
  orientation?: SeparatorOrientation;
  /** Remove separator semantics when the line is purely visual. */
  decorative?: boolean;
  /** Line style. */
  variant?: SeparatorVariant;
  /** Optional horizontal title/content. Vertical separators remain line-only. */
  children?: ReactNode;
  /** Horizontal title placement when children are present. */
  titlePlacement?: SeparatorTitlePlacement;
  /** Semantic slot class overrides. */
  classNames?: SeparatorClassNames;
  /** Semantic slot style overrides. */
  styles?: SeparatorStyles;
}

function lineClass(orientation: SeparatorOrientation, variant: SeparatorVariant) {
  if (orientation === "vertical") {
    return cn(
      "h-full min-h-4 w-0 shrink-0",
      variant === "solid" && "border-l border-solid border-border",
      variant === "dashed" && "border-l border-dashed border-border",
      variant === "dotted" && "border-l border-dotted border-border",
    );
  }

  return cn(
    "h-0 min-w-0 border-t border-border",
    variant === "solid" && "border-solid",
    variant === "dashed" && "border-dashed",
    variant === "dotted" && "border-dotted",
  );
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  {
    orientation = "horizontal",
    decorative = true,
    variant = "solid",
    children,
    titlePlacement = "center",
    className,
    classNames,
    style,
    styles,
    role,
    ...props
  },
  ref,
) {
  const hasContent = orientation === "horizontal" && children !== undefined && children !== null;
  const semanticRole = role ?? (decorative ? "presentation" : "separator");

  if (!hasContent) {
    return (
      <div
        {...props}
        ref={ref}
        role={semanticRole}
        aria-orientation={!decorative ? orientation : undefined}
        data-slot="separator"
        data-orientation={orientation}
        data-variant={variant}
        className={cn(
          orientation === "vertical" ? "inline-flex self-stretch" : "flex w-full items-center",
          classNames?.root,
          className,
        )}
        style={{ ...styles?.root, ...style }}
      >
        <span
          aria-hidden="true"
          data-slot="separator-line"
          className={cn(
            lineClass(orientation, variant),
            orientation === "horizontal" ? "w-full" : undefined,
            classNames?.line,
          )}
          style={styles?.line}
        />
      </div>
    );
  }

  return (
    <div
      {...props}
      ref={ref}
      role={semanticRole}
      aria-orientation={!decorative ? "horizontal" : undefined}
      data-slot="separator"
      data-orientation="horizontal"
      data-variant={variant}
      data-title-placement={titlePlacement}
      className={cn("flex w-full items-center gap-3", classNames?.root, className)}
      style={{ ...styles?.root, ...style }}
    >
      <span
        aria-hidden="true"
        data-slot="separator-line"
        className={cn(
          lineClass("horizontal", variant),
          titlePlacement === "center" && "flex-1",
          titlePlacement === "start" && "basis-[5%]",
          titlePlacement === "end" && "flex-1",
          classNames?.line,
        )}
        style={styles?.line}
      />
      <span
        data-slot="separator-content"
        className={cn("shrink-0 text-sm text-muted-foreground", classNames?.content)}
        style={styles?.content}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        data-slot="separator-line"
        className={cn(
          lineClass("horizontal", variant),
          titlePlacement === "center" && "flex-1",
          titlePlacement === "start" && "flex-1",
          titlePlacement === "end" && "basis-[5%]",
          classNames?.line,
        )}
        style={styles?.line}
      />
    </div>
  );
});
