import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AutomationManagement } from "../showcase/demos/products/blog-admin/ai/operations/automation-management";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin/ai/operations/automation-records-fixtures";

afterEach(cleanup);

  it("keeps Workflow navigation height content-driven instead of capped by a magic max-height", () => {
    render(
      <AutomationManagement
        workflows={aiOpsAutomationRecordsFixture.workflows}
        onSave={() => {}}
        onDelete={() => {}}
        onToggle={() => {}}
      />,
    );

    const list = screen.getByRole("list", { name: "Workflow 列表" });
    const rail = list.closest('[data-slot="ops-rail"]');
    expect(rail).toBeTruthy();
    expect(rail?.className).toContain("flex");
    expect(rail?.className).toContain("min-h-0");
    expect(list.className).toContain("flex-1");
    expect(list.className).toContain("overflow-y-auto");
    expect(list.className).not.toContain("max-h-[");
  });

describe("Blog Admin responsive product structure", () => {
  it("allows Workflow management actions to wrap inside narrow cards", () => {
    const { container } = render(
      <AutomationManagement
        workflows={aiOpsAutomationRecordsFixture.workflows}
        onSave={() => {}}
        onDelete={() => {}}
        onToggle={() => {}}
      />,
    );

    const actions = container.querySelector('[data-slot="workflow-management-actions"]');
    expect(actions).toBeTruthy();
    expect(actions?.className).toContain("flex-wrap");
    expect(actions?.className).not.toContain("min-w-max");
    expect(screen.getByRole("button", { name: "编辑" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "更多 Workflow 操作" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "停用" })).toBeNull();
    expect(screen.queryByRole("button", { name: "删除" })).toBeNull();
  });
});
