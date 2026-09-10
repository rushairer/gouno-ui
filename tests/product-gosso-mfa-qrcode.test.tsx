import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MfaPanel } from "../showcase/demos/products/gosso-account-settings/mfa";

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

describe("Gosso MFA QR code", () => {
  it("uses the canonical QRCode with a localized standard accessible name", async () => {
    render(<MfaPanel />);

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(await screen.findByRole("radio", { name: "配置中" }));

    const qrCode = await screen.findByRole("img", {
      name: "GOSSO MFA 配置二维码",
    });
    expect(qrCode.tagName).toBe("CANVAS");
    expect(qrCode.getAttribute("aria-label")).toBe("GOSSO MFA 配置二维码");

    await waitFor(() => {
      expect(toCanvas).toHaveBeenCalledWith(
        qrCode,
        "gouno-showcase://mfa/demo-user",
        expect.objectContaining({ width: 180, errorCorrectionLevel: "M" }),
      );
    });
  });
});
