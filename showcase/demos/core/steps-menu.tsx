import type { ComponentDocument } from "../../components/component-page";
import StepsControlledExample from "./steps/steps-0";
import StepsControlledExampleSource from "./steps/steps-0.tsx?raw";
import StepsVariantsExample from "./steps/steps-1";
import StepsVariantsExampleSource from "./steps/steps-1.tsx?raw";
import MenuControlledExample from "./menu/menu-0";
import MenuControlledExampleSource from "./menu/menu-0.tsx?raw";
import MenuModesExample from "./menu/menu-1";
import MenuModesExampleSource from "./menu/menu-1.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

export const stepsMenuDocuments: Record<string, ComponentDocument> = {
  steps: {
    title: "Steps 步骤条",
    description:
      "表达有顺序的流程进度。采用稳定 item.key，支持受控 current、状态覆盖、当前步骤百分比、可点击步骤、横纵布局、dot/inline/navigation/panel 类型、filled/outlined 形态、maxCount 收敛和语义样式槽。",
    code: publicSource(StepsControlledExampleSource),
    render: () => <StepsControlledExample />,
    demos: [
      {
        title: "状态、变体与长流程收敛",
        description:
          "status 只覆盖当前步骤；单项 status 优先。maxCount 用省略项收敛长流程，dot 类型自动采用纵向标题布局。",
        code: publicSource(StepsVariantsExampleSource),
        render: () => <StepsVariantsExample />,
      },
    ],
    api: [
      { name: "items", description: "带稳定 key 的步骤项", type: "readonly StepItem[]" },
      { name: "current", description: "当前步骤的零基索引", type: "number", defaultValue: "0" },
      { name: "initial", description: "默认数字标记的起始偏移", type: "number", defaultValue: "0" },
      { name: "orientation", description: "步骤流程布局轴", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
      { name: "titlePlacement", description: "marker 与标题的相对布局；dot 强制 vertical", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
      { name: "type", description: "步骤条结构类型", type: '"default" | "dot" | "inline" | "navigation" | "panel"', defaultValue: '"default"' },
      { name: "variant", description: "marker 的 filled/outlined 视觉形态", type: '"filled" | "outlined"', defaultValue: '"filled"' },
      { name: "size", description: "步骤 marker/文字尺寸", type: '"small" | "middle"', defaultValue: '"middle"' },
      { name: "status", description: "当前步骤状态；item.status 可覆盖单项", type: '"wait" | "process" | "finish" | "error"', defaultValue: '"process"' },
      { name: "percent", description: "当前 process 步骤的 0–100 进度，非法值会归一化", type: "number" },
      { name: "maxCount", description: "长流程最多显示的槽位数；至少 3 才启用收敛", type: "number" },
      { name: "responsive", description: "窄屏时将 horizontal 流程切为纵向排列", type: "boolean", defaultValue: "true" },
      { name: "iconRender", description: "统一替换步骤 marker 内容", type: "(origin: ReactNode, info: StepsIconRenderInfo) => ReactNode" },
      { name: "onChange", description: "提供后步骤项成为可点击导航，回传目标零基索引", type: "(current: number) => void" },
      { name: "classNames", description: "按稳定语义槽追加 className", type: "StepsClassNames" },
      { name: "styles", description: "按稳定语义槽追加 style", type: "StepsStyles" },
      { name: "ref", description: "真实 ol 根元素引用", type: "Ref<HTMLOListElement>" },
    ],
    apiSections: [
      {
        title: "StepItem API",
        rows: [
          { name: "key", description: "稳定唯一标识，也是 React key", type: "Key" },
          { name: "title", description: "步骤主标题", type: "ReactNode" },
          { name: "content", description: "步骤说明内容；替代旧 description 命名", type: "ReactNode" },
          { name: "subTitle", description: "标题旁的简短辅助信息", type: "ReactNode" },
          { name: "icon", description: "覆盖该步骤默认数字/状态 marker", type: "ReactNode" },
          { name: "status", description: "覆盖该步骤自动推导的状态", type: "StepsStatus" },
          { name: "disabled", description: "禁止通过 onChange 激活该步骤", type: "boolean" },
        ],
      },
      {
        title: "State / Accessibility",
        rows: [
          { name: "status resolution", description: "current 前为 finish，current 为 status，之后为 wait；item.status 优先", type: "state rule" },
          { name: "current", description: "活动步骤暴露 aria-current=step", type: "ARIA" },
          { name: "interactive step", description: "传入 onChange 后使用原生 button；disabled 使用原生 disabled", type: "keyboard / ARIA" },
          { name: "percent", description: "当前 process/default 步骤暴露标准 progressbar 语义", type: "ARIA" },
        ],
      },
      {
        title: "Semantic DOM",
        rows: [
          { name: "root", description: "步骤列表 ol", type: "semantic slot" },
          { name: "item", description: "单个流程步骤 li", type: "semantic slot" },
          { name: "marker", description: "数字、状态或自定义图标 marker", type: "semantic slot" },
          { name: "connector", description: "步骤间连接线", type: "semantic slot" },
          { name: "title / subTitle / content", description: "步骤文本区域", type: "semantic slots" },
          { name: "progress", description: "当前步骤百分比轨道", type: "semantic slot" },
        ],
      },
    ],
  },
  menu: {
    title: "Menu 导航菜单",
    description:
      "表达可选择的层级命令或导航集合。支持 item/submenu/group/divider、受控与非受控 selectedKeys/openKeys、single/multiple、horizontal/vertical/inline、inline collapse、点击或 hover 子菜单策略、键盘导航、事件上下文和语义样式槽。",
    code: publicSource(MenuControlledExampleSource),
    render: () => <MenuControlledExample />,
    demos: [
      {
        title: "Horizontal、Multiple 与折叠 Inline",
        description:
          "horizontal 使用顶层横向集合；multiple 用 menuitemcheckbox 暴露选择状态；inlineCollapsed 保留图标和可访问名称，并让子菜单使用浮层呈现。",
        code: publicSource(MenuModesExampleSource),
        render: () => <MenuModesExample />,
      },
    ],
    api: [
      { name: "items", description: "带稳定 key 的 MenuNode 层级树", type: "readonly MenuNode[]" },
      { name: "selectedKeys", description: "受控选中项 key", type: "readonly Key[]" },
      { name: "defaultSelectedKeys", description: "非受控初始选中项", type: "readonly Key[]", defaultValue: "[]" },
      { name: "openKeys", description: "受控展开 submenu key", type: "readonly Key[]" },
      { name: "defaultOpenKeys", description: "非受控初始展开 submenu", type: "readonly Key[]", defaultValue: "[]" },
      { name: "mode", description: "根菜单布局/交互模式", type: '"vertical" | "horizontal" | "inline"', defaultValue: '"vertical"' },
      { name: "multiple", description: "允许同时选中多个 leaf item", type: "boolean", defaultValue: "false" },
      { name: "selectable", description: "leaf 点击是否维护 selection 状态", type: "boolean", defaultValue: "true" },
      { name: "inlineCollapsed", description: "仅 inline 模式收起文本并保留图标入口", type: "boolean", defaultValue: "false" },
      { name: "inlineIndent", description: "inline 子层级每级追加的 px 缩进", type: "number", defaultValue: "24" },
      { name: "triggerSubMenuAction", description: "submenu 使用 click 或 hover 打开", type: '"hover" | "click"', defaultValue: '"click"' },
      { name: "forceSubMenuRender", description: "关闭时仍预渲染 submenu DOM 并通过 hidden 隐藏", type: "boolean", defaultValue: "false" },
      { name: "expandIcon", description: "全局自定义 submenu 展开图标", type: "ReactNode | ((info: MenuExpandIconInfo) => ReactNode)" },
      { name: "onClick", description: "leaf 激活事件，不依赖 selectable", type: "(info: MenuClickInfo) => void" },
      { name: "onSelect", description: "选择后回传完整 selectedKeys", type: "(info: MenuSelectInfo) => void" },
      { name: "onDeselect", description: "multiple 模式取消选择后回传完整 selectedKeys", type: "(info: MenuSelectInfo) => void" },
      { name: "onOpenChange", description: "submenu 展开集合变化回调", type: "(openKeys: Key[]) => void" },
      { name: "classNames", description: "按稳定语义槽追加 className", type: "MenuClassNames" },
      { name: "styles", description: "按稳定语义槽追加 style", type: "MenuStyles" },
      { name: "ref", description: "真实 nav 根元素引用", type: "Ref<HTMLElement>" },
    ],
    apiSections: [
      {
        title: "MenuNode API",
        rows: [
          { name: "item", description: "key/label/icon/disabled/title；type 可省略或为 item", type: "MenuItem" },
          { name: "submenu", description: "key/label/children/icon/disabled/title，type=submenu", type: "MenuSubMenuItem" },
          { name: "group", description: "带可选 label 的逻辑分组，type=group", type: "MenuItemGroup" },
          { name: "divider", description: "不可交互的分隔项，type=divider", type: "MenuDividerItem" },
        ],
      },
      {
        title: "Events / State",
        rows: [
          { name: "keyPath", description: "按根 submenu → leaf 的顺序回传；group 不进入导航路径", type: "Key[]" },
          { name: "single selection", description: "选中 leaf 使用 role=menuitem + aria-current=page", type: "ARIA" },
          { name: "multiple selection", description: "leaf 使用 role=menuitemcheckbox + aria-checked", type: "ARIA" },
          { name: "submenu", description: "触发器暴露 aria-haspopup=menu 与 aria-expanded", type: "ARIA" },
          { name: "keyboard", description: "ArrowUp/Down、Home/End 遍历可见项；ArrowRight 打开 submenu，ArrowLeft/Escape 返回父级", type: "keyboard" },
        ],
      },
      {
        title: "Semantic DOM",
        rows: [
          { name: "root", description: "nav 根容器", type: "semantic slot" },
          { name: "list / item", description: "菜单集合与交互项", type: "semantic slots" },
          { name: "icon / label / expandIcon", description: "菜单项内容区域", type: "semantic slots" },
          { name: "submenu", description: "拥有子集合的 li", type: "semantic slot" },
          { name: "group / groupLabel", description: "逻辑分组及其标签", type: "semantic slots" },
          { name: "divider", description: "role=separator 分隔项", type: "semantic slot" },
        ],
      },
    ],
  },
};
