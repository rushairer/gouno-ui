import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ConfigProvider, enUS, zhCN, Input, InputNumber, DatePicker, Select, Upload, Pagination } from "../src/core";

afterEach(cleanup);

describe("component localization", () => {
  it("defaults to English without a provider and never creates a DOM wrapper", () => {
    const { container } = render(<ConfigProvider><Input defaultValue="value" allowClear /></ConfigProvider>);
    expect(screen.getByRole("button", { name: "Clear input" })).toBeTruthy();
    expect(container.firstElementChild?.getAttribute("data-slot")).toBe("input-group");
  });

  it("inherits the nearest complete pack, handles undefined overrides, and updates at runtime", () => {
    const view = (chinese: boolean) => <ConfigProvider locale={chinese ? zhCN : enUS}>
      <ConfigProvider><Input defaultValue="value" allowClear locale={{ clearLabel: undefined }} /></ConfigProvider>
      <ConfigProvider locale={enUS}><DatePicker defaultValue="2026-09-12" /></ConfigProvider>
    </ConfigProvider>;
    const { rerender } = render(view(true));
    expect(screen.getByRole("button", { name: "清除输入" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear date" })).toBeTruthy();
    rerender(view(false));
    expect(screen.getByRole("button", { name: "Clear input" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "清除输入" })).toBeNull();
  });

  it("lets explicit copy and partial local overrides win without affecting sibling components", () => {
    render(<ConfigProvider locale={zhCN}>
      <Input defaultValue="value" allowClear locale={{ clearLabel: "重置标题" }} />
      <InputNumber defaultValue={1} />
      <Select aria-label="State" placeholder="Choose status" />
      <Pagination total={100} prevText="Back" nextText="Forward" />
    </ConfigProvider>);
    expect(screen.getByRole("button", { name: "重置标题" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "增加" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "State" }).textContent).toContain("Choose status");
    expect(screen.getByRole("button", { name: "Forward" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "第 2 页" })).toBeTruthy();
  });

  it("localizes Select portal search and empty copy while preserving the caller's value labels", () => {
    render(<ConfigProvider locale={zhCN}><Select aria-label="团队" showSearch><option value="a">Alpha</option></Select></ConfigProvider>);
    fireEvent.click(screen.getByRole("combobox", { name: "团队" }));
    const search = screen.getByRole("combobox", { name: "搜索选项" });
    expect(search.getAttribute("placeholder")).toBe("搜索");
    fireEvent.change(search, { target: { value: "missing" } });
    expect(screen.getByRole("status").textContent).toBe("暂无选项");
  });

  it("formats dynamic file and pagination labels with the selected language", () => {
    render(<ConfigProvider locale={zhCN}>
      <Upload defaultFiles={[new File(["x"], "测试.txt")]} />
      <Pagination total={200} showSizeChanger showQuickJumper />
    </ConfigProvider>);
    expect(screen.getByRole("list", { name: "已选择文件" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "移除 测试.txt" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "20 条 / 页" })).toBeTruthy();
    expect(screen.getByRole("spinbutton", { name: "跳转到页码" })).toBeTruthy();
  });

  it("keeps explicit ReactNode navigation copy accessible instead of stringifying it", () => {
    render(<Pagination total={20} nextText={<span>Next results</span>} />);
    expect(screen.getByRole("button", { name: "Next results" })).toBeTruthy();
  });
});
