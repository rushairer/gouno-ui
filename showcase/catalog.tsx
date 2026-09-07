import type { ReactNode } from "react";
import { Box, Home, LayoutDashboard, Palette, PanelsTopLeft } from "lucide-react";
import { componentProgress } from "./component-progress";

export type ShowcaseWorkspace = "gouno-ui" | "blog" | "blog-admin" | "gosso-admin";
export type ShowcaseLayer = "core" | "theme" | "patterns" | "gouno";

export type ShowcasePage = {
  id: string;
  name: string;
  nameZh: string;
  label: string;
  progress: number;
  icon: ReactNode;
};

export type ShowcaseGroup = {
  workspace: ShowcaseWorkspace;
  layer?: ShowcaseLayer;
  group: string;
  items: ShowcasePage[];
};

const item = (
  id: string,
  name: string,
  nameZh: string,
  progress: number,
  icon: ReactNode = <LayoutDashboard />,
): ShowcasePage => ({
  id,
  name,
  nameZh,
  label: `${name} ${nameZh}`,
  progress: componentProgress(id, progress),
  icon,
});

export const showcaseCatalog: ShowcaseGroup[] = [
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "General 通用",
    items: [
      item("core-button", "Button", "按钮", 100),
      item("core-icon", "Icon", "图标", 85),
      item("core-typography", "Typography", "排版", 78),
      item("core-kbd", "Kbd", "键盘按键", 90),
      item("core-badge", "Badge", "徽标数", 100),
      item("core-tag", "Tag", "标签", 100),
      item("core-avatar", "Avatar", "头像", 82),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "Layout 布局",
    items: [
      item("core-space", "Space", "间距", 100),
      item("core-flex", "Flex", "弹性布局", 78),
      item("core-grid", "Grid", "网格", 72),
      item("core-separator", "Separator", "分隔线", 90),
      item("core-card", "Card", "卡片", 100),
      item("core-splitter", "Splitter", "分隔面板", 68),
      item("core-page-layout", "Layout", "页面布局", 75),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "Data Entry 数据录入",
    items: [
      item("core-input-number", "InputNumber", "数字输入框", 100),
      item("core-date-picker", "DatePicker", "日期选择器", 100),
      item("core-date-range-picker", "DateRangePicker", "日期范围选择器", 68),
      item("core-time-picker", "TimePicker", "时间选择器", 68),
      item("core-color-picker", "ColorPicker", "颜色选择器", 70),
      item("core-upload", "Upload", "上传", 100),
      item("core-input", "Input", "输入框", 100),
      item("core-textarea", "Textarea", "多行输入框", 100),
      item("core-select", "Select", "选择器", 100),
      item("core-checkbox", "Checkbox", "多选框", 78),
      item("core-radio", "Radio", "单选框", 72),
      item("core-switch", "Switch", "开关", 78),
      item("core-slider", "Slider", "滑动输入条", 72),
      item("core-rate", "Rate", "评分", 68),
      item("core-autocomplete", "AutoComplete", "自动完成", 86),
      item("core-segmented", "Segmented", "分段控制器", 70),
      item("core-cascader", "Cascader", "级联选择器", 65),
      item("core-tree-select", "TreeSelect", "树选择器", 84),
      item("core-transfer", "Transfer", "穿梭框", 68),
      item("core-mentions", "Mentions", "提及", 65),
      item("core-input-otp", "Input.OTP", "验证码输入框", 75),
      item("core-form", "Form", "表单", 100),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "Navigation 导航",
    items: [
      item("core-breadcrumb", "Breadcrumb", "面包屑", 78),
      item("core-pagination", "Pagination", "分页", 100),
      item("core-steps", "Steps", "步骤条", 75),
      item("core-anchor", "Anchor", "锚点", 65),
      item("core-tabs", "Tabs", "标签页", 82),
      item("core-collapse", "Collapse", "折叠面板", 72),
      item("core-dropdown", "Dropdown", "下拉菜单", 78),
      item("core-menu", "Menu", "导航菜单", 68),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "Data Display 数据展示",
    items: [
      item("core-list", "List", "列表", 70),
      item("core-descriptions", "Descriptions", "描述列表", 72),
      item("core-calendar", "Calendar", "日历", 68),
      item("core-image", "Image", "图片", 72),
      item("core-carousel", "Carousel", "走马灯", 68),
      item("core-table", "Table", "表格", 100),
      item("core-statistic", "Statistic", "统计数值", 72),
      item("core-timeline", "Timeline", "时间轴", 70),
      item("core-tree", "Tree", "树形控件", 78),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "Feedback 反馈",
    items: [
      item("core-empty", "Empty", "空状态", 82),
      item("core-result", "Result", "结果页", 78),
      item("core-spin", "Spin", "加载指示器", 72),
      item("core-alert", "Alert", "警告提示", 82),
      item("core-progress", "Progress", "进度条", 100),
      item("core-skeleton", "Skeleton", "骨架屏", 75),
      item("core-modal", "Modal", "模态对话框", 100),
      item("core-drawer", "Drawer", "抽屉", 100),
      item("core-popover", "Popover", "气泡卡片", 78),
      item("core-tooltip", "Tooltip", "文字提示", 78),
      item("core-popconfirm", "Popconfirm", "气泡确认框", 78),
      item("core-message", "Message", "全局提示", 75),
      item("core-notification", "Notification", "通知提醒框", 75),
      item("core-tour", "Tour", "漫游式引导", 68),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "core",
    group: "Other 其他",
    items: [
      item("core-float-button", "FloatButton", "悬浮按钮", 65),
      item("core-qrcode", "QRCode", "二维码", 72),
      item("core-watermark", "Watermark", "水印", 70),
      item("core-affix", "Affix", "固钉", 62),
      item("core-back-top", "BackTop", "回到顶部", 68),
    ],
  },
  {
    workspace: "gouno-ui",
    layer: "theme",
    group: "Theme System 主题系统",
    items: [item("theme-system", "Theme System", "主题系统", 90, <Palette />)],
  },
  {
    workspace: "gouno-ui",
    layer: "patterns",
    group: "Admitted Patterns 已认证模式",
    items: [],
  },
  {
    workspace: "gouno-ui",
    layer: "gouno",
    group: "Application Structure 应用结构",
    items: [
      item("gouno-app-shell", "AppShell", "应用框架", 90, <PanelsTopLeft />),
      item("gouno-page-container", "PageContainer", "页面容器", 90, <Box />),
    ],
  },
  {
    workspace: "blog",
    group: "Migrated Pages 已迁移页面",
    items: [],
  },
  {
    workspace: "blog-admin",
    group: "Migrated Pages 已迁移页面",
    items: [],
  },
  {
    workspace: "gosso-admin",
    group: "Migrated Pages 已迁移页面",
    items: [item("gosso-overview", "Overview", "概览", 100, <Home />)],
  },
];
