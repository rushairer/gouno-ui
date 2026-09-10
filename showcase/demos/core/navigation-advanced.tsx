import type { ComponentDocument } from "../../components/component-page";
import BreadcrumbRouteExample from "./breadcrumb/breadcrumb-0";
import BreadcrumbRouteExampleSource from "./breadcrumb/breadcrumb-0.tsx?raw";
import BreadcrumbRenderExample from "./breadcrumb/breadcrumb-1";
import BreadcrumbRenderExampleSource from "./breadcrumb/breadcrumb-1.tsx?raw";
import CollapseControlledExample from "./collapse/collapse-0";
import CollapseControlledExampleSource from "./collapse/collapse-0.tsx?raw";
import CollapseBehaviorExample from "./collapse/collapse-1";
import CollapseBehaviorExampleSource from "./collapse/collapse-1.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

export const advancedNavigationDocuments: Record<string, ComponentDocument> = {
  breadcrumb: {
    title: "Breadcrumb 面包屑",
    description:
      "用于标识当前页面在信息层级中的位置。采用稳定 item.key，支持 href/path、动态 params、逐级路径累积、菜单、独立 separator item、自定义 itemRender 与语义槽。",
    code: publicSource(BreadcrumbRouteExampleSource),
    render: () => <BreadcrumbRouteExample />,
    demos: [
      {
        title: "自定义渲染与分隔",
        description:
          "itemRender 接收解析后的 href、累积 paths 与 isLast；显式 separator item 可在局部覆盖全局 separator。",
        code: publicSource(BreadcrumbRenderExampleSource),
        render: () => <BreadcrumbRenderExample />,
      },
    ],
    api: [
      {
        name: "items",
        description: "带稳定 key 的路由项或显式 separator item",
        type: "readonly BreadcrumbItem[]",
      },
      {
        name: "separator",
        description: "普通层级之间的全局分隔内容",
        type: "ReactNode",
        defaultValue: '"/"',
      },
      {
        name: "dropdownIcon",
        description: "路由项 menu 的展开图标",
        type: "ReactNode",
      },
      {
        name: "params",
        description: "替换 path 中 :param 占位符的动态参数",
        type: "Readonly<Record<string, string | number>>",
        defaultValue: "{}",
      },
      {
        name: "itemRender",
        description: "统一自定义路由项渲染；收到解析后的 href 与路径上下文",
        type: "(info: BreadcrumbItemRenderInfo) => ReactNode",
      },
      {
        name: "classNames",
        description: "按稳定语义槽追加 className",
        type: "BreadcrumbClassNames",
      },
      {
        name: "styles",
        description: "按稳定语义槽追加 style",
        type: "BreadcrumbStyles",
      },
      {
        name: "ref",
        description: "真实 nav 根元素引用",
        type: "Ref<HTMLElement>",
      },
    ],
    apiSections: [
      {
        title: "BreadcrumbRouteItem API",
        rows: [
          { name: "key", description: "稳定唯一标识", type: "Key" },
          { name: "title", description: "路由项标题", type: "ReactNode" },
          { name: "href", description: "直接链接地址；优先于 path 解析", type: "string" },
          { name: "path", description: "参与逐级累积和 params 替换的路径片段", type: "string" },
          { name: "menu", description: "挂载在当前路由项旁的下拉导航菜单", type: "BreadcrumbMenu" },
          { name: "className / style", description: "单项样式扩展", type: "string / CSSProperties" },
          { name: "onClick", description: "路由项点击回调，不接管导航策略", type: "(event: MouseEvent<HTMLElement>) => void" },
        ],
      },
      {
        title: "BreadcrumbSeparatorItem API",
        rows: [
          { name: "key", description: "稳定唯一标识", type: "Key" },
          { name: "type", description: "声明显式分隔项", type: '"separator"' },
          { name: "separator", description: "仅覆盖这一处的分隔内容", type: "ReactNode" },
        ],
      },
      {
        title: "BreadcrumbMenu API",
        rows: [
          { name: "items", description: "菜单项列表；菜单项同样必须提供稳定 key", type: "readonly BreadcrumbMenuItem[]" },
          { name: "aria-label", description: "菜单触发器标准 ARIA 可访问名称", type: "string" },
          { name: "menu item", description: "title/href/disabled/onClick；Breadcrumb 菜单保持导航语义，不混入 destructive intent", type: "BreadcrumbMenuItem" },
        ],
      },
      {
        title: "Routing semantics",
        rows: [
          { name: "path accumulation", description: "path 按出现顺序累积为 /parent/child；href 不参与后续 path 累积", type: "routing rule" },
          { name: "params", description: ":name 由 params[name] URL 编码后替换；缺失参数保留原占位符", type: "routing rule" },
          { name: "current page", description: "最后一个路由项自动暴露 aria-current=page", type: "ARIA" },
        ],
      },
      {
        title: "Semantic DOM",
        rows: [
          { name: "root", description: "nav 根容器", type: "semantic slot" },
          { name: "item", description: "路由项 li", type: "semantic slot" },
          { name: "separator", description: "所有分隔内容", type: "semantic slot" },
        ],
      },
    ],
  },
  collapse: {
    title: "Collapse 折叠面板",
    description:
      "组织可展开的内容分区。支持受控/非受控 activeKey、accordion、header/icon/disabled 触发策略、尺寸、ghost/bordered、lazy/销毁/forceRender、extra、自定义箭头和语义槽。",
    code: publicSource(CollapseControlledExampleSource),
    render: () => <CollapseControlledExample />,
    demos: [
      {
        title: "Icon-only 与内容生命周期",
        description:
          "collapsible=icon 将展开行为限制到箭头；destroyOnHidden 与 forceRender 分别控制隐藏内容的卸载和预渲染策略。",
        code: publicSource(CollapseBehaviorExampleSource),
        render: () => <CollapseBehaviorExample />,
      },
    ],
    api: [
      { name: "items", description: "带稳定 key 的折叠面板项", type: "readonly CollapseItem[]" },
      { name: "activeKey", description: "受控激活面板 key；accordion 时仅首项有效", type: "CollapseActiveKey" },
      { name: "defaultActiveKey", description: "非受控初始激活面板", type: "CollapseActiveKey" },
      { name: "accordion", description: "只允许同时展开一个面板", type: "boolean", defaultValue: "false" },
      { name: "bordered", description: "显示外边框及面板分隔线", type: "boolean", defaultValue: "true" },
      { name: "collapsible", description: "全局展开触发区域策略，可被 item 覆盖", type: '"header" | "icon" | "disabled"', defaultValue: '"header"' },
      { name: "destroyOnHidden", description: "隐藏后销毁已渲染的 body；forceRender 项除外", type: "boolean", defaultValue: "false" },
      { name: "expandIcon", description: "按 active/item 状态自定义箭头", type: "(info: CollapseExpandIconInfo) => ReactNode" },
      { name: "expandIconPlacement", description: "箭头位于标题前或后", type: '"start" | "end"', defaultValue: '"start"' },
      { name: "ghost", description: "移除背景、外框和可见面板分隔线", type: "boolean", defaultValue: "false" },
      { name: "size", description: "标题和内容的常规控件尺寸", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
      { name: "onChange", description: "activeKey 变化回调；accordion 收空时返回 []", type: "(activeKey: Key | Key[]) => void" },
      { name: "classNames", description: "按稳定语义槽追加 className", type: "CollapseClassNames" },
      { name: "styles", description: "按稳定语义槽追加 style", type: "CollapseStyles" },
      { name: "ref", description: "真实根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "CollapseItem API",
        rows: [
          { name: "key", description: "稳定唯一标识", type: "Key" },
          { name: "label", description: "面板标题", type: "ReactNode" },
          { name: "children", description: "面板内容", type: "ReactNode" },
          { name: "extra", description: "标题右侧独立附加动作，不触发展开", type: "ReactNode" },
          { name: "collapsible", description: "覆盖本面板的触发策略", type: '"header" | "icon" | "disabled"' },
          { name: "forceRender", description: "即使从未展开也挂载 body", type: "boolean" },
          { name: "showArrow", description: "显示展开箭头；icon-only 模式关闭箭头时面板不可展开", type: "boolean" },
          { name: "classNames / styles", description: "单面板 header/body 样式扩展", type: "Record<\"header\" | \"body\", ...>" },
        ],
      },
      {
        title: "Lifecycle / Accessibility",
        rows: [
          { name: "lazy mount", description: "默认 body 首次展开时才挂载，之后保持挂载", type: "rendering rule" },
          { name: "destroyOnHidden", description: "关闭后移除 body；再次展开重新挂载", type: "rendering rule" },
          { name: "forceRender", description: "优先于 destroyOnHidden，始终保持 body 挂载", type: "rendering rule" },
          { name: "trigger", description: "button 暴露 aria-expanded/aria-controls；disabled 使用原生 disabled", type: "ARIA" },
          { name: "body", description: "role=region 并通过真实 label 进行 aria-labelledby", type: "ARIA" },
        ],
      },
      {
        title: "Semantic DOM",
        rows: [
          { name: "root", description: "折叠组根容器", type: "semantic slot" },
          { name: "item", description: "单个 panel section", type: "semantic slot" },
          { name: "header", description: "标题与 extra 布局区域", type: "semantic slot" },
          { name: "body", description: "可展开内容 region", type: "semantic slot" },
        ],
      },
    ],
  },
};
