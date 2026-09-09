import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Tab, TabList, TabPanel, Tabs } from "../src/core";

afterEach(cleanup);

describe("Core Tabs primitive family", () => {
  it("composes TabList, Tab and TabPanel under the canonical Tabs state root", () => {
    render(
      <Tabs defaultActiveKey="overview">
        <TabList aria-label="项目设置">
          <Tab value="overview">概览</Tab>
          <Tab value="security">安全</Tab>
          <Tab value="billing" disabled>
            账单
          </Tab>
        </TabList>
        <TabPanel value="overview">概览内容</TabPanel>
        <TabPanel value="security">安全内容</TabPanel>
        <TabPanel value="billing">账单内容</TabPanel>
      </Tabs>,
    );

    expect(
      screen.getByRole("tab", { name: "概览" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByText("概览内容")).toBeTruthy();
    expect(
      (screen.getByRole("tab", { name: "账单" }) as HTMLButtonElement).disabled,
    ).toBe(true);

    fireEvent.mouseDown(screen.getByRole("tab", { name: "安全" }), {
      button: 0,
    });
    expect(
      screen.getByRole("tab", { name: "安全" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByText("安全内容")).toBeTruthy();
  });

  it("keeps primitive styling props aligned with high-level placement semantics", () => {
    render(
      <Tabs defaultActiveKey="a" tabPosition="left">
        <TabList
          aria-label="侧边设置"
          type="card"
          size="small"
          tabPosition="left"
        >
          <Tab value="a" size="small" tabPosition="left">
            A
          </Tab>
          <Tab value="b" size="small" tabPosition="left">
            B
          </Tab>
        </TabList>
        <TabPanel value="a">A panel</TabPanel>
        <TabPanel value="b">B panel</TabPanel>
      </Tabs>,
    );

    const list = screen.getByRole("tablist", { name: "侧边设置" });
    const trigger = screen.getByRole("tab", { name: "A" });
    expect(list.getAttribute("data-tab-position")).toBe("left");
    expect(list.getAttribute("data-variant")).toBe("default");
    expect(list.className).toContain("border-r");
    expect(trigger.getAttribute("data-tab-position")).toBe("left");
    expect(trigger.className).toContain("!h-8");
  });
});
