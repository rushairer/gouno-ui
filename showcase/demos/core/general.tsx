import { Avatar, AvatarFallback } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import CardExample from "./card/card-0";
import CardExampleSource from "./card/card-0.tsx?raw";
import IconDemo from "./icon/icon-0";
import IconDemoSource from "./icon/icon-0.tsx?raw";
import KbdDemo from "./kbd/kbd-0";
import KbdDemoSource from "./kbd/kbd-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const generalDocuments: Record<string, ComponentDocument> = {
  icon: {
    title: "Icon 图标",
    description:
      "统一 SVG 图标的语义尺寸、旋转、加载动画和标准 ARIA。未命名图标默认 decorative；提供 aria-label 或 aria-labelledby 后自动采用 img 语义。",
    code: canonicalCoreSource(IconDemoSource),
    render: () => <IconDemo />,
    api: [
      {
        name: "icon",
        description: "要渲染的 SVG React 元素；Icon 不拥有具体图标集合。",
        type: "ReactElement<SVGProps<SVGSVGElement>>",
      },
      {
        name: "size",
        description: "语义尺寸或显式像素尺寸；数字会同时约束宽高。",
        type: '"small" | "middle" | "large" | number',
        defaultValue: '"middle"',
      },
      {
        name: "spin",
        description: "启用 canonical loading rotation animation。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "rotate",
        description: "顺时针旋转角度；与图标及调用方已有 transform 合并。",
        type: "number",
      },
      {
        name: "aria-label",
        description: "为有独立含义的图标提供标准 accessible name；设置后默认 role=img。",
        type: "string",
      },
      {
        name: "aria-labelledby",
        description: "通过外部可见文本为图标命名。",
        type: "string",
      },
      {
        name: "aria-hidden",
        description: "未命名图标默认 true；调用方可显式覆盖标准 ARIA 属性。",
        type: "boolean | 'true' | 'false'",
      },
      {
        name: "...svg props",
        description: "透传标准 SVG 属性、事件、data-* 与 ARIA 属性。",
        type: "Omit<SVGProps<SVGSVGElement>, 'children'>",
      },
      {
        name: "ref",
        description: "指向最终 SVG 元素。",
        type: "Ref<SVGSVGElement>",
      },
    ],
  },
  kbd: {
    title: "Kbd 键盘按键",
    description:
      "原生 kbd 的轻量语义包装。组件只负责按键视觉和 DOM/ref 契约；快捷键组合、连接符和平台文案全部由调用方显式组合。",
    code: canonicalCoreSource(KbdDemoSource),
    render: () => <KbdDemo />,
    api: [
      { name: "children", description: "按键标签或组合内容。", type: "ReactNode" },
      { name: "className", description: "扩展 kbd 样式。", type: "string" },
      {
        name: "...kbd props",
        description: "透传原生 kbd 可用的 HTML/ARIA/data/event 属性。",
        type: "HTMLAttributes<HTMLElement>",
      },
      {
        name: "ref",
        description: "指向真实 kbd 元素。",
        type: "Ref<HTMLElement>",
      },
    ],
  },
  card: {
    title: "Card 卡片",
    description: "用 header、content、footer 组合内容分组；间距在 Card 内部统一管理。",
    code: CardExampleSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <CardExample />,
    api: [
      {
        name: "as",
        description: "Card 宿主元素；交互行为应使用语义元素",
        type: "ElementType",
        defaultValue: '"div"',
      },
      {
        name: "variant",
        description: "视觉形态",
        type: '"default" | "subtle" | "elevated"',
        defaultValue: '"default"',
      },
      {
        name: "padding",
        description: "内边距 token",
        type: '"none" | "sm" | "base" | "lg"',
        defaultValue: '"base"',
      },
      {
        name: "interactive",
        description: "增加悬停提示样式，不自动提供键盘动作",
        type: "boolean",
        defaultValue: "false",
      },
      { name: "className", description: "Card 主体样式类", type: "string" },
    ],
    apiSections: [
      {
        title: "CardHeader API",
        rows: [
          {
            name: "title",
            description: "标题内容；0 和空字符串均会渲染",
            type: "ReactNode",
          },
          {
            name: "description",
            description: "说明内容；0 和空字符串均会渲染",
            type: "ReactNode",
          },
          { name: "action", description: "右侧操作槽", type: "ReactNode" },
          {
            name: "children",
            description: "自定义 header 内容；设置后优先于 title/description/action",
            type: "ReactNode",
          },
        ],
      },
      {
        title: "CardTitle API",
        rows: [
          { name: "children", description: "标题内容", type: "ReactNode" },
          { name: "className", description: "h3 样式类", type: "string" },
        ],
      },
      {
        title: "CardDescription API",
        rows: [
          { name: "children", description: "说明内容", type: "ReactNode" },
          { name: "className", description: "p 样式类", type: "string" },
        ],
      },
      {
        title: "CardContent API",
        rows: [
          {
            name: "flush",
            description: "兼容字段；组件不自行添加内边距",
            type: "boolean",
          },
          { name: "children", description: "正文内容", type: "ReactNode" },
          { name: "className", description: "正文样式类", type: "string" },
        ],
      },
      {
        title: "CardFooter API",
        rows: [
          { name: "children", description: "底部内容", type: "ReactNode" },
          { name: "className", description: "footer 样式类", type: "string" },
        ],
      },
    ],
  },
  avatar: {
    title: "Avatar 头像",
    description: "图片头像和文字回退。",
    code: '<Avatar><AvatarFallback>GU</AvatarFallback></Avatar>',
    render: () => (
      <Avatar>
        <AvatarFallback>GU</AvatarFallback>
      </Avatar>
    ),
  },
};
