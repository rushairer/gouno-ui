import type { ReactNode } from "react";
import {
  Activity,
  FileText,
  LayoutDashboard,
  Lock,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export type ShowcaseBrand = "blog" | "blog-admin" | "gosso-admin";
export type ShowcasePage = { id: string; label: string; icon: ReactNode };

export const showcaseCatalog: { group: string; items: ShowcasePage[] }[] = [
  {
    group: "Foundations",
    items: [
      { id: "foundations", label: "Core 总览", icon: <LayoutDashboard /> },
      { id: "core-button", label: "Button 按钮", icon: <LayoutDashboard /> },
      { id: "core-typography", label: "Typography 排版", icon: <LayoutDashboard /> },
      { id: "core-space", label: "Space 间距", icon: <LayoutDashboard /> },
      { id: "core-flex", label: "Flex 弹性布局", icon: <LayoutDashboard /> },
      { id: "core-grid", label: "Grid 网格", icon: <LayoutDashboard /> },
      { id: "core-input-number", label: "InputNumber", icon: <LayoutDashboard /> },
      { id: "core-date-picker", label: "DatePicker", icon: <LayoutDashboard /> },
      { id: "core-time-picker", label: "TimePicker", icon: <LayoutDashboard /> },
      { id: "core-color-picker", label: "ColorPicker", icon: <LayoutDashboard /> },
      { id: "core-upload", label: "Upload 上传", icon: <LayoutDashboard /> },
      { id: "core-breadcrumb", label: "Breadcrumb", icon: <LayoutDashboard /> },
      { id: "core-pagination", label: "Pagination", icon: <LayoutDashboard /> },
      { id: "core-steps", label: "Steps", icon: <LayoutDashboard /> },
      { id: "core-empty", label: "Empty 空状态", icon: <LayoutDashboard /> },
      { id: "core-result", label: "Result 结果", icon: <LayoutDashboard /> },
      { id: "core-spin", label: "Spin 加载", icon: <LayoutDashboard /> },
      { id: "core-list", label: "List 列表", icon: <LayoutDashboard /> },
      { id: "core-descriptions", label: "Descriptions", icon: <LayoutDashboard /> },
      { id: "core-calendar", label: "Calendar", icon: <LayoutDashboard /> },
      { id: "core-image", label: "Image 图片", icon: <LayoutDashboard /> },
      { id: "core-carousel", label: "Carousel", icon: <LayoutDashboard /> },
      { id: "core-anchor", label: "Anchor 锚点", icon: <LayoutDashboard /> },
      { id: "core-float-button", label: "FloatButton", icon: <LayoutDashboard /> },
      { id: "core-kbd", label: "Kbd 按键", icon: <LayoutDashboard /> },
    ],
  },
  { group: "Feedback & Overlays", items: [{ id: "overlays", label: "状态与弹层", icon: <Activity /> }] },
  { group: "Forms", items: [{ id: "forms", label: "表单控件", icon: <FileText /> }] },
  { group: "Navigation", items: [{ id: "navigation", label: "导航组件", icon: <LayoutDashboard /> }] },
  { group: "Data Display", items: [{ id: "data", label: "数据展示", icon: <FileText /> }] },
  { group: "Layout & Templates", items: [{ id: "layout", label: "布局与模板", icon: <LayoutDashboard /> }] },
  { group: "Advanced Patterns", items: [{ id: "advanced", label: "高级交互", icon: <Activity /> }] },
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
