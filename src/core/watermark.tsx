import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../lib/utils";

export interface WatermarkProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  content: string;
  children: ReactNode;
  rotate?: number;
  gap?: number;
  opacity?: number;
  ref?: Ref<HTMLDivElement>;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function escapeXmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function Watermark({
  content,
  children,
  rotate = -22,
  gap = 120,
  opacity = 0.12,
  ref,
  className,
  style,
  ...props
}: WatermarkProps) {
  const tileSize = Math.max(32, Math.round(finiteOr(gap, 120)));
  const center = tileSize / 2;
  const safeRotate = finiteOr(rotate, -22);
  const safeOpacity = Math.min(1, Math.max(0, finiteOr(opacity, 0.12)));
  const escapedContent = escapeXmlText(content);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}" viewBox="0 0 ${tileSize} ${tileSize}"><text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${safeRotate} ${center} ${center})" fill="rgba(0,0,0,${safeOpacity})" font-size="16">${escapedContent}</text></svg>`;
  const backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      {...props}
      ref={ref}
      data-slot="watermark"
      className={cn("relative", className)}
      style={{ backgroundImage, ...style }}
    >
      {children}
    </div>
  );
}
