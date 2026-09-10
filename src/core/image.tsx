import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type WheelEvent,
} from "react";
import {
  Eye,
  FlipHorizontal,
  FlipVertical,
  ImageOff,
  RefreshCcw,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../components/primitives/dialog";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";

export type ImageSemantic =
  | "root"
  | "image"
  | "placeholder"
  | "cover"
  | "preview"
  | "previewImage"
  | "toolbar";

export type ImageTransformAction =
  | "flipX"
  | "flipY"
  | "rotateLeft"
  | "rotateRight"
  | "zoomIn"
  | "zoomOut"
  | "wheel"
  | "doubleClick"
  | "move"
  | "reset"
  | "close";

export interface ImageTransform {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}

export interface ImageCoverConfig {
  coverNode?: ReactNode;
  placement?: "top" | "bottom" | "center";
}

export interface ImagePreviewMaskConfig {
  enabled?: boolean;
  blur?: boolean;
  closable?: boolean;
}

export interface ImageToolbarInfo {
  transform: ImageTransform;
  actions: {
    onFlipX: () => void;
    onFlipY: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void;
    onClose: () => void;
  };
}

export interface ImagePreviewConfig {
  open?: boolean;
  defaultOpen?: boolean;
  src?: string;
  cover?: ReactNode | ImageCoverConfig;
  mask?: boolean | ImagePreviewMaskConfig;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  movable?: boolean;
  wheel?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTransform?: (info: {
    transform: ImageTransform;
    action: ImageTransformAction;
  }) => void;
  actionsRender?: (originalNode: ReactElement, info: ImageToolbarInfo) => ReactNode;
  imageRender?: (
    originalNode: ReactElement,
    info: { transform: ImageTransform; src: string; alt: string },
  ) => ReactNode;
  classNames?: Partial<Record<"root" | "image" | "toolbar", string>>;
  styles?: Partial<Record<"root" | "image" | "toolbar" | "mask", CSSProperties>>;
}

export interface ImageSemanticInfo {
  props: Readonly<{
    preview: boolean;
    loading: boolean;
    failed: boolean;
  }>;
}

export type ImageClassNames =
  | Partial<Record<ImageSemantic, string>>
  | ((info: ImageSemanticInfo) => Partial<Record<ImageSemantic, string>>);
export type ImageStyles =
  | Partial<Record<ImageSemantic, CSSProperties>>
  | ((info: ImageSemanticInfo) => Partial<Record<ImageSemantic, CSSProperties>>);

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  fallback?: string;
  placeholder?: ReactNode;
  preview?: boolean | ImagePreviewConfig;
  classNames?: ImageClassNames;
  styles?: ImageStyles;
  ref?: Ref<HTMLImageElement>;
}

const initialTransform: ImageTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  flipX: false,
  flipY: false,
};

function localizedLabel(en: string, zh: string) {
  return typeof document !== "undefined" &&
    document.documentElement.lang.startsWith("en")
    ? en
    : zh;
}

function clampScale(value: number, minScale: number, maxScale: number) {
  return Math.min(maxScale, Math.max(minScale, value));
}

function isImageCoverConfig(
  value: ReactNode | ImageCoverConfig,
): value is ImageCoverConfig {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  return "coverNode" in value || "placement" in value;
}

