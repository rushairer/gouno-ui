import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Splitter } from "../src/core";
import { layoutDocuments } from "../showcase/demos/core/layout";

afterEach(cleanup);

describe("Core Splitter 6B2", () => {
  it("renders canonical multi-panel anatomy with accessible separators", () => {
    const { container } = render(
      <Splitter defaultSizes={[20, 50, 30]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
        <Splitter.Panel>C</Splitter.Panel>
      </Splitter>,
    );

    expect(container.querySelectorAll('[data-slot="splitter-panel"]')).toHaveLength(3);
    const handles = screen.getAllByRole("separator");
    expect(handles).toHaveLength(2);
    expect(handles[0].getAttribute("aria-orientation")).toBe("vertical");
    expect(handles[0].getAttribute("aria-valuenow")).toBe("20");
  });

  it("supports keyboard resizing, constraints and lifecycle callbacks", () => {
    const onSizesChange = vi.fn();
    const onResizeStart = vi.fn();
    const onResizeEnd = vi.fn();
    render(
      <Splitter
        defaultSizes={[40, 60]}
        step={2}
        onSizesChange={onSizesChange}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
      >
        <Splitter.Panel min={35} max={45}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );

    const handle = screen.getByRole("separator");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onSizesChange).toHaveBeenLastCalledWith([42, 58]);
    expect(onResizeStart).toHaveBeenCalledWith([40, 60]);
    expect(onResizeEnd).toHaveBeenLastCalledWith([42, 58]);

    fireEvent.keyDown(handle, { key: "End" });
    expect(onSizesChange).toHaveBeenLastCalledWith([45, 55]);
  });

  it("keeps controlled sizes caller-owned while reporting proposed vectors", () => {
    const onSizesChange = vi.fn();
    const { container } = render(
      <Splitter sizes={[30, 70]} onSizesChange={onSizesChange}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );

    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    expect(onSizesChange).toHaveBeenLastCalledWith([31, 69]);
    const panels = container.querySelectorAll<HTMLElement>('[data-slot="splitter-panel"]');
    expect(panels[0].style.flexGrow).toBe("30");
    expect(panels[1].style.flexGrow).toBe("70");
  });

  it("disables a handle when either adjacent panel is non-resizable", () => {
    const onSizesChange = vi.fn();
    render(
      <Splitter onSizesChange={onSizesChange}>
        <Splitter.Panel resizable={false}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );

    const handle = screen.getByRole("separator");
    expect(handle.getAttribute("aria-disabled")).toBe("true");
    expect(handle.tabIndex).toBe(-1);
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onSizesChange).not.toHaveBeenCalled();
  });

  it("retains the legacy two-panel callback contract", () => {
    const onResize = vi.fn();
    render(<Splitter first={<div>A</div>} second={<div>B</div>} defaultSize={25} onResize={onResize} />);

    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    expect(onResize).toHaveBeenLastCalledWith(26);
  });

  it("forwards the root ref and documents source-trusted compound demos", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Splitter ref={ref} data-testid="splitter-ref">
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(ref.current).toBe(screen.getByTestId("splitter-ref"));

    const document = layoutDocuments.splitter;
    expect(document.code).toContain('from "@gouno/ui/core"');
    expect(document.code).toContain("<Splitter.Panel");
    expect(document.demos?.[0]?.code).toContain('orientation="vertical"');
    expect(document.apiSections?.map((section) => section.title)).toContain("Splitter.Panel API");
  });
});
