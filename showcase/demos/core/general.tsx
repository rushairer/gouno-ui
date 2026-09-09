import { LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, Icon, Kbd, Space } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import CardExample from "./card/card-0";
import CardExampleSource from "./card/card-0.tsx?raw";

export const generalDocuments: Record<string, ComponentDocument> = {
  icon: {
    title: "Icon 图标",
    description: "统一图标尺寸、旋转、加载动画和无障碍标签。",
    code: '<Icon icon={<LoaderCircle />} spin label="Loading" />',
    render: () => (
      <Space>
        <Icon icon={<LoaderCircle />} />
        <Icon icon={<LoaderCircle />} spin label="Loading" />
        <Icon icon={<LoaderCircle />} rotate={45} />
      </Space>
    ),
  },
  kbd: {
    title: "Kbd 键盘按键",
    description: "表达键盘快捷键，宿主为原生 kbd。",
    code: '<Space><Kbd>⌘</Kbd><Kbd>K</Kbd></Space>',
    render: () => (
      <Space>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Space>
    ),
    api: [
      { name: "children", description: "按键标签", type: "ReactNode" },
      { name: "className", description: "kbd 样式类", type: "string" },
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
