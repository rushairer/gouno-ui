import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Checkbox, Radio, Switch } from "../src/core";

afterEach(cleanup);

function ControlledSwitch() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      label="启用通知"
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
}

describe("Core selection controls", () => {
  it("associates Checkbox labels and preserves native form semantics", () => {
    render(
      <form data-testid="form">
        <Checkbox name="terms" value="accepted" label="接受条款" />
      </form>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "接受条款" }) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).get("terms")).toBe("accepted");
  });

  it("keeps native Radio name exclusivity and submitted values", () => {
    render(
      <form data-testid="form">
        <Radio name="plan" value="basic" label="基础版" defaultChecked />
        <Radio name="plan" value="pro" label="专业版" />
      </form>,
    );

    const basic = screen.getByRole("radio", { name: "基础版" }) as HTMLInputElement;
    const pro = screen.getByRole("radio", { name: "专业版" }) as HTMLInputElement;
    fireEvent.click(pro);

    expect(basic.checked).toBe(false);
    expect(pro.checked).toBe(true);
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("plan")).toBe("pro");
  });

  it("exposes Switch semantics while supporting controlled state", () => {
    render(<ControlledSwitch />);
    const toggle = screen.getByRole("switch", { name: "启用通知" }) as HTMLInputElement;

    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(true);
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
  });

  it("preserves disabled and explicit accessible-name behavior", () => {
    render(
      <>
        <Switch label="系统策略" disabled defaultChecked />
        <Checkbox aria-label="后台任务" />
      </>,
    );

    const disabledSwitch = screen.getByRole("switch", { name: "系统策略" }) as HTMLInputElement;
    expect(disabledSwitch.disabled).toBe(true);
    expect(disabledSwitch.checked).toBe(true);
    fireEvent.click(disabledSwitch);
    expect(disabledSwitch.checked).toBe(true);
    expect(screen.getByRole("checkbox", { name: "后台任务" })).toBeTruthy();
  });
});