export function Image({
  src,
  alt = "",
  fallback,
  placeholder,
  preview = true,
  classNames,
  styles,
  className,
  style,
  onLoad,
  onError,
  onClick,
  ref,
  ...props
}: ImageProps) {
  const previewEnabled = preview !== false;
  const previewConfig: ImagePreviewConfig =
    typeof preview === "object" ? preview : {};
  const controlledOpen = previewConfig.open !== undefined;
  const [internalOpen, setInternalOpen] = useState(previewConfig.defaultOpen ?? false);
  const open = controlledOpen ? Boolean(previewConfig.open) : internalOpen;
  const [activeSrc, setActiveSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [transform, setTransform] = useState<ImageTransform>(initialTransform);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    originX: number;
    originY: number;
  } | null>(null);

  const minScale = Math.max(0.1, previewConfig.minScale ?? 1);
  const maxScale = Math.max(minScale, previewConfig.maxScale ?? 50);
  const scaleStep = Math.max(0.05, previewConfig.scaleStep ?? 0.5);
  const movable = previewConfig.movable ?? true;
  const wheel = previewConfig.wheel ?? true;

  useEffect(() => {
    setActiveSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (!open) {
      setTransform(initialTransform);
      dragRef.current = null;
    }
  }, [open]);

  const semanticInfo: ImageSemanticInfo = {
    props: { preview: previewEnabled, loading: !loaded && !failed, failed },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  const setPreviewOpen = (next: boolean) => {
    if (!controlledOpen) setInternalOpen(next);
    previewConfig.onOpenChange?.(next);
    if (!next) previewConfig.onTransform?.({ transform, action: "close" });
  };

  const applyTransform = (
    action: ImageTransformAction,
    next: ImageTransform,
  ) => {
    setTransform(next);
    previewConfig.onTransform?.({ transform: next, action });
  };

  const zoomBy = (
    direction: 1 | -1,
    action: "zoomIn" | "zoomOut" | "wheel",
  ) => {
    const factor = 1 + scaleStep;
    const scale = clampScale(
      direction > 0 ? transform.scale * factor : transform.scale / factor,
      minScale,
      maxScale,
    );
    applyTransform(action, { ...transform, scale });
  };

  const actions: ImageToolbarInfo["actions"] = {
    onFlipX: () =>
      applyTransform("flipX", { ...transform, flipX: !transform.flipX }),
    onFlipY: () =>
      applyTransform("flipY", { ...transform, flipY: !transform.flipY }),
    onRotateLeft: () =>
      applyTransform("rotateLeft", {
        ...transform,
        rotate: transform.rotate - 90,
      }),
    onRotateRight: () =>
      applyTransform("rotateRight", {
        ...transform,
        rotate: transform.rotate + 90,
      }),
    onZoomOut: () => zoomBy(-1, "zoomOut"),
    onZoomIn: () => zoomBy(1, "zoomIn"),
    onReset: () => applyTransform("reset", initialTransform),
    onClose: () => setPreviewOpen(false),
  };

  const toolbar = (
    <div
      data-slot="image-toolbar"
      className={cn(
        "flex items-center gap-1 rounded-full border bg-popover/95 p-1 shadow-overlay backdrop-blur",
        semanticClassNames.toolbar,
        previewConfig.classNames?.toolbar,
      )}
      style={{ ...semanticStyles.toolbar, ...previewConfig.styles?.toolbar }}
    >
      <IconButton
        variant="text"
        label={localizedLabel("Flip horizontal", "水平翻转")}
        icon={<FlipHorizontal aria-hidden="true" />}
        onClick={actions.onFlipX}
      />
      <IconButton
        variant="text"
        label={localizedLabel("Flip vertical", "垂直翻转")}
        icon={<FlipVertical aria-hidden="true" />}
        onClick={actions.onFlipY}
      />
      <IconButton
        variant="text"
        label={localizedLabel("Rotate left", "向左旋转")}
        icon={<RotateCcw aria-hidden="true" />}
        onClick={actions.onRotateLeft}
      />
      <IconButton
        variant="text"
        label={localizedLabel("Rotate right", "向右旋转")}
        icon={<RotateCw aria-hidden="true" />}
        onClick={actions.onRotateRight}
      />
      <IconButton
        variant="text"
        label={localizedLabel("Zoom out", "缩小")}
        icon={<ZoomOut aria-hidden="true" />}
        onClick={actions.onZoomOut}
        disabled={transform.scale <= minScale}
      />
      <IconButton
        variant="text"
        label={localizedLabel("Zoom in", "放大")}
        icon={<ZoomIn aria-hidden="true" />}
        onClick={actions.onZoomIn}
        disabled={transform.scale >= maxScale}
      />
      <IconButton
        variant="text"
        label={localizedLabel("Reset", "重置")}
        icon={<RefreshCcw aria-hidden="true" />}
        onClick={actions.onReset}
      />
    </div>
  );

  const previewSource = previewConfig.src ?? activeSrc ?? src ?? "";
  const previewImage = (
    <img
      data-slot="image-preview-image"
      src={previewSource}
      alt={alt}
      draggable={false}
      className={cn(
        "max-h-[calc(100dvh-9rem)] max-w-[calc(100vw-4rem)] select-none object-contain transition-transform duration-150",
        movable && transform.scale > 1 && "cursor-grab active:cursor-grabbing",
        semanticClassNames.previewImage,
        previewConfig.classNames?.image,
      )}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${transform.rotate}deg) scale(${transform.scale * (transform.flipX ? -1 : 1)}, ${transform.scale * (transform.flipY ? -1 : 1)})`,
        ...semanticStyles.previewImage,
        ...previewConfig.styles?.image,
      }}
      onDoubleClick={() => {
        const nextScale =
          transform.scale === minScale
            ? clampScale(minScale * (1 + scaleStep), minScale, maxScale)
            : minScale;
        applyTransform("doubleClick", {
          ...transform,
          x: nextScale === minScale ? 0 : transform.x,
          y: nextScale === minScale ? 0 : transform.y,
          scale: nextScale,
        });
      }}
      onPointerDown={(event: ReactPointerEvent<HTMLImageElement>) => {
        if (!movable || transform.scale <= 1) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          originX: transform.x,
          originY: transform.y,
        };
      }}
      onPointerMove={(event: ReactPointerEvent<HTMLImageElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        applyTransform("move", {
          ...transform,
          x: drag.originX + event.clientX - drag.x,
          y: drag.originY + event.clientY - drag.y,
        });
      }}
      onPointerUp={(event: ReactPointerEvent<HTMLImageElement>) => {
        if (dragRef.current?.pointerId === event.pointerId) {
          dragRef.current = null;
        }
      }}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
    />
  );

  const renderedPreviewImage = previewConfig.imageRender
    ? previewConfig.imageRender(previewImage, {
        transform,
        src: previewSource,
        alt,
      })
    : previewImage;
  const renderedToolbar = previewConfig.actionsRender
    ? previewConfig.actionsRender(toolbar, { transform, actions })
    : toolbar;

  const maskConfig =
    typeof previewConfig.mask === "object" ? previewConfig.mask : undefined;
  const maskEnabled = previewConfig.mask !== false && maskConfig?.enabled !== false;
  const maskClosable = maskConfig?.closable ?? true;

  const rawCover = previewConfig.cover;
  let coverNode: ReactNode = <Eye aria-hidden="true" />;
  let coverPlacement: ImageCoverConfig["placement"] = "center";
  if (isImageCoverConfig(rawCover)) {
    coverNode = rawCover.coverNode ?? coverNode;
    coverPlacement = rawCover.placement ?? coverPlacement;
  } else if (rawCover !== undefined) {
    coverNode = rawCover;
  }

  const imageNode = failed ? (
    <span
      data-slot="image-fallback"
      role="img"
      aria-label={alt || localizedLabel("Image unavailable", "图片不可用")}
      className={cn(
        "flex min-h-24 min-w-24 items-center justify-center rounded-md bg-muted text-muted-foreground",
        semanticClassNames.image,
        className,
      )}
      style={{ ...semanticStyles.image, ...style }}
    >
      <ImageOff aria-hidden="true" />
    </span>
  ) : (
    <img
      {...props}
      ref={ref}
      src={activeSrc}
      alt={alt}
      data-slot="image-element"
      className={cn("block max-w-full", semanticClassNames.image, className)}
      style={{ ...semanticStyles.image, ...style }}
      onClick={onClick}
      onLoad={(event) => {
        setLoaded(true);
        setFailed(false);
        onLoad?.(event);
      }}
      onError={(event) => {
        onError?.(event);
        if (fallback && activeSrc !== fallback) {
          setLoaded(false);
          setActiveSrc(fallback);
          return;
        }
        setFailed(true);
        setLoaded(false);
      }}
    />
  );

  const thumbnail = (
    <span
      data-slot="image-root"
      className={cn(
        "group relative inline-flex max-w-full overflow-hidden align-middle",
        semanticClassNames.root,
      )}
      style={semanticStyles.root}
    >
      {imageNode}
      {!loaded && !failed && placeholder !== undefined && placeholder !== null ? (
        <span
          data-slot="image-placeholder"
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted/70",
            semanticClassNames.placeholder,
          )}
          style={semanticStyles.placeholder}
        >
          {placeholder}
        </span>
      ) : null}
      {previewEnabled && !failed ? (
        <span
          data-slot="image-cover"
          className={cn(
            "pointer-events-none absolute inset-x-0 flex justify-center bg-overlay/55 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
            coverPlacement === "top" && "top-0",
            coverPlacement === "bottom" && "bottom-0",
            coverPlacement === "center" && "inset-y-0 items-center",
            semanticClassNames.cover,
          )}
          style={semanticStyles.cover}
        >
          {coverNode}
        </span>
      ) : null}
    </span>
  );

  return (
    <>
      {previewEnabled && !failed ? (
        <button
          type="button"
          className="inline-flex max-w-full cursor-zoom-in rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={
            alt
              ? `${localizedLabel("Preview", "预览")} ${alt}`
              : localizedLabel("Preview image", "预览图片")
          }
          onClick={() => setPreviewOpen(true)}
        >
          {thumbnail}
        </button>
      ) : (
        thumbnail
      )}

      {previewEnabled ? (
        <Dialog open={open} onOpenChange={setPreviewOpen}>
          <DialogContent
            showCloseButton={false}
            mask={maskEnabled}
            maskStyle={{
              backdropFilter: maskConfig?.blur ? "blur(4px)" : undefined,
              ...previewConfig.styles?.mask,
            }}
            className={cn(
              "flex max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] flex-col items-center justify-center gap-4 overflow-hidden border-0 bg-transparent p-4 shadow-none sm:max-w-[calc(100vw-2rem)]",
              semanticClassNames.preview,
              previewConfig.classNames?.root,
            )}
            style={{ ...semanticStyles.preview, ...previewConfig.styles?.root }}
            onPointerDownOutside={(event) => {
              if (!maskClosable) event.preventDefault();
            }}
          >
            <DialogTitle className="sr-only">
              {alt || localizedLabel("Image preview", "图片预览")}
            </DialogTitle>
            <div
              className="flex min-h-0 flex-1 items-center justify-center"
              onWheel={(event: WheelEvent<HTMLDivElement>) => {
                if (!wheel) return;
                event.preventDefault();
                zoomBy(event.deltaY < 0 ? 1 : -1, "wheel");
              }}
            >
              {renderedPreviewImage}
            </div>
            <div className="flex items-center gap-2">
              {renderedToolbar}
              <IconButton
                variant="text"
                label={localizedLabel("Close", "关闭")}
                icon={<X aria-hidden="true" />}
                onClick={actions.onClose}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
