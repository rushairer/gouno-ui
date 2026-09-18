import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AutomationManagement } from "../showcase/demos/products/blog-admin/ai/operations/automation-management";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin/ai/operations/automation-records-fixtures";

afterEach(cleanup);

  it("keeps the Workflow list page content-driven without an internal navigation rail", () => {
    const { container } = render(
      <AutomationManagement
        workflows={aiOpsAutomationRecordsFixture.workflows}
        onSave={() => {}}
        onDelete={() => {}}
        onToggle={() => {}}
      />,
    );

    const list = screen.getByRole("list", { name: "Workflow 列表" });
    const firstRow = screen.getByRole("button", { name: "打开 Workflow：旧文维护" });
    expect(container.querySelector('[data-slot="ops-rail"]')).toBeNull();
    expect(container.querySelector('[data-slot="ops-rail-body"]')).toBeNull();
    expect(container.querySelector('[data-slot="workflow-list-toolbar"]')).toBeTruthy();
    expect(list.className).toContain("overflow-hidden");
    expect(list.className).not.toContain("overflow-y-auto");
    expect(list.className).not.toContain("max-h-[");
    expect(firstRow.className).toContain("grid-cols-1");
    expect(firstRow.className).toContain("xl:grid-cols-[");
  });

describe("Blog Admin responsive product structure", () => {
  it("allows Workflow management actions to wrap inside narrow cards", () => {
    const { container } = render(
      <AutomationManagement
        workflows={aiOpsAutomationRecordsFixture.workflows}
        selectedWorkflowId={aiOpsAutomationRecordsFixture.workflows[0].id}
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
