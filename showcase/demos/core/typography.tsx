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
    description: "标题语义级别，只选择 h1-h6 宿主；视觉层级由 variant 独立决定。",
    type: "1 | 2 | 3 | 4 | 5 | 6",
    defaultValue: "2",
  },
  {
    name: "variant",
    description: "视觉 Typography role；与 level 独立。未传时仅为兼容旧调用按 level 推导默认 role。",
    type: '"display" | "hero" | "page" | "task" | "section-lg" | "section" | "subsection" | "compact" | "label" | "micro"',
    defaultValue: "按 level 兼容推导",
  },
  { name: "children", description: "标题内容。", type: "ReactNode" },
  { name: "className", description: "扩展布局、颜色等非层级样式；canonical 产品不得用它改写字号、字重、行高或 tracking。", type: "string" },
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
  {
    name: "weight",
    description: "正文强调权重；使用 Typography token，不通过 className 写 font-*。",
    type: '"regular" | "medium" | "semibold"',
    defaultValue: "继承宿主语义",
  },
  {
    name: "family",
    description: "字体族语义；代码/标识使用 mono，普通正文保持 sans/继承。",
    type: '"sans" | "mono"',
    defaultValue: "继承",
  },
  {
    name: "leading",
    description: "正文行高节奏；relaxed 用于需要更高可读性的说明/长句。",
    type: '"default" | "relaxed"',
    defaultValue: '"default"',
  },
  { name: "children", description: "文本内容。", type: "ReactNode" },
  { name: "className", description: "仅扩展布局、颜色、measure、truncate 等非排版度量；canonical 产品不得用它改写字号、行高、字重或字体族。", type: "string" },
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
  { name: "className", description: "扩展兼容基础文字宿主；新产品文案优先使用 Heading/Text。", type: "string" },
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
      "Heading 将 HTML heading level 与视觉 Typography role 解耦；Text 通过 semantic body/caption scale 统一正文密度；Typography 仅保留为轻量兼容宿主，新产品优先使用 Heading/Text。",
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
