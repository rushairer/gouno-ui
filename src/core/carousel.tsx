import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";

export type CarouselEffect = "scrollx" | "fade";
export type CarouselDotPlacement = "top" | "bottom" | "start" | "end";
export type CarouselSemantic =
  | "root"
  | "viewport"
  | "track"
  | "slide"
  | "arrows"
  | "prevArrow"
  | "nextArrow"
  | "dots"
  | "dot";

export interface CarouselAutoplayConfig {
  dotDuration?: boolean;
}

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  next: () => void;
  prev: () => void;
}

export interface CarouselSemanticInfo {
  props: Readonly<{
    activeIndex: number;
    arrows: boolean;
    dots: boolean;
    effect: CarouselEffect;
    dotPlacement: CarouselDotPlacement;
  }>;
}

export type CarouselClassNames =
  | Partial<Record<CarouselSemantic, string>>
  | ((info: CarouselSemanticInfo) => Partial<Record<CarouselSemantic, string>>);
export type CarouselStyles =
  | Partial<Record<CarouselSemantic, CSSProperties>>
  | ((info: CarouselSemanticInfo) => Partial<Record<CarouselSemantic, CSSProperties>>);

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  items: readonly ReactNode[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  arrows?: boolean;
  dots?: boolean;
  dotPlacement?: CarouselDotPlacement;
  autoplay?: boolean | CarouselAutoplayConfig;
  autoplaySpeed?: number;
  adaptiveHeight?: boolean;
  draggable?: boolean;
  effect?: CarouselEffect;
  infinite?: boolean;
  speed?: number;
  easing?: string;
  waitForAnimate?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  beforeChange?: (current: number, next: number) => void;
  afterChange?: (current: number) => void;
  onChange?: (current: number) => void;
  classNames?: CarouselClassNames;
  styles?: CarouselStyles;
  ref?: Ref<CarouselRef>;
}

function localizedLabel(en: string, zh: string) {
  return typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
    ? en
    : zh;
}

function normalizeIndex(index: number, count: number, infinite: boolean) {
  if (!count) return 0;
  if (infinite) return ((index % count) + count) % count;
  return Math.min(count - 1, Math.max(0, index));
}

