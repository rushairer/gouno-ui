import type { ComponentDocument } from "../../components/component-page";
import ButtonTypesDemo from "./button/types";
import ButtonTypesDemoSource from "./button/types.tsx?raw";
import ButtonStateDemo from "./button/state";
import ButtonStateDemoSource from "./button/state.tsx?raw";
import ButtonIconFamilyDemo from "./button/icons";
import ButtonIconFamilyDemoSource from "./button/icons.tsx?raw";
import ButtonNavigationDemo from "./button/navigation";
import ButtonNavigationDemoSource from "./button/navigation.tsx?raw";
import ButtonChoiceDemo from "./button/choice";
import ButtonChoiceDemoSource from "./button/choice.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

const buttonApi = [
  {
    name: "variant",
    description: "视觉形态",
    type: '"solid" | "outline" | "ghost" | "link" | "text" | "dashed"',
    defaultValue: '"outline"',
  },
  {
    name: "color",
    description: "语义色",
    type: '"default" | "primary" | "success" | "warning" | "error" | "info"',
    defaultValue: '"default"',
  },
  {
    name: "size",
    description: "按钮尺寸",
    type: '"small" | "middle" | "large"',
    defaultValue: '"middle"',
  },
  {
    name: "loading",
    description: "显示加载状态并禁止重复操作",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "loadingText", description: "加载状态文案", type: "ReactNode" },
  {
    name: "icon",
    description: "按钮图标；作为装饰隐藏于辅助技术",
    type: "ReactNode",
  },
  {
    name: "iconPlacement",
    description: "图标逻辑位置",
    type: '"start" | "end"',
    defaultValue: '"start"',
  },
  {
    name: "shape",
    description: "按钮形状",
    type: '"default" | "round" | "circle"',
    defaultValue: '"default"',
  },
  {
    name: "block",
    description: "撑满父容器宽度",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "ref", description: "原生 button ref", type: "Ref<HTMLButtonElement>" },
  {
    name: "disabled",
    description: "禁用操作",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "type",
    description: "原生按钮类型",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
  },
  {
    name: "onClick",
    description: "原生点击回调；disabled/loading 时不会触发",
    type: "MouseEventHandler<HTMLButtonElement>",
  },
];

const buttonLinkApi = [
  {
    name: "to",
    description: "路由目标；由 NavigationProvider 的 link adapter 消费",
    type: "string",
  },
  { name: "href", description: "默认 anchor 模式的链接目标", type: "string" },
  {
    name: "variant",
    description: "与 Button 相同的视觉形态",
    type: "ButtonVariant",
    defaultValue: '"link"',
  },
  {
    name: "color",
    description: "语义色",
    type: "ButtonColor",
    defaultValue: '"default"',
  },
  {
    name: "size",
    description: "链接按钮尺寸",
    type: "ButtonSize",
    defaultValue: '"middle"',
  },
  { name: "icon", description: "链接图标", type: "ReactNode" },
  {
    name: "iconPlacement",
    description: "图标逻辑位置",
    type: "ButtonIconPlacement",
    defaultValue: '"start"',
  },
  {
    name: "shape",
    description: "链接按钮形状",
    type: "ButtonShape",
    defaultValue: '"default"',
  },
  {
    name: "disabled",
    description: "阻止导航并移出 Tab 顺序",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "loading",
    description: "显示加载状态并阻止导航",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "loadingText", description: "加载状态文案", type: "ReactNode" },
  {
    name: "block",
    description: "撑满父容器宽度",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "ref",
    description: "链接 adapter ref",
    type: "Ref<HTMLAnchorElement>",
  },
  {
    name: "target",
    description: "原生链接 target",
    type: "HTMLAttributeAnchorTarget",
  },
  { name: "rel", description: "原生链接 rel", type: "string" },
  {
    name: "onClick",
    description: "链接点击回调；disabled/loading 时不会触发",
    type: "MouseEventHandler<HTMLAnchorElement>",
  },
];

export const buttonDocuments: Record<string, ComponentDocument> = {
  button: {
    title: "Button 按钮",
    description:
      "Button family 区分操作与导航：Button 触发动作，ButtonLink / IconButtonLink 保留真实链接语义，ChoiceButton 表达二态选择，NavigationProvider 负责路由适配。所有 Preview 与 Code 来自同一个可执行示例文件。",
    code: publicSource(ButtonTypesDemoSource),
    render: () => <ButtonTypesDemo />,
    demos: [
      {
        title: "尺寸、语义状态与布局",
        code: publicSource(ButtonStateDemoSource),
        render: () => <ButtonStateDemo />,
      },
      {
        title: "IconButton 与 IconButtonLink",
        description:
          "纯图标操作必须提供 label；导航版本仍渲染真实链接且不产生空文本节点。",
        code: publicSource(ButtonIconFamilyDemoSource),
        render: () => <ButtonIconFamilyDemo />,
      },
      {
        title: "真实链接与路由适配",
        description:
          "页面导航使用 ButtonLink；NavigationProvider 只注入 link adapter，不承载应用状态。",
        code: publicSource(ButtonNavigationDemoSource),
        render: () => <ButtonNavigationDemo />,
      },
      {
        title: "ChoiceButton 二态选择",
        description: "selected 映射 aria-pressed；选择状态仍由业务持有。",
        code: publicSource(ButtonChoiceDemoSource),
        render: () => <ButtonChoiceDemo />,
      },
    ],
    api: buttonApi,
    apiSections: [
      {
        title: "ButtonLink API",
        description: "其余原生 anchor 属性继续透传。",
        rows: buttonLinkApi,
      },
      {
        title: "IconButton API",
        rows: [
          {
            name: "label",
            description: "必填可访问名称，同时作为 title",
            type: "string",
          },
          { name: "icon", description: "纯图标内容", type: "ReactNode" },
          {
            name: "...ButtonProps",
            description: "除 children/icon 外继承 Button 能力",
            type: 'Omit<ButtonProps, "children" | "icon">',
          },
        ],
      },
      {
        title: "IconButtonLink API",
        rows: [
          {
            name: "label",
            description: "必填可访问名称，同时作为 title",
            type: "string",
          },
          { name: "icon", description: "纯图标链接内容", type: "ReactNode" },
          {
            name: "...ButtonLinkProps",
            description: "继承 ButtonLink 导航能力",
            type: "ButtonLinkProps",
          },
        ],
      },
      {
        title: "ChoiceButton API",
        rows: [
          {
            name: "selected",
            description: "选中状态，映射 aria-pressed",
            type: "boolean",
            defaultValue: "false",
          },
          {
            name: "...ButtonProps",
            description: "继承 Button 操作能力",
            type: "ButtonProps",
          },
        ],
      },
      {
        title: "NavigationProvider API",
        rows: [
          {
            name: "link",
            description: "接收 to 的路由 Link adapter",
            type: "ComponentType<LinkAdapterProps>",
          },
          {
            name: "children",
            description: "需要共享路由 adapter 的子树",
            type: "ReactNode",
          },
        ],
      },
    ],
  },
};
