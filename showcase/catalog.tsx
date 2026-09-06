import type { ReactNode } from "react";
import { Activity, FileText, LayoutDashboard, Lock, Settings, Shield, Users } from "lucide-react";

export type ShowcaseBrand = "blog" | "blog-admin" | "gosso-admin";
export type ShowcasePage = { id: string; label: string; icon: ReactNode };
const item = (id: string, label: string): ShowcasePage => ({ id, label, icon: <LayoutDashboard /> });

export const showcaseCatalog: { group: string; items: ShowcasePage[] }[] = [
  { group: "General", items: [item("core-button", "Button 按钮"), item("core-typography", "Typography 排版"), item("core-kbd", "Kbd 按键")] },
  { group: "Layout", items: [item("core-space", "Space 间距"), item("core-flex", "Flex 弹性布局"), item("core-grid", "Grid 网格")] },
  { group: "Data Entry", items: [item("core-input-number", "InputNumber"), item("core-date-picker", "DatePicker"), item("core-time-picker", "TimePicker"), item("core-color-picker", "ColorPicker"), item("core-upload", "Upload 上传")] },
  { group: "Navigation", items: [item("core-breadcrumb", "Breadcrumb"), item("core-pagination", "Pagination"), item("core-steps", "Steps"), item("core-anchor", "Anchor 锚点")] },
  { group: "Data Display", items: [item("core-list", "List 列表"), item("core-descriptions", "Descriptions"), item("core-calendar", "Calendar"), item("core-image", "Image 图片"), item("core-carousel", "Carousel")] },
  { group: "Feedback", items: [item("core-empty", "Empty 空状态"), item("core-result", "Result 结果"), item("core-spin", "Spin 加载")] },
  { group: "Other", items: [item("core-float-button", "FloatButton")] },
  {
    group: "Blog 公共",
    items: [
      { id: "blog-home", label: "首页与阅读", icon: <FileText /> },
      { id: "blog-account", label: "账户状态", icon: <Users /> },
    ],
  },
  {
    group: "Blog Admin",
    items: [
      { id: "admin-dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
      { id: "admin-list", label: "文章与页面列表", icon: <FileText /> },
      { id: "admin-taxonomy", label: "分类、标签与评论", icon: <FileText /> },
      { id: "admin-media", label: "媒体库", icon: <FileText /> },
      { id: "admin-editor", label: "编辑器", icon: <Activity /> },
      { id: "admin-settings", label: "设置与 AI", icon: <Settings /> },
    ],
  },
  {
    group: "Gosso Admin",
    items: [
      { id: "gosso-login", label: "登录与 MFA", icon: <Lock /> },
      { id: "gosso-account", label: "账户设置", icon: <Users /> },
      { id: "gosso-system", label: "系统管理", icon: <Shield /> },
      { id: "gosso-users", label: "用户管理", icon: <Users /> },
      { id: "gosso-clients", label: "客户端管理", icon: <Shield /> },
      { id: "gosso-audit", label: "审计日志", icon: <FileText /> },
      { id: "gosso-settings", label: "站点设置", icon: <Settings /> },
      { id: "gosso-status", label: "系统状态", icon: <Activity /> },
    ],
  },
];
