import { createRef } from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QRCode } from "../src/core/qrcode";

const { toCanvas } = vi.hoisted(() => ({
  toCanvas: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("qrcode", () => ({
  default: { toCanvas },
}));

beforeEach(() => {
  toCanvas.mockClear();
});

afterEach(() => {
  cleanup();
});

describe("Core QRCode", () => {
  it("forwards standard canvas/ARIA props and the canvas ref", async () => {
    const ref = createRef<HTMLCanvasElement>();
    const view = render(
      <QRCode
        ref={ref}
        value="otpauth://totp/Gouno:demo?secret=SHOWCASEDEMO"
        aria-label="MFA 配置二维码"
        id="mfa-qr"
        data-state="ready"
        className="rounded-sm"
      />,
    );

    const canvas = view.getByRole("img", { name: "MFA 配置二维码" });
    expect(ref.current).toBe(canvas);
    expect(canvas.getAttribute("id")).toBe("mfa-qr");
    expect(canvas.getAttribute("data-state")).toBe("ready");
    expect(canvas.className).toContain("rounded-sm");
    expect(canvas.getAttribute("width")).toBe("160");
    expect(canvas.getAttribute("height")).toBe("160");

    await waitFor(() => {
      expect(toCanvas).toHaveBeenCalledWith(
        canvas,
        "otpauth://totp/Gouno:demo?secret=SHOWCASEDEMO",
        {
          width: 160,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "M",
        },
      );
    });
  });

  it("keeps the accessible name caller-owned and supports aria-labelledby", async () => {
    const view = render(<QRCode value="https://gouno.example/one" />);
    const unnamed = view.getByRole("img");
    expect(unnamed.getAttribute("aria-label")).toBeNull();

    view.rerender(
      <>
        <span id="qr-label">文档二维码</span>
        <QRCode
          value="https://gouno.example/two"
          aria-labelledby="qr-label"
          size={180}
          color="#111111"
          background="#fefefe"
          errorLevel="H"
        />
      </>,
    );

    const canvas = view.getByRole("img", { name: "文档二维码" });
    expect(canvas.getAttribute("width")).toBe("180");
    expect(canvas.getAttribute("height")).toBe("180");

    await waitFor(() => {
      expect(toCanvas).toHaveBeenLastCalledWith(
        canvas,
        "https://gouno.example/two",
        {
          width: 180,
          color: { dark: "#111111", light: "#fefefe" },
          errorCorrectionLevel: "H",
        },
      );
    });
  });

  it("redraws when the encoded value changes", async () => {
    const view = render(
      <QRCode value="https://gouno.example/a" aria-label="链接二维码" />,
    );

    await waitFor(() => expect(toCanvas).toHaveBeenCalledTimes(1));

    view.rerender(
      <QRCode value="https://gouno.example/b" aria-label="链接二维码" />,
    );

    await waitFor(() => expect(toCanvas).toHaveBeenCalledTimes(2));
    expect(toCanvas.mock.calls[1]?.[1]).toBe("https://gouno.example/b");
  });
});
