import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

export type SplitterOrientation = "horizontal" | "vertical";

export interface SplitterPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  /** Initial panel share in percent when Splitter.defaultSizes is not provided. */
  defaultSize?: number;
  /** Minimum panel share in percent while resizing. */
  min?: number;
  /** Maximum panel share in percent while resizing. */
  max?: number;
  /** Disables both adjacent resize handles when false. */
  resizable?: boolean;
}

export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>(
  function SplitterPanel(
    {
      defaultSize: _defaultSize,
      min: _min,
      max: _max,
      resizable = true,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        data-slot="splitter-panel"
        data-resizable={resizable || undefined}
        className={cn("min-h-0 min-w-0 overflow-auto", className)}
      />
    );
  },
);

export interface SplitterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onResize"> {
  /** Canonical compound content. Direct children should be SplitterPanel. */
  children?: ReactNode;
  orientation?: SplitterOrientation;
  /** Controlled panel shares. Values are normalized to a 100 percent total. */
  sizes?: readonly number[];
  /** Uncontrolled initial panel shares. Values are normalized to a 100 percent total. */
  defaultSizes?: readonly number[];
  /** Canonical full-size-vector change callback. */
  onSizesChange?: (sizes: readonly number[]) => void;
  onResizeStart?: (sizes: readonly number[]) => void;
  onResizeEnd?: (sizes: readonly number[]) => void;
  /** Keyboard resize increment in percentage points. Shift multiplies it by five. */
  step?: number;

  /** @deprecated Prefer SplitterPanel children. */
  first?: ReactNode;
  /** @deprecated Prefer SplitterPanel children. */
  second?: ReactNode;
  /** @deprecated Prefer defaultSizes or SplitterPanel.defaultSize. */
  defaultSize?: number;
  /** @deprecated Prefer SplitterPanel.min. Applies to the legacy first panel. */
  min?: number;
  /** @deprecated Prefer SplitterPanel.max. Applies to the legacy first panel. */
  max?: number;
  /** @deprecated Use onSizesChange. Retained with the original first-panel number contract. */
  onResize?: (size: number) => void;
}

type PanelConfig = {
  min: number;
  max: number;
  resizable: boolean;
  defaultSize?: number;
};

