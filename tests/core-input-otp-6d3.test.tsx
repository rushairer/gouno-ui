import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { InputOTP } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { inputOtpReviewDocuments } from "../showcase/demos/core/data-entry-review-6d3";

afterEach(cleanup);

describe("Core InputOTP 6D3", () => {
  it("keeps the group name caller-owned and forwards the real root ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <InputOTP
        ref={ref}
        aria-label="验证码"
        length={4}
        data-testid="otp"
      />,
    );

    const group = screen.getByRole("group", { name: "验证码" });
    expect(ref.current).toBe(group);
    expect(group.getAttribute("data-slot")).toBe("input-otp");
    expect(group.getAttribute("data-testid")).toBe("otp");
    expect(screen.getByLabelText("1").getAttribute("data-slot")).toBe(
      "input-otp-input",
    );
    expect(screen.getByLabelText("4")).toBeTruthy();
    expect(screen.queryByLabelText("One-time password")).toBeNull();
    expect(screen.queryByLabelText("Digit 1")).toBeNull();
  });

  it("accepts digits only and advances focus after entry", () => {
    const onChange = vi.fn();
    render(<InputOTP aria-label="验证码" length={4} onChange={onChange} />);

    const first = screen.getByLabelText("1") as HTMLInputElement;
    fireEvent.change(first, { target: { value: "a7" } });

    expect(first.value).toBe("7");
    expect(onChange).toHaveBeenLastCalledWith("7");
    expect(document.activeElement).toBe(screen.getByLabelText("2"));
  });

  it("distributes pasted digits and focuses the final written slot", () => {
    const onChange = vi.fn();
    render(<InputOTP aria-label="验证码" length={4} onChange={onChange} />);

    const first = screen.getByLabelText("1");
    fireEvent.paste(first, {
      clipboardData: { getData: () => "12a34" },
    });

    expect(onChange).toHaveBeenLastCalledWith("1234");
    expect((screen.getByLabelText("1") as HTMLInputElement).value).toBe("1");
    expect((screen.getByLabelText("2") as HTMLInputElement).value).toBe("2");
    expect((screen.getByLabelText("3") as HTMLInputElement).value).toBe("3");
    expect((screen.getByLabelText("4") as HTMLInputElement).value).toBe("4");
    expect(document.activeElement).toBe(screen.getByLabelText("4"));
  });

  it("supports empty-slot backspace and positional keyboard navigation", () => {
    render(<InputOTP aria-label="验证码" length={4} defaultValue="8" />);

    const second = screen.getByLabelText("2") as HTMLInputElement;
    second.focus();
    fireEvent.keyDown(second, { key: "Backspace" });
    const first = screen.getByLabelText("1") as HTMLInputElement;
    expect(first.value).toBe("");
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: "End" });
    expect(document.activeElement).toBe(screen.getByLabelText("4"));
    fireEvent.keyDown(screen.getByLabelText("4"), { key: "Home" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(first);
  });

  it("applies mask, disabled, size and error semantics coherently", () => {
    render(
      <InputOTP
        aria-label="锁定验证码"
        length={4}
        defaultValue="2841"
        mask
        disabled
        size="large"
        status="error"
      />,
    );

    const group = screen.getByRole("group", { name: "锁定验证码" });
    expect(group.getAttribute("aria-disabled")).toBe("true");
    expect(group.getAttribute("aria-invalid")).toBe("true");

    for (const input of Array.from(group.querySelectorAll("input"))) {
      expect(input.type).toBe("password");
      expect(input.disabled).toBe(true);
      expect(input.getAttribute("aria-invalid")).toBe("true");
      expect(input.className).toContain("size-11");
    }
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = inputOtpReviewDocuments["input-otp"];
    expect(document.code).toContain("<InputOTP");
    expect(document.code).toContain('aria-label="短信验证码"');
    expect(document.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "length",
        "value",
        "defaultValue",
        "onChange",
        "disabled",
        "mask",
        "size",
        "status",
        "...div props",
        "ref",
      ]),
    );
    expect(componentProgress("core-input-otp", 75)).toBe(100);
  });
});
