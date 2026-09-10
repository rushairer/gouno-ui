import type { ComponentDocument } from "../../components/component-page";
import AvatarDemo from "./avatar/avatar-0";
import AvatarDemoSource from "./avatar/avatar-0.tsx?raw";
import { dataEntryDocuments } from "./data-entry";
import SearchFieldDemo from "./input/search-field";
import SearchFieldDemoSource from "./input/search-field.tsx?raw";
import { generalDocuments } from "./general";
import { layoutDocuments } from "./layout";
import { selectionControlDocuments } from "./selection-controls";
import CheckboxFieldDemo from "./selection-controls/checkbox-field";
import CheckboxFieldDemoSource from "./selection-controls/checkbox-field.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const surfaceReviewDocuments: Record<string, ComponentDocument> = {
  input: {
    ...dataEntryDocuments.input,
    demos: [
      ...(dataEntryDocuments.input.demos ?? []),
      {
        title: "SearchField 搜索输入",
        description:
          "SearchField 复用 Input 合同，默认提供 decorative 搜索图标与 type=search；调用方仍可按原生表单需要覆盖 type，ref 指向真实 input。",
        code: canonicalCoreSource(SearchFieldDemoSource),
        render: () => <SearchFieldDemo />,
      },
    ],
    apiSections: [
      ...(dataEntryDocuments.input.apiSections ?? []),
      {
        title: "SearchField API",
        rows: [
          {
            name: "...InputProps",
            description: "复用 Input 的受控值、尺寸、状态与原生 input 属性。",
            type: "InputProps",
          },
          {
            name: "type",
            description: "未提供时为 search；可按原生表单需求显式覆盖。",
            type: "HTMLInputTypeAttribute",
            defaultValue: '"search"',
          },
          {
            name: "ref",
            description: "指向真实 input，而不是带搜索图标的包装节点。",
            type: "Ref<HTMLInputElement>",
          },
        ],
      },
    ],
  },
  checkbox: {
    ...selectionControlDocuments.checkbox,
    description:
      "基于原生 checkbox 的可访问选择控件，支持受控/非受控、禁用、表单提交和自动 label 关联；CheckboxField 负责需要自定义标签内容的组合 label，CheckboxGroup 提供 fieldset/legend 组级语义。",
    demos: [
      ...(selectionControlDocuments.checkbox.demos ?? []),
      {
        title: "CheckboxField 组合标签",
        description:
          "真实 Blog Admin 过滤器与编辑器会把 Checkbox 和自定义标签内容组合在同一个 label 中；CheckboxField 只拥有 label 布局和原生 label 属性。",
        code: canonicalCoreSource(CheckboxFieldDemoSource),
        render: () => <CheckboxFieldDemo />,
      },
    ],
    apiSections: [
      ...(selectionControlDocuments.checkbox.apiSections ?? []),
      {
        title: "CheckboxField API",
        rows: [
          {
            name: "children",
            description: "通常由无 label prop 的 Checkbox 与可见标签内容组成。",
            type: "ReactNode",
          },
          {
            name: "className",
            description: "扩展组合 label 的布局/文字样式。",
            type: "string",
          },
          {
            name: "...label props",
            description: "透传原生 label 属性和事件。",
            type: "LabelHTMLAttributes<HTMLLabelElement>",
          },
          {
            name: "ref",
            description: "指向真实 label 元素。",
            type: "Ref<HTMLLabelElement>",
          },
        ],
      },
    ],
  },
  avatar: {
    ...generalDocuments.avatar,
    description:
      "Avatar 是 compound root；AvatarImage 负责图片加载，AvatarFallback 在图片不可用时提供文字或图标回退。三个导出共同构成一个头像 family，而不是三个独立组件页面。",
    code: canonicalCoreSource(AvatarDemoSource),
    render: () => <AvatarDemo />,
    api: [
      {
        name: "size",
        description: "头像尺寸。",
        type: '"sm" | "default" | "lg"',
        defaultValue: '"default"',
      },
      {
        name: "children",
        description: "组合 AvatarImage / AvatarFallback。",
        type: "ReactNode",
      },
      {
        name: "className",
        description: "扩展 Avatar root 样式。",
        type: "string",
      },
      {
        name: "...root props",
        description: "透传 Radix Avatar root 支持的标准属性。",
        type: "ComponentProps<typeof AvatarPrimitive.Root>",
      },
    ],
    apiSections: [
      {
        title: "AvatarImage API",
        rows: [
          { name: "src", description: "头像图片地址。", type: "string" },
          { name: "alt", description: "图片替代文本。", type: "string" },
          { name: "className", description: "扩展图片样式。", type: "string" },
          {
            name: "...image props",
            description: "透传 Avatar Image 原生/primitive 属性。",
            type: "ComponentProps<typeof AvatarPrimitive.Image>",
          },
        ],
      },
      {
        title: "AvatarFallback API",
        rows: [
          { name: "children", description: "图片不可用时的回退内容。", type: "ReactNode" },
          { name: "delayMs", description: "延迟显示回退内容。", type: "number" },
          { name: "className", description: "扩展回退样式。", type: "string" },
        ],
      },
    ],
  },
  separator: {
    ...layoutDocuments.separator,
    description:
      "Separator 是 canonical 分隔原语，默认 decorative；历史 Divider 作为 established Core compatibility sibling 暂时保留，但新代码应使用 Separator。",
    api: [
      {
        name: "orientation",
        description: "分隔方向。",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
      },
      {
        name: "decorative",
        description: "是否仅作为视觉分隔；canonical Separator 默认不进入无障碍语义树。",
        type: "boolean",
        defaultValue: "true",
      },
      { name: "className", description: "扩展分隔线样式。", type: "string" },
    ],
    apiSections: [
      {
        title: "Divider compatibility API",
        rows: [
          {
            name: "orientation",
            description: "历史 Divider 的方向；保留兼容，不作为新代码首选。",
            type: '"horizontal" | "vertical"',
            defaultValue: '"horizontal"',
          },
          {
            name: "...div props",
            description: "透传 div/ARIA/data/event 属性；ref 指向真实 div。",
            type: "HTMLAttributes<HTMLDivElement>",
          },
        ],
      },
    ],
  },
};
