import type { ComponentDocument } from "../../components/component-page";
import AvatarDemo from "./avatar/avatar-0";
import AvatarDemoSource from "./avatar/avatar-0.tsx?raw";
import AvatarGroupDemo from "./avatar/avatar-1";
import AvatarGroupDemoSource from "./avatar/avatar-1.tsx?raw";
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
      "Avatar 使用 Gouno 统一 small/middle/large 尺寸语义，也接受显式像素尺寸；shape 控制圆形/方形。Image/Fallback/Badge/Group/GroupCount 组成同一 compound family，Group 的 max 只拥有可见槽位与溢出计数，不拥有业务成员逻辑。",
    code: canonicalCoreSource(AvatarDemoSource),
    render: () => <AvatarDemo />,
    demos: [
      {
        title: "头像组、溢出与状态 Badge",
        description:
          "AvatarGroup.max 把最后一个可见槽位留给溢出计数；overflowRender 只定制计数内容。Badge 的业务语义与 accessible name 继续由调用方提供。",
        code: canonicalCoreSource(AvatarGroupDemoSource),
        render: () => <AvatarGroupDemo />,
      },
    ],
    api: [
      { name: "size", description: "Gouno ControlSize 或显式像素；sm/default/lg 仅作为 0.2.x 兼容别名。", type: '"small" | "middle" | "large" | number | "sm" | "default" | "lg"', defaultValue: '"middle"' },
      { name: "shape", description: "头像几何形态。", type: '"circle" | "square"', defaultValue: '"circle"' },
      { name: "children", description: "组合 AvatarImage / AvatarFallback / AvatarBadge。", type: "ReactNode" },
      { name: "className", description: "扩展 Avatar root 样式。", type: "string" },
      { name: "ref", description: "指向真实 Avatar root。", type: "Ref<HTMLElement>" },
    ],
    apiSections: [
      {
        title: "AvatarGroup API",
        rows: [
          { name: "max", description: "最多显示的槽位数；发生溢出时最后一格显示计数。", type: "number" },
          { name: "overflowRender", description: "按 omittedCount 自定义溢出槽内容。", type: "(omittedCount: number) => ReactNode" },
          { name: "children", description: "Avatar 子项。", type: "ReactNode" },
          { name: "...div props", description: "透传标准 div/ARIA/data/event 属性。", type: "HTMLAttributes<HTMLDivElement>" },
          { name: "ref", description: "指向真实 AvatarGroup div。", type: "Ref<HTMLDivElement>" },
        ],
      },
      {
        title: "AvatarImage API",
        rows: [
          { name: "AvatarImage", description: "图片层；支持 src/alt 及标准 image primitive 属性，ref 指向真实 img。", type: "AvatarImageProps" },
        ],
      },
      {
        title: "AvatarFallback API",
        rows: [
          { name: "AvatarFallback", description: "图片不可用时的文字/图标回退；支持 delayMs。", type: "AvatarFallbackProps" },
        ],
      },
      {
        title: "AvatarBadge / AvatarGroupCount API",
        rows: [
          { name: "AvatarBadge", description: "头像角标视觉槽；业务状态与可访问名称由调用方提供。", type: "AvatarBadgeProps" },
          { name: "AvatarGroupCount", description: "手动组合头像组计数时使用；AvatarGroup.max 会自动使用同一视觉槽。", type: "AvatarGroupCountProps" },
        ],
      },
    ],
  },
  separator: {
    ...layoutDocuments.separator,
    description:
      "Separator 是 canonical 分隔组件；水平模式支持内容、位置和线型，垂直模式保持 line-only，默认 decorative。历史 Divider 作为 established Core compatibility sibling 暂时保留，但新代码应使用 Separator。",
    apiSections: [
      ...(layoutDocuments.separator.apiSections ?? []),
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
