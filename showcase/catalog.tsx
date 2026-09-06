import type { ReactNode } from "react";
import { Activity, FileText, LayoutDashboard, Lock, Settings, Shield, Users } from "lucide-react";

export type ShowcaseBrand = "blog" | "blog-admin" | "gosso-admin";
export type ShowcasePage = { id: string; label: string; icon: ReactNode };
const item = (id: string, label: string): ShowcasePage => ({ id, label, icon: <LayoutDashboard /> });

export const showcaseCatalog: { group: string; items: ShowcasePage[] }[] = [
  { group: "General", items: [item("core-button", "Button 按钮"), item("core-icon", "Icon 图标"), item("core-typography", "Typography 排版"), item("core-kbd", "Kbd 按键"), item("core-badge", "Badge 徽标数"), item("core-tag", "Tag 标签"), item("core-avatar", "Avatar 头像")] },
  { group: "Layout", items: [item("core-space", "Space 间距"), item("core-flex", "Flex 弹性布局"), item("core-grid", "Grid 网格"), item("core-separator", "Separator 分隔线"), item("core-card", "Card 卡片"), item("core-splitter", "Splitter 分隔面板"), item("core-page-layout", "Layout 页面布局")] },
  { group: "Data Entry", items: [item("core-input-number", "InputNumber"), item("core-date-picker", "DatePicker"), item("core-date-range-picker", "DateRangePicker"), item("core-time-picker", "TimePicker"), item("core-color-picker", "ColorPicker"), item("core-upload", "Upload 上传"), item("core-input", "Input 输入框"), item("core-textarea", "Textarea 多行输入"), item("core-select", "Select 选择器"), item("core-checkbox", "Checkbox 多选框"), item("core-radio", "Radio 单选框"), item("core-switch", "Switch 开关"), item("core-slider", "Slider 滑动输入"), item("core-rate", "Rate 评分"), item("core-autocomplete", "AutoComplete"), item("core-segmented", "Segmented"), item("core-cascader", "Cascader 级联选择"), item("core-tree-select", "TreeSelect 树选择"), item("core-transfer", "Transfer 穿梭框"), item("core-mentions", "Mentions 提及"), item("core-input-otp", "Input.OTP 验证码"), item("core-form", "Form 表单")] },
  { group: "Navigation", items: [item("core-breadcrumb", "Breadcrumb"), item("core-pagination", "Pagination"), item("core-steps", "Steps"), item("core-anchor", "Anchor 锚点"), item("core-tabs", "Tabs 标签页"), item("core-collapse", "Collapse 折叠面板"), item("core-dropdown", "Dropdown 下拉菜单"), item("core-menu", "Menu 菜单")] },
  { group: "Data Display", items: [item("core-list", "List 列表"), item("core-descriptions", "Descriptions"), item("core-calendar", "Calendar"), item("core-image", "Image 图片"), item("core-carousel", "Carousel"), item("core-table", "Table 表格"), item("core-data-table", "DataTable 数据表格"), item("core-statistic", "Statistic 统计数值"), item("core-timeline", "Timeline 时间轴"), item("core-tree", "Tree 树")] },
  { group: "Feedback", items: [item("core-empty", "Empty 空状态"), item("core-result", "Result 结果"), item("core-spin", "Spin 加载"), item("core-alert", "Alert 警告提示"), item("core-progress", "Progress 进度条"), item("core-skeleton", "Skeleton 骨架屏"), item("core-modal", "Modal 对话框"), item("core-drawer", "Drawer 抽屉"), item("core-popover", "Popover 气泡卡片"), item("core-tooltip", "Tooltip 文字提示"), item("core-popconfirm", "Popconfirm 气泡确认"), item("core-message", "Message 全局提示"), item("core-notification", "Notification 通知"), item("core-tour", "Tour 引导")] },
  { group: "Other", items: [item("core-float-button", "FloatButton"), item("core-qrcode", "QRCode 二维码"), item("core-watermark", "Watermark 水印"), item("core-affix", "Affix 固钉"), item("core-back-top", "BackTop 回到顶部")] },
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
