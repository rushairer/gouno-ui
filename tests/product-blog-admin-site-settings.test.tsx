import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminSiteSettingsDemo } from "../showcase/demos/products/blog-admin-site-settings";

afterEach(cleanup);

describe("Blog Admin Site Settings product migration fixture", () => {
  it("preserves the route-level PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminSiteSettingsDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "站点设置" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/settings")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/settings")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "已解锁" })).toBeTruthy();
  });

  it("preserves all five settings sections with one tablist and open panel leads", () => {
    render(<BlogAdminSiteSettingsDemo />);

    expect(screen.getAllByRole("tablist")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: "基础信息" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "网站图标" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "首页 Hero" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "公开联系方式" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "SEO" })).toBeTruthy();

    const basicLead = screen.getByText("站点名称、内容定位和作者展示信息。");
    expect(basicLead.closest('[data-slot="showcase-tab-panel-lead"]')).toBeTruthy();
    expect(basicLead.closest('[data-slot="card"]')).toBeNull();
    expect(screen.queryByRole("heading", { level: 2, name: "基础信息" })).toBeNull();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "首页 Hero" }), { button: 0 });
    expect(screen.getByText("定制前台首页顶部的 Slogan 标语、描述以及右侧系统图。")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "首页 Hero 标语与插图" })).toBeNull();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "公开联系方式" }), { button: 0 });
    expect(screen.getByRole("textbox", { name: "RSS" })).toBeTruthy();
  });

  it("keeps Blog Sudo/MFA protection product-local", () => {
    render(<BlogAdminSiteSettingsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "已锁定" }));

    expect(screen.getByText("站点核心配置保护")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "解锁以修改设置" }));
    expect(screen.getByText("Sudo 已解锁 · 剩余约 10 分钟")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "基础信息" })).toBeTruthy();
  });

  it("edits and saves the real Blog site settings contract", () => {
    render(<BlogAdminSiteSettingsDemo />);

    const title = screen.getByRole("textbox", { name: /站点名称/ });
    fireEvent.change(title, { target: { value: "Gouno Engineering" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));

    expect(screen.getByText("站点设置已成功保存（Showcase 模拟）。")).toBeTruthy();
    expect((title as HTMLInputElement).value).toBe("Gouno Engineering");
  });

  it("preserves an unsaved draft when recent MFA expires during save", () => {
    render(<BlogAdminSiteSettingsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "保存时过期" }));

    const title = screen.getByRole("textbox", { name: /站点名称/ });
    fireEvent.change(title, { target: { value: "Draft survives MFA" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));

    expect(screen.getByText("近期 MFA 已过期，未保存草稿已暂存；完成 Step-Up 后会恢复。")).toBeTruthy();
    expect(screen.getByText("站点核心配置保护")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "解锁以修改设置" }));
    const restored = screen.getByRole("textbox", { name: /站点名称/ }) as HTMLInputElement;
    expect(restored.value).toBe("Draft survives MFA");
    expect(screen.getByText("MFA 已完成，待保存草稿已恢复，请再次保存。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));
    expect(screen.getByText("站点设置已成功保存（Showcase 模拟）。")).toBeTruthy();
    expect((screen.getByRole("textbox", { name: /站点名称/ }) as HTMLInputElement).value).toBe("Draft survives MFA");
  });

  it("preserves the real RSS validation and loading/error fixture states", () => {
    render(<BlogAdminSiteSettingsDemo />);

    fireEvent.mouseDown(screen.getByRole("tab", { name: "公开联系方式" }), { button: 0 });
    const rss = screen.getByRole("textbox", { name: "RSS" });
    fireEvent.change(rss, { target: { value: "ftp://example.test/feed" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));
    expect(screen.getByText("RSS 地址必须是以 / 开头的站内路径，或完整的 http(s) URL。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    expect(screen.getByRole("alert").getAttribute("data-type")).toBe("error");
    expect(screen.getByText("站点设置加载失败")).toBeTruthy();
  });
});