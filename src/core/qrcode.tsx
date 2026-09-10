import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CanvasHTMLAttributes,
} from "react";
import QRCodeLib from "qrcode";

export type QRCodeErrorLevel = "L" | "M" | "Q" | "H";

export interface QRCodeProps
  extends Omit<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    "children" | "color" | "height" | "width"
  > {
  value: string;
  /** Rendered canvas width and height in CSS pixels. */
  size?: number;
  /** QR foreground color accepted by the renderer. */
  color?: string;
  /** QR background color accepted by the renderer. */
  background?: string;
  /** QR error-correction level. */
  errorLevel?: QRCodeErrorLevel;
}

export const QRCode = forwardRef<HTMLCanvasElement, QRCodeProps>(function QRCode(
  {
    value,
    size = 160,
    color = "#000000",
    background = "#ffffff",
    errorLevel = "M",
    role = "img",
    ...props
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  useEffect(() => {
    if (!canvasRef.current) return;

    void QRCodeLib.toCanvas(canvasRef.current, value, {
      width: size,
      color: { dark: color, light: background },
      errorCorrectionLevel: errorLevel,
    });
  }, [background, color, errorLevel, size, value]);

  return (
    <canvas
      {...props}
      ref={canvasRef}
      data-slot="qrcode"
      width={size}
      height={size}
      role={role}
    />
  );
});