type DragState = {
  index: number;
  startCoordinate: number;
  startSizes: number[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function finitePercent(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value)
    ? clamp(value, 0, 100)
    : fallback;
}

function equalSizes(count: number) {
  if (count <= 0) return [];
  return Array.from({ length: count }, () => 100 / count);
}

function normalizeSizes(values: readonly number[] | undefined, count: number) {
  if (!values || values.length !== count) return equalSizes(count);
  const sanitized = values.map((value) =>
    Number.isFinite(value) ? Math.max(0, value) : 0,
  );
  const total = sanitized.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return equalSizes(count);
  return sanitized.map((value) => (value / total) * 100);
}

function initialPanelSizes(
  panels: ReactElement<SplitterPanelProps>[],
  defaultSizes: readonly number[] | undefined,
  legacyDefaultSize: number | undefined,
) {
  if (defaultSizes) return normalizeSizes(defaultSizes, panels.length);
  if (legacyDefaultSize !== undefined && panels.length === 2) {
    const first = finitePercent(legacyDefaultSize, 50);
    return normalizeSizes([first, 100 - first], 2);
  }

  const declared = panels.map((panel) => panel.props.defaultSize);
  if (!declared.some((value) => value !== undefined)) return equalSizes(panels.length);

  const specifiedTotal = declared.reduce<number>(
    (sum, value) => sum + (value === undefined ? 0 : finitePercent(value, 0)),
    0,
  );
  const unspecifiedCount = declared.filter((value) => value === undefined).length;
  const remaining = Math.max(0, 100 - specifiedTotal);
  const fallback = unspecifiedCount > 0 ? remaining / unspecifiedCount : 0;
  return normalizeSizes(
    declared.map((value) =>
      value === undefined ? fallback : finitePercent(value, 0),
    ),
    panels.length,
  );
}

function panelConfig(panel: ReactElement<SplitterPanelProps>): PanelConfig {
  const min = finitePercent(panel.props.min, 0);
  const max = Math.max(min, finitePercent(panel.props.max, 100));
  return {
    min,
    max,
    resizable: panel.props.resizable !== false,
    defaultSize: panel.props.defaultSize,
  };
}

function assignRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

const SplitterRoot = forwardRef<HTMLDivElement, SplitterProps>(function Splitter(
  {
    children,
    orientation = "horizontal",
    sizes,
    defaultSizes,
    onSizesChange,
    onResizeStart,
    onResizeEnd,
    step = 1,
    first,
    second,
    defaultSize,
    min,
    max,
    onResize,
    className,
    ...props
  },
  forwardedRef,
) {
  const childPanels = Children.toArray(children).filter(
    (child): child is ReactElement<SplitterPanelProps> =>
      isValidElement<SplitterPanelProps>(child) && child.type === SplitterPanel,
  );
  const legacyMode = childPanels.length === 0 && (first !== undefined || second !== undefined);
  const panels = legacyMode
    ? [
        <SplitterPanel key="legacy-first" min={min} max={max}>
          {first}
        </SplitterPanel>,
        <SplitterPanel key="legacy-second">{second}</SplitterPanel>,
      ]
    : childPanels;

  const initial = initialPanelSizes(panels, defaultSizes, defaultSize);
  const [internalSizes, setInternalSizes] = useState<number[]>(initial);
  const resolvedSizes = sizes
    ? normalizeSizes(sizes, panels.length)
    : internalSizes.length === panels.length
      ? internalSizes
      : initial;
  const panelConfigs = panels.map(panelConfig);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentSizesRef = useRef<number[]>(resolvedSizes);
  const proposedSizesRef = useRef<number[]>(resolvedSizes);
  const dragRef = useRef<DragState | null>(null);
  currentSizesRef.current = resolvedSizes;
  if (!dragRef.current) proposedSizesRef.current = resolvedSizes;

  const vertical = orientation === "vertical";
  const keyboardStep = Number.isFinite(step) ? Math.max(0.1, step) : 1;

  const pairBounds = (index: number, source = currentSizesRef.current) => {
    const pairTotal = source[index] + source[index + 1];
    const left = panelConfigs[index];
    const right = panelConfigs[index + 1];
    return {
      pairTotal,
      minLeft: Math.max(left.min, pairTotal - right.max),
      maxLeft: Math.min(left.max, pairTotal - right.min),
    };
  };

  const commitResize = (index: number, requestedLeft: number, source: number[]) => {
    const { pairTotal, minLeft, maxLeft } = pairBounds(index, source);
    const nextLeft = clamp(requestedLeft, minLeft, maxLeft);
    const next = [...source];
    next[index] = nextLeft;
    next[index + 1] = pairTotal - nextLeft;
    proposedSizesRef.current = next;
    if (!sizes) {
      currentSizesRef.current = next;
      setInternalSizes(next);
    }
    onSizesChange?.(next);
    if (legacyMode) onResize?.(next[0] ?? 0);
    return next;
  };

  const canResize = (index: number) =>
    panelConfigs[index]?.resizable !== false &&
    panelConfigs[index + 1]?.resizable !== false;

  const handlePointerDown = (index: number, event: PointerEvent<HTMLDivElement>) => {
    if (!canResize(index) || !rootRef.current) return;
    const startSizes = [...currentSizesRef.current];
    dragRef.current = {
      index,
      startCoordinate: vertical ? event.clientY : event.clientX,
      startSizes,
    };
    proposedSizesRef.current = startSizes;
    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    onResizeStart?.(startSizes);
  };

  const handlePointerMove = (index: number, event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const root = rootRef.current;
    if (!drag || drag.index !== index || !root) return;
    const rect = root.getBoundingClientRect();
    const axisLength = vertical ? rect.height : rect.width;
    if (axisLength <= 0) return;
    const coordinate = vertical ? event.clientY : event.clientX;
    const delta = ((coordinate - drag.startCoordinate) / axisLength) * 100;
    commitResize(index, drag.startSizes[index] + delta, drag.startSizes);
  };

  const finishPointerResize = (index: number, event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.index !== index) return;
    if (
      typeof event.currentTarget.hasPointerCapture === "function" &&
      event.currentTarget.hasPointerCapture(event.pointerId) &&
      typeof event.currentTarget.releasePointerCapture === "function"
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    onResizeEnd?.([...proposedSizesRef.current]);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLDivElement>) => {
    if (!canResize(index)) return;
    const direction = vertical
      ? event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowUp"
          ? -1
          : 0
      : event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowLeft"
          ? -1
          : 0;
    const isBoundaryKey = event.key === "Home" || event.key === "End";
    if (direction === 0 && !isBoundaryKey) return;

    event.preventDefault();
    const startSizes = [...currentSizesRef.current];
    const { minLeft, maxLeft } = pairBounds(index, startSizes);
    const requested =
      event.key === "Home"
        ? minLeft
        : event.key === "End"
          ? maxLeft
          : startSizes[index] +
            direction * keyboardStep * (event.shiftKey ? 5 : 1);
    onResizeStart?.(startSizes);
    const next = commitResize(index, requested, startSizes);
    onResizeEnd?.(next);
  };

  return (
    <div
      {...props}
      ref={(node) => {
        rootRef.current = node;
        assignRef(forwardedRef, node);
      }}
      data-slot="splitter"
      data-orientation={orientation}
      className={cn(
        "flex min-h-32 min-w-0 overflow-hidden rounded-md border",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {panels.map((panel, index) => {
        const size = resolvedSizes[index] ?? 0;
        const nextPanel = panels[index + 1];
        const disabled = nextPanel ? !canResize(index) : false;
        const bounds = nextPanel ? pairBounds(index) : null;
        const panelStyle: CSSProperties = {
          ...panel.props.style,
          flexBasis: 0,
          flexGrow: size,
          flexShrink: 1,
        };

        return (
          <Fragment key={panel.key ?? `splitter-panel-${index}`}>
            {cloneElement(panel, { style: panelStyle })}
            {nextPanel ? (
              <div
                role="separator"
                aria-orientation={vertical ? "horizontal" : "vertical"}
                aria-disabled={disabled || undefined}
                aria-valuemin={bounds?.minLeft}
                aria-valuemax={bounds?.maxLeft}
                aria-valuenow={size}
                aria-valuetext={`${Math.round(size * 10) / 10}%`}
                tabIndex={disabled ? -1 : 0}
                data-slot="splitter-handle"
                data-disabled={disabled || undefined}
                onPointerDown={(event) => handlePointerDown(index, event)}
                onPointerMove={(event) => handlePointerMove(index, event)}
                onPointerUp={(event) => finishPointerResize(index, event)}
                onPointerCancel={(event) => finishPointerResize(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className={cn(
                  "relative shrink-0 bg-border outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-primary/60",
                  vertical
                    ? "h-1 w-full cursor-row-resize"
                    : "h-full w-1 cursor-col-resize",
                )}
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
});

export const Splitter = Object.assign(SplitterRoot, {
  Panel: SplitterPanel,
});
