import type { ReactNode } from "react";
import { Activity, FileText, LayoutDashboard, Lock, Settings, Shield, Users } from "lucide-react";
import { componentProgress } from "./component-progress";

export type ShowcaseBrand = "blog" | "blog-admin" | "gosso-admin";
export type ShowcasePage = {
  id: string;
  name: string;
  nameZh: string;
  label: string;
  progress: number;
  icon: ReactNode;
};

const item = (id: string, name: string, nameZh: string, progress: number, icon: ReactNode = <LayoutDashboard />): ShowcasePage => ({
  id,
  name,
  nameZh,
  label: `${name} ${nameZh}`,
  progress: componentProgress(id, progress),
  icon,
});

export const showcaseCatalog: { group: string; items: ShowcasePage[] }[] = [
  { group: "General 通用", items: [
    item("core-button", "Button", "按钮", 100), item("core-icon", "Icon", "图标", 85), item("core-typography", "Typography", "排版", 78), item("core-kbd", "Kbd", "键盘按键", 90), item("core-badge", "Badge", "徽标数", 100), item("core-tag", "Tag", "标签", 100), item("core-avatar", "Avatar", "头像", 82),
  ] },
  { group: "Layout 布局", items: [
    item("core-space", "Space", "间距", 100), item("core-flex", "Flex", "弹性布局", 78), item("core-grid", "Grid", "网格", 72), item("core-separator", "Separator", "分隔线", 90), item("core-card", "Card", "卡片", 82), item("core-splitter", "Splitter", "分隔面板", 68), item("core-page-layout", "Layout", "页面布局", 75),
  ] },
  { group: "Data Entry 数据录入", items: [
    item("core-input-number", "InputNumber", "数字输入框", 72), item("core-date-picker", "DatePicker", "日期选择器", 68), item("core-date-range-picker", "DateRangePicker", "日期范围选择器", 68), item("core-time-picker", "TimePicker", "时间选择器", 68), item("core-color-picker", "ColorPicker", "颜色选择器", 70), item("core-upload", "Upload", "上传", 88), item("core-input", "Input", "输入框", 82), item("core-textarea", "Textarea", "多行输入框", 78), item("core-select", "Select", "选择器", 82), item("core-checkbox", "Checkbox", "多选框", 78), item("core-radio", "Radio", "单选框", 72), item("core-switch", "Switch", "开关", 78), item("core-slider", "Slider", "滑动输入条", 72), item("core-rate", "Rate", "评分", 68), item("core-autocomplete", "AutoComplete", "自动完成", 86), item("core-segmented", "Segmented", "分段控制器", 70), item("core-cascader", "Cascader", "级联选择器", 65), item("core-tree-select", "TreeSelect", "树选择器", 84), item("core-transfer", "Transfer", "穿梭框", 68), item("core-mentions", "Mentions", "提及", 65), item("core-input-otp", "Input.OTP", "验证码输入框", 75), item("core-form", "Form", "表单", 90),
  ] },
  { group: "Navigation 导航", items: [
    item("core-breadcrumb", "Breadcrumb", "面包屑", 78), item("core-pagination", "Pagination", "分页", 82), item("core-steps", "Steps", "步骤条", 75), item("core-anchor", "Anchor", "锚点", 65), item("core-tabs", "Tabs", "标签页", 82), item("core-collapse", "Collapse", "折叠面板", 72), item("core-dropdown", "Dropdown", "下拉菜单", 78), item("core-menu", "Menu", "导航菜单", 68),
  ] },
  { group: "Data Display 数据展示", items: [
    item("core-list", "List", "列表", 70), item("core-descriptions", "Descriptions", "描述列表", 72), item("core-calendar", "Calendar", "日历", 68), item("core-image", "Image", "图片", 72), item("core-carousel", "Carousel", "走马灯", 68), item("core-table", "Table", "表格", 82), item("core-data-table", "DataTable", "数据表格", 90), item("core-statistic", "Statistic", "统计数值", 72), item("core-timeline", "Timeline", "时间轴", 70), item("core-tree", "Tree", "树形控件", 78),
  ] },
  { group: "Feedback 反馈", items: [
    item("core-empty", "Empty", "空状态", 82), item("core-result", "Result", "结果页", 78), item("core-spin", "Spin", "加载指示器", 72), item("core-alert", "Alert", "警告提示", 82), item("core-progress", "Progress", "进度条", 75), item("core-skeleton", "Skeleton", "骨架屏", 75), item("core-modal", "Modal", "模态对话框", 88), item("core-drawer", "Drawer", "抽屉", 88), item("core-popover", "Popover", "气泡卡片", 78), item("core-tooltip", "Tooltip", "文字提示", 78), item("core-popconfirm", "Popconfirm", "气泡确认框", 78), item("core-message", "Message", "全局提示", 75), item("core-notification", "Notification", "通知提醒框", 75), item("core-tour", "Tour", "漫游式引导", 68),
  ] },
  { group: "Other 其他", items: [
    item("core-float-button", "FloatButton", "悬浮按钮", 65), item("core-qrcode", "QRCode", "二维码", 72), item("core-watermark", "Watermark", "水印", 70), item("core-affix", "Affix", "固钉", 62), item("core-back-top", "BackTop", "回到顶部", 68),
  ] },
  { group: "Blog 公共", items: [
    item("blog-home", "Blog Home", "博客首页与阅读", 88, <FileText />), item("blog-account", "Blog Account", "博客账户状态", 82, <Users />),
  ] },
  { group: "Blog Admin", items: [
    item("admin-dashboard", "Dashboard", "仪表盘", 90, <LayoutDashboard />), item("admin-list", "Content List", "文章与页面列表", 88, <FileText />), item("admin-taxonomy", "Taxonomy", "分类标签与评论", 80, <FileText />), item("admin-media", "Media Library", "媒体库", 78, <FileText />), item("admin-editor", "Editor", "内容编辑器", 86, <Activity />), item("admin-settings", "Settings & AI", "设置与人工智能", 80, <Settings />),
  ] },
  { group: "Gosso Admin", items: [
    item("gosso-overview", "Overview", "概览", 95, <LayoutDashboard />), item("gosso-login", "Login & MFA", "登录与多因素认证", 88, <Lock />), item("gosso-account", "Account", "账户设置", 84, <Users />), item("gosso-system", "System", "系统管理", 86, <Shield />), item("gosso-users", "Users", "用户管理", 88, <Users />), item("gosso-clients", "Clients", "客户端管理", 84, <Shield />), item("gosso-audit", "Audit Log", "审计日志", 82, <FileText />), item("gosso-settings", "Site Settings", "站点设置", 80, <Settings />), item("gosso-status", "System Status", "系统状态", 84, <Activity />),
  ] },
];
