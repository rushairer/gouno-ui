import type { ComponentDocument } from "../../components/component-page";
import TimelineBasicExample from "./timeline/timeline-0";
import TimelineBasicExampleSource from "./timeline/timeline-0.tsx?raw";
import TimelineLayoutsExample from "./timeline/timeline-1";
import TimelineLayoutsExampleSource from "./timeline/timeline-1.tsx?raw";
import CalendarBasicExample from "./calendar/calendar-0";
import CalendarBasicExampleSource from "./calendar/calendar-0.tsx?raw";
import CalendarYearExample from "./calendar/calendar-1";
import CalendarYearExampleSource from "./calendar/calendar-1.tsx?raw";
import CarouselBasicExample from "./carousel/carousel-0";
import CarouselBasicExampleSource from "./carousel/carousel-0.tsx?raw";
import CarouselEffectsExample from "./carousel/carousel-1";
import CarouselEffectsExampleSource from "./carousel/carousel-1.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

export const advancedDataDisplayDocuments: Record<string, ComponentDocument> = {
  timeline: {
    title: "Timeline 时间轴",
    description:
      "顺序事件展示，覆盖 start/end/alternate 布局、横向方向、倒序、filled/outlined 节点、加载态、自定义图标与稳定语义槽。",
    code: publicSource(TimelineBasicExampleSource),
    render: () => <TimelineBasicExample />,
    demos: [
      {
        title: "Alternate、Horizontal 与 Reverse",
        description:
          "mode 负责节点两侧分布，orientation 负责轴向，reverse 只改变数据展示顺序；三者互不复用同一写路径。",
        code: publicSource(TimelineLayoutsExampleSource),
        render: () => <TimelineLayoutsExample />,
      },
    ],
    api: [
      { name: "items", description: "带稳定 key 的时间轴节点", type: "readonly TimelineItem[]" },
      { name: "mode", description: "节点相对轴线的分布模式", type: '"start" | "alternate" | "end"', defaultValue: '"start"' },
      { name: "orientation", description: "时间轴方向", type: '"vertical" | "horizontal"', defaultValue: '"vertical"' },
      { name: "reverse", description: "反转节点展示顺序", type: "boolean", defaultValue: "false" },
      { name: "titleSpan", description: "垂直布局标题区域到节点中心的占位距离", type: "number | string", defaultValue: "12" },
      { name: "variant", description: "节点视觉变体", type: '"filled" | "outlined"', defaultValue: '"outlined"' },
      { name: "classNames", description: "按语义槽追加 className，可读取当前状态", type: "TimelineClassNames" },
      { name: "styles", description: "按语义槽追加 style，可读取当前状态", type: "TimelineStyles" },
      { name: "ref", description: "真实 ol 根节点引用", type: "Ref<HTMLOListElement>" },
    ],
    apiSections: [
      {
        title: "TimelineItem API",
        rows: [
          { name: "key", description: "稳定节点键", type: "Key" },
          { name: "title", description: "时间、阶段或节点标题", type: "ReactNode" },
          { name: "content", description: "节点主内容", type: "ReactNode" },
          { name: "icon", description: "自定义节点图标", type: "ReactNode" },
          { name: "color", description: "节点强调色，可使用 CSS color/token", type: "string" },
          { name: "loading", description: "以 Core Spinner 表示节点仍在处理中", type: "boolean", defaultValue: "false" },
          { name: "placement", description: "单节点覆盖 mode 计算的布局侧", type: '"start" | "end"' },
        ],
      },
      {
        title: "Semantic DOM",
        rows: [
          { name: "root", description: "时间轴 ol", type: "semantic slot" },
          { name: "item", description: "单个 li 节点", type: "semantic slot" },
          { name: "wrapper", description: "节点内部结构包装", type: "semantic slot" },
          { name: "icon", description: "节点图标/圆点", type: "semantic slot" },
          { name: "section", description: "节点内容区", type: "semantic slot" },
          { name: "header", description: "标题区域", type: "semantic slot" },
          { name: "title", description: "标题内容", type: "semantic slot" },
          { name: "content", description: "主内容", type: "semantic slot" },
          { name: "rail", description: "连接轨道", type: "semantic slot" },
        ],
      },
    ],
  },
  calendar: {
    title: "Calendar 日历",
    description:
      "完整月/年面板，支持受控与非受控值、周序号、有效区间、禁用日期、日期/完整单元格渲染、Header 定制以及 panel/select 事件。",
    code: publicSource(CalendarBasicExampleSource),
    render: () => <CalendarBasicExample />,
    demos: [
      {
        title: "Year mode、Card 模式与 Valid Range",
        description:
          "fullscreen=false 提供紧凑卡片形态；年份面板保留月份选择并遵守有效日期范围。",
        code: publicSource(CalendarYearExampleSource),
        render: () => <CalendarYearExample />,
      },
    ],
    api: [
      { name: "value", description: "受控选中日期", type: "Date" },
      { name: "defaultValue", description: "非受控初始选中日期", type: "Date" },
      { name: "mode", description: "受控面板模式", type: '"month" | "year"' },
      { name: "defaultMode", description: "非受控初始面板模式", type: '"month" | "year"', defaultValue: '"month"' },
      { name: "fullscreen", description: "使用完整页面日历形态；false 为紧凑 Card 形态", type: "boolean", defaultValue: "true" },
      { name: "showWeek", description: "显示 ISO 周序号", type: "boolean", defaultValue: "false" },
      { name: "disabledDate", description: "禁用指定日期", type: "(date: Date) => boolean" },
      { name: "validRange", description: "允许选择的起止日期（含边界）", type: "readonly [Date, Date]" },
      { name: "locale", description: "用于 Intl.DateTimeFormat 的 BCP 47 locale", type: "string" },
      { name: "cellRender", description: "基于默认节点扩展日期/月单元格", type: "(date: Date, info: CalendarCellInfo) => ReactNode" },
      { name: "fullCellRender", description: "完全替换日期/月单元格内部节点", type: "(date: Date, info: CalendarCellInfo) => ReactNode" },
      { name: "headerRender", description: "完全定制面板 Header", type: "(props: CalendarHeaderRenderProps) => ReactNode" },
      { name: "onChange", description: "选中日期发生变化时触发", type: "(date: Date) => void" },
      { name: "onPanelChange", description: "面板日期或 month/year 模式变化时触发", type: "(date: Date, mode: CalendarMode) => void" },
      { name: "onSelect", description: "用户选择日期/月时触发，并给出来源", type: "(date: Date, info: { source: CalendarSelectSource }) => void" },
      { name: "classNames", description: "按语义槽追加 className", type: "CalendarClassNames" },
      { name: "styles", description: "按语义槽追加 style", type: "CalendarStyles" },
      { name: "ref", description: "真实根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "CalendarCellInfo API",
        rows: [
          { name: "originNode", description: "默认可访问日期/月节点", type: "ReactNode" },
          { name: "today", description: "当前本地日期", type: "Date" },
          { name: "mode", description: "当前渲染 month/year 面板", type: "CalendarMode" },
          { name: "range", description: "当前日期是否为 validRange 起止边界", type: '"start" | "end"' },
        ],
      },
      {
        title: "Keyboard / accessibility",
        rows: [
          { name: "ArrowLeft / ArrowRight", description: "月面板日期按钮按日移动焦点", type: "keyboard" },
          { name: "ArrowUp / ArrowDown", description: "月面板按周移动焦点", type: "keyboard" },
          { name: "aria-selected", description: "标识选中日期/月", type: "ARIA" },
          { name: "aria-current=date", description: "标识今天", type: "ARIA" },
        ],
      },
    ],
  },
  carousel: {
    title: "Carousel 走马灯",
    description:
      "支持箭头、圆点、逻辑圆点位置、自动播放、滚动/淡入效果、拖拽、有限/循环导航、变更回调以及 goTo/next/prev 命令式控制。",
    code: publicSource(CarouselBasicExampleSource),
    render: () => <CarouselBasicExample />,
    demos: [
      {
        title: "Fade、Autoplay 与 Dot Duration",
        description:
          "自动播放遵守 prefers-reduced-motion，并在 hover/focus 时按策略暂停；dotDuration 可可视化当前自动播放周期。",
        code: publicSource(CarouselEffectsExampleSource),
        render: () => <CarouselEffectsExample />,
      },
    ],
    api: [
      { name: "items", description: "轮播内容节点", type: "readonly ReactNode[]" },
      { name: "activeIndex", description: "受控当前索引", type: "number" },
      { name: "defaultActiveIndex", description: "非受控初始索引", type: "number", defaultValue: "0" },
      { name: "arrows", description: "显示前后导航箭头", type: "boolean", defaultValue: "false" },
      { name: "dots", description: "显示可选择的分页圆点", type: "boolean", defaultValue: "true" },
      { name: "dotPlacement", description: "圆点逻辑位置", type: '"top" | "bottom" | "start" | "end"', defaultValue: '"bottom"' },
      { name: "autoplay", description: "自动播放或自动播放配置", type: "boolean | CarouselAutoplayConfig", defaultValue: "false" },
      { name: "autoplaySpeed", description: "自动切换间隔（ms）", type: "number", defaultValue: "3000" },
      { name: "adaptiveHeight", description: "允许 viewport 高度随内容过渡", type: "boolean", defaultValue: "false" },
      { name: "draggable", description: "允许水平拖拽/滑动切换", type: "boolean", defaultValue: "false" },
      { name: "effect", description: "唯一的切换效果写入口", type: '"scrollx" | "fade"', defaultValue: '"scrollx"' },
      { name: "infinite", description: "首尾循环导航", type: "boolean", defaultValue: "true" },
      { name: "speed", description: "切换动画时长（ms）", type: "number", defaultValue: "500" },
      { name: "easing", description: "CSS timing function", type: "string", defaultValue: '"ease"' },
      { name: "waitForAnimate", description: "动画执行期间忽略新的切换请求", type: "boolean", defaultValue: "false" },
      { name: "pauseOnHover", description: "hover 时暂停 autoplay", type: "boolean", defaultValue: "true" },
      { name: "pauseOnFocus", description: "组件内焦点存在时暂停 autoplay", type: "boolean", defaultValue: "true" },
      { name: "beforeChange", description: "索引切换前触发", type: "(current: number, next: number) => void" },
      { name: "afterChange", description: "切换动画完成后触发", type: "(current: number) => void" },
      { name: "onChange", description: "新索引确定时触发", type: "(current: number) => void" },
      { name: "classNames", description: "按语义槽追加 className", type: "CarouselClassNames" },
      { name: "styles", description: "按语义槽追加 style", type: "CarouselStyles" },
      { name: "ref", description: "goTo/next/prev 命令式控制器", type: "Ref<CarouselRef>" },
    ],
    apiSections: [
      {
        title: "CarouselRef API",
        rows: [
          { name: "goTo", description: "跳到指定索引，可选择不播放动画", type: "(slide: number, dontAnimate?: boolean) => void" },
          { name: "next", description: "切换到下一项", type: "() => void" },
          { name: "prev", description: "切换到上一项", type: "() => void" },
        ],
      },
      {
        title: "Semantic DOM",
        rows: [
          { name: "root", description: "aria-roledescription=carousel 根区域", type: "semantic slot" },
          { name: "viewport", description: "裁切视窗", type: "semantic slot" },
          { name: "track", description: "滚动/淡入轨道", type: "semantic slot" },
          { name: "slide", description: "aria-roledescription=slide 项", type: "semantic slot" },
          { name: "arrows", description: "箭头层", type: "semantic slot" },
          { name: "prevArrow / nextArrow", description: "前后导航按钮", type: "semantic slot" },
          { name: "dots / dot", description: "分页圆点容器和单项", type: "semantic slot" },
        ],
      },
    ],
  },
};
