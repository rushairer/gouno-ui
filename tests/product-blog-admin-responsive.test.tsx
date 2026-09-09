import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AutomationManagement } from "../showcase/demos/products/blog-admin-ai-operations/automation-management";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin-ai-operations/automation-records-fixtures";

afterEach(cleanup);

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
    expect(actions?.className).toContain("w-full");
    expect(actions?.className).toContain("flex-wrap");
    expect(actions?.className).toContain("lg:w-auto");
    expect(actions?.className).not.toContain("min-w-max");
    expect(screen.getByRole("button", { name: "编辑" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "停用" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "删除" })).toBeTruthy();
  });
});
