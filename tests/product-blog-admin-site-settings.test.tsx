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

  it("preserves all five real settings sections through canonical Tabs", () => {
    render(<BlogAdminSiteSettingsDemo />);

    expect(screen.getByRole("tab", { name: "基础信息" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "网站图标" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "首页 Hero" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "公开联系方式" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "SEO" })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "公开联系方式" }));
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

  it("preserves the real RSS validation and loading/error fixture states", () => {
    render(<BlogAdminSiteSettingsDemo />);

    fireEvent.click(screen.getByRole("tab", { name: "公开联系方式" }));
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
