import type { ApiRow } from "../../components/api-table";
import type { ComponentDocument } from "../../components/component-page";
import TypographyExample from "./typography/typography-0";
import TypographyExampleSource from "./typography/typography-0.tsx?raw";
import TypographySemanticsExample from "./typography/typography-1";
import TypographySemanticsExampleSource from "./typography/typography-1.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

const headingApi: ApiRow[] = [
  {
    name: "level",
    description: "标题语义级别，同时选择 h1-h6 宿主。",
    type: "1 | 2 | 3 | 4 | 5 | 6",
    defaultValue: "2",
  },
  { name: "children", description: "标题内容。", type: "ReactNode" },
  { name: "className", description: "扩展 canonical 标题 token。", type: "string" },
  {
    name: "...heading props",
    description: "透传原生 heading HTML 属性，包括 id、data-*、aria-* 与事件。",
    type: "HTMLAttributes<HTMLHeadingElement>",
  },
];

const textApi: ApiRow[] = [
  {
    name: "as",
    description: "宿主元素或组件；只改变语义，不自动改变 size/tone。",
    type: "ElementType",
    defaultValue: '"p"',
  },
  {
    name: "size",
    description: "正文尺寸 token。",
    type: '"xs" | "sm" | "md" | "lg"',
    defaultValue: '"md"',
  },
  {
    name: "tone",
    description: "文本语义色调。",
    type: '"default" | "muted" | "danger" | "success"',
    defaultValue: '"default"',
  },
  { name: "children", description: "文本内容。", type: "ReactNode" },
  { name: "className", description: "扩展 canonical 文本 token。", type: "string" },
  {
    name: "...element props",
    description: "透传通用 HTML 属性，包括 id、data-*、aria-* 与事件。",
    type: "HTMLAttributes<HTMLElement>",
  },
];

const typographyApi: ApiRow[] = [
  {
    name: "as",
    description: "基础文字宿主；适合不需要 Heading/Text 语义配置的轻量场景。",
    type: "ElementType",
    defaultValue: '"p"',
  },
  { name: "children", description: "文字内容。", type: "ReactNode" },
  { name: "className", description: "扩展基础 text-sm/text-foreground 样式。", type: "string" },
  {
    name: "...element props",
    description: "透传通用 HTML 属性。",
    type: "HTMLAttributes<HTMLElement>",
  },
];

export const typographyDocuments: Record<string, ComponentDocument> = {
  typography: {
    title: "Typography 排版",
    description:
      "Heading、Text 与 Typography 共同定义产品文字的语义宿主、尺寸和色调。Heading 保持真实 h1-h6 层级；Text 的 as 只改变宿主语义；Typography 是最轻量的基础文字原语。",
    code: publicSource(TypographyExampleSource),
    render: () => <TypographyExample />,
    demos: [
      {
        title: "语义宿主与原生属性",
        description:
          "同一份源码验证 Heading 层级、Text 的 as/size/tone，以及 Typography 轻量宿主；Preview 与 Code 不维护第二套 JSX。",
        code: publicSource(TypographySemanticsExampleSource),
        render: () => <TypographySemanticsExample />,
      },
    ],
    apiSections: [
      { title: "Heading API", rows: headingApi },
      { title: "Text API", rows: textApi },
      { title: "Typography API", rows: typographyApi },
    ],
  },
};
