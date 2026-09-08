import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../src/core";
import { BulkActionBar } from "../src/patterns";

afterEach(cleanup);

describe("BulkActionBar", () => {
  it("exposes an accessible toolbar with product-owned actions", () => {
    const onArchive = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionBar selectionLabel="已选择 3 项" onCancel={onCancel}>
        <Button size="small" onClick={onArchive}>归档</Button>
      </BulkActionBar>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 3 项")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "归档" }));
    fireEvent.click(screen.getByRole("button", { name: "取消" }));
    expect(onArchive).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("uses standard aria-label and a configurable cancel label", () => {
    const onCancel = vi.fn();
    render(
      <BulkActionBar
        aria-label="文章批量操作"
        selectionLabel="2 篇文章"
        cancelLabel="清除选择"
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole("toolbar", { name: "文章批量操作" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "清除选择" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("keeps sticky context without manufacturing overlay elevation", () => {
    render(
      <BulkActionBar selectionLabel="已选择 1 项" onCancel={() => undefined}>
        <Button size="small" color="error">删除</Button>
      </BulkActionBar>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.className).toContain("sticky");
    expect(toolbar.className).toContain("bottom-4");
    expect(toolbar.className).toContain("bg-card");
    expect(toolbar.className).not.toContain("shadow-");
    expect(toolbar.className).not.toContain("backdrop-blur");
    expect(screen.getByRole("button", { name: "删除" })).toBeTruthy();
  });
});