export function Carousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  arrows = false,
  dots = true,
  dotPlacement = "bottom",
  autoplay = false,
  autoplaySpeed = 3000,
  adaptiveHeight = false,
  draggable = false,
  effect = "scrollx",
  infinite = true,
  speed = 500,
  easing = "ease",
  waitForAnimate = false,
  pauseOnHover = true,
  pauseOnFocus = true,
  beforeChange,
  afterChange,
  onChange,
  classNames,
  styles,
  className,
  style,
  ref,
  "aria-label": ariaLabel,
  ...props
}: CarouselProps) {
  const count = items.length;
  const controlled = activeIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(() =>
    normalizeIndex(defaultActiveIndex, count, infinite),
  );
  const current = normalizeIndex(
    controlled ? activeIndex : internalIndex,
    count,
    infinite,
  );
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, []);

  const goTo = (target: number, dontAnimate = false) => {
    if (!count || (waitForAnimate && animating)) return;
    const next = normalizeIndex(target, count, infinite);
    if (next === current) return;
    beforeChange?.(current, next);
    if (!controlled) setInternalIndex(next);
    onChange?.(next);

    if (dontAnimate || speed <= 0) {
      setAnimating(false);
      afterChange?.(next);
      return;
    }

    setAnimating(true);
    if (animationTimer.current) clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => {
      setAnimating(false);
      afterChange?.(next);
    }, speed);
  };

  const next = () => {
    if (!infinite && current >= count - 1) return;
    goTo(current + 1);
  };
  const prev = () => {
    if (!infinite && current <= 0) return;
    goTo(current - 1);
  };

  useImperativeHandle(ref, () => ({ goTo, next, prev }), [current, count, infinite, animating]);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(next, Math.max(250, autoplaySpeed));
    return () => window.clearInterval(timer);
  }, [autoplay, autoplaySpeed, paused, current, count, infinite, animating]);

  if (!count) return null;

  const semanticInfo: CarouselSemanticInfo = {
    props: { activeIndex: current, arrows, dots, effect, dotPlacement },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});
  const autoplayConfig = typeof autoplay === "object" ? autoplay : undefined;

  const arrowNodes = arrows ? (
    <div
      data-slot="carousel-arrows"
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-2",
        semanticClassNames.arrows,
      )}
      style={semanticStyles.arrows}
    >
      <IconButton
        variant="secondary"
        size="small"
        label={localizedLabel("Previous slide", "上一张")}
        icon={<ChevronLeft aria-hidden="true" />}
        onClick={prev}
        disabled={!infinite && current === 0}
        className={cn("pointer-events-auto", semanticClassNames.prevArrow)}
        style={semanticStyles.prevArrow}
      />
      <IconButton
        variant="secondary"
        size="small"
        label={localizedLabel("Next slide", "下一张")}
        icon={<ChevronRight aria-hidden="true" />}
        onClick={next}
        disabled={!infinite && current === count - 1}
        className={cn("pointer-events-auto", semanticClassNames.nextArrow)}
        style={semanticStyles.nextArrow}
      />
    </div>
  ) : null;

  const dotNodes = dots ? (
    <div
      data-slot="carousel-dots"
      role="tablist"
      aria-label={localizedLabel("Choose slide", "选择轮播项")}
      className={cn(
        "z-20 flex items-center justify-center gap-2",
        (dotPlacement === "top" || dotPlacement === "bottom") && "px-3 py-2",
        (dotPlacement === "start" || dotPlacement === "end") &&
          "absolute inset-y-0 flex-col px-2",
        dotPlacement === "top" && "order-first",
        dotPlacement === "start" && "left-0",
        dotPlacement === "end" && "right-0",
        semanticClassNames.dots,
      )}
      style={semanticStyles.dots}
    >
      {items.map((_, index) => {
        const selected = index === current;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`${localizedLabel("Slide", "第")} ${index + 1}`}
            onClick={() => goTo(index)}
            data-slot="carousel-dot"
            className={cn(
              "relative h-2 overflow-hidden rounded-full bg-muted-foreground/30 outline-none transition-[width,background-color] focus-visible:ring-2 focus-visible:ring-ring",
              selected ? "w-8 bg-primary" : "w-2 hover:bg-muted-foreground/60",
              semanticClassNames.dot,
            )}
            style={semanticStyles.dot}
          >
            {selected && autoplay && autoplayConfig?.dotDuration ? (
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 bg-primary-foreground/50"
                style={{
                  width: "100%",
                  transformOrigin: "left",
                  animation: `gouno-carousel-dot ${Math.max(250, autoplaySpeed)}ms linear`,
                }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div
      {...props}
      data-slot="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel ?? localizedLabel("Carousel", "轮播")}
      data-effect={effect}
      data-dot-placement={dotPlacement}
      className={cn(
        "relative flex min-w-0 flex-col",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
      onMouseEnter={(event) => {
        if (pauseOnHover) setPaused(true);
        props.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (pauseOnHover) setPaused(false);
        props.onMouseLeave?.(event);
      }}
      onFocusCapture={(event) => {
        if (pauseOnFocus) setPaused(true);
        props.onFocusCapture?.(event);
      }}
      onBlurCapture={(event) => {
        if (
          pauseOnFocus &&
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setPaused(false);
        }
        props.onBlurCapture?.(event);
      }}
    >
      {dotPlacement === "top" ? dotNodes : null}
      <div
        data-slot="carousel-viewport"
        className={cn(
          "relative min-w-0 overflow-hidden rounded-lg",
          adaptiveHeight && "transition-[height]",
          semanticClassNames.viewport,
        )}
        style={semanticStyles.viewport}
        onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
          if (!draggable) return;
          pointerStart.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!draggable || !start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
          if (dx < 0) next();
          else prev();
        }}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        <div
          data-slot="carousel-track"
          className={cn(
            "relative flex min-w-0",
            effect === "fade" && "grid",
            semanticClassNames.track,
          )}
          style={{
            ...(effect === "scrollx"
              ? {
                  width: `${count * 100}%`,
                  transform: `translateX(-${(current * 100) / count}%)`,
                  transitionProperty: "transform",
                  transitionDuration: `${speed}ms`,
                  transitionTimingFunction: easing,
                }
              : undefined),
            ...semanticStyles.track,
          }}
        >
          {items.map((item, index) => {
            const selected = index === current;
            return (
              <div
                key={index}
                data-slot="carousel-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${count}`}
                aria-hidden={!selected}
                className={cn(
                  "min-w-0",
                  effect === "scrollx" && "shrink-0",
                  effect === "fade" &&
                    "col-start-1 row-start-1 transition-opacity",
                  effect === "fade" && (selected ? "z-10 opacity-100" : "pointer-events-none opacity-0"),
                  semanticClassNames.slide,
                )}
                style={{
                  ...(effect === "scrollx" ? { width: `${100 / count}%` } : undefined),
                  ...(effect === "fade"
                    ? {
                        transitionDuration: `${speed}ms`,
                        transitionTimingFunction: easing,
                      }
                    : undefined),
                  ...semanticStyles.slide,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        {arrowNodes}
      </div>
      {dotPlacement === "bottom" ? dotNodes : null}
      {(dotPlacement === "start" || dotPlacement === "end") ? dotNodes : null}
    </div>
  );
}
