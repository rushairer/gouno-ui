import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Button,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FormActions,
  FormField,
  FormGrid,
  Input,
  OverlayForm,
} from "../src/core";

afterEach(cleanup);

describe("Core Form family", () => {
  it("binds FormField label, required, hint and error semantics to the child control", () => {
    render(
      <FormField
        label="联系邮箱"
        hint="用于接收系统通知。"
        error="邮箱格式无效"
        required
      >
        <Input name="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "联系邮箱" });
    expect(input.hasAttribute("required")).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");

    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const hint = screen.getByText("用于接收系统通知。");
    const error = screen.getByRole("alert");
    expect(describedBy).toContain(hint.id);
    expect(describedBy).toContain(error.id);
    expect(error.textContent).toBe("邮箱格式无效");
  });

  it("keeps a visually hidden FormField label as the accessible control name", () => {
    render(
      <FormField label="内部备注" hideLabel>
        <Input />
      </FormField>,
    );

    expect(screen.getByRole("textbox", { name: "内部备注" })).toBeTruthy();
    expect(screen.getByText("内部备注").className).toContain("sr-only");
  });

  it("preserves native fieldset, legend, group and label semantics for low-level anatomy", () => {
    render(
      <FieldSet>
        <FieldLegend>通知偏好</FieldLegend>
        <FieldGroup data-testid="field-group">
          <div>
            <FieldLabel htmlFor="digest-email">摘要邮箱</FieldLabel>
            <Input id="digest-email" />
          </div>
        </FieldGroup>
      </FieldSet>,
    );

    const group = screen.getByRole("group", { name: "通知偏好" });
    expect(group.tagName).toBe("FIELDSET");
    expect(within(group).getByRole("textbox", { name: "摘要邮箱" })).toBeTruthy();
    expect(screen.getByTestId("field-group").getAttribute("data-slot")).toBe(
      "field-group",
    );
  });

  it("forwards layout helper props while keeping canonical responsive structure", () => {
    render(
      <>
        <FormGrid columns={3} data-testid="grid" data-scope="profile">
          <div>One</div>
          <div>Two</div>
          <div>Three</div>
        </FormGrid>
        <FormActions data-testid="actions" data-placement="footer">
          <Button>Cancel</Button>
          <Button>Save</Button>
        </FormActions>
      </>,
    );

    const grid = screen.getByTestId("grid");
    expect(grid.className).toContain("md:grid-cols-3");
    expect(grid.getAttribute("data-scope")).toBe("profile");

    const actions = screen.getByTestId("actions");
    expect(actions.className).toContain("justify-end");
    expect(actions.className).toContain("border-t");
    expect(actions.getAttribute("data-placement")).toBe("footer");
  });

  it("composes OverlayForm from one native form plus a dedicated action region", () => {
    render(
      <OverlayForm
        aria-label="编辑文章"
        data-testid="overlay-form"
        actions={<Button type="submit">保存</Button>}
        actionClassName="sticky-actions"
      >
        <FormField label="标题">
          <Input name="title" />
        </FormField>
      </OverlayForm>,
    );

    const form = screen.getByRole("form", { name: "编辑文章" });
    expect(form).toBe(screen.getByTestId("overlay-form"));
    expect(form.querySelectorAll("form")).toHaveLength(0);
    expect(screen.getByRole("textbox", { name: "标题" })).toBeTruthy();

    const save = screen.getByRole("button", { name: "保存" });
    const actionRegion = save.parentElement;
    expect(actionRegion?.className).toContain("sticky-actions");
    expect(actionRegion?.className).toContain("justify-end");
  });
});
