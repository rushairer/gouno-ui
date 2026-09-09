import type { ApiRow } from "../../components/api-table";
import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import FormAnatomyDemo from "./form/anatomy";
import FormAnatomyDemoSource from "./form/anatomy.tsx?raw";
import FieldAnatomyDemo from "./form/field-anatomy";
import FieldAnatomyDemoSource from "./form/field-anatomy.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source
    .replaceAll("../../../../src/core", "@gouno/ui/core")
    .replaceAll("../../../../src/patterns", "@gouno/ui/patterns")
    .trim();

const fieldApi: ApiRow[] = [
  { name: "label", description: "字段可见标签。", type: "ReactNode" },
  { name: "children", description: "字段控件；单个 ReactElement 会自动接收关联属性。", type: "ReactNode" },
  { name: "id", description: "显式控件 ID；未提供时优先复用 child.id，否则自动生成。", type: "string" },
  { name: "hint", description: "辅助说明，并自动加入 aria-describedby。", type: "ReactNode" },
  { name: "error", description: "错误内容；写入 role=alert、aria-invalid 与 aria-describedby。", type: "ReactNode" },
  { name: "required", description: "显示必填标记并在子控件未自行指定时写入 required。", type: "boolean", defaultValue: "false" },
  { name: "hideLabel", description: "视觉隐藏标签但保留可访问名称。", type: "boolean", defaultValue: "false" },
  { name: "className", description: "扩展字段根容器。", type: "string" },
];

const fieldGroupApi: ApiRow[] = [
  { name: "children", description: "一组相关字段或低层 field anatomy。", type: "ReactNode" },
  { name: "className", description: "扩展标准字段组节奏。", type: "string" },
  { name: "...div props", description: "透传原生 div 属性。", type: "ComponentProps<'div'>" },
];

const fieldSetApi: ApiRow[] = [
  { name: "children", description: "fieldset 内容。", type: "ReactNode" },
  { name: "className", description: "扩展 fieldset 布局。", type: "string" },
  { name: "...fieldset props", description: "透传原生 fieldset 属性。", type: "ComponentProps<'fieldset'>" },
];

const fieldLegendApi: ApiRow[] = [
  { name: "variant", description: "legend 的标题层级密度。", type: '"legend" | "label"', defaultValue: '"legend"' },
  { name: "children", description: "fieldset 组标题。", type: "ReactNode" },
  { name: "className", description: "扩展 legend 样式。", type: "string" },
  { name: "...legend props", description: "透传原生 legend 属性。", type: "ComponentProps<'legend'>" },
];

const fieldLabelApi: ApiRow[] = [
  { name: "htmlFor", description: "关联目标控件 ID。", type: "string" },
  { name: "children", description: "标签内容。", type: "ReactNode" },
  { name: "className", description: "扩展标签布局。", type: "string" },
  { name: "...label props", description: "透传底层 Label/label 属性。", type: "ComponentProps<typeof Label>" },
];

const formLayoutApi: ApiRow[] = [
  { name: "children", description: "表单结构内容。", type: "ReactNode" },
  { name: "className", description: "扩展标准纵向表单节奏。", type: "string" },
  { name: "...form props", description: "透传原生 form 属性；不附加 Form 的 onFinish 语义。", type: "FormHTMLAttributes<HTMLFormElement>" },
];

const formGridApi: ApiRow[] = [
  { name: "columns", description: "响应式字段列数。", type: "1 | 2 | 3 | 4 | 5", defaultValue: "2" },
  { name: "children", description: "网格中的字段。", type: "ReactNode" },
  { name: "className", description: "扩展标准网格。", type: "string" },
  { name: "...div props", description: "透传原生 div 属性。", type: "HTMLAttributes<HTMLDivElement>" },
];

const formActionsApi: ApiRow[] = [
  { name: "children", description: "表单尾部操作。", type: "ReactNode" },
  { name: "className", description: "扩展右对齐、可换行的动作区。", type: "string" },
  { name: "...div props", description: "透传原生 div 属性。", type: "HTMLAttributes<HTMLDivElement>" },
];

const overlayFormApi: ApiRow[] = [
  { name: "actions", description: "覆盖层表单的底部操作。", type: "ReactNode" },
  { name: "actionClassName", description: "只扩展内置 FormActions。", type: "string" },
  { name: "children", description: "覆盖层表单字段。", type: "ReactNode" },
  { name: "className", description: "扩展 FormLayout 根 form。", type: "string" },
  { name: "...form props", description: "透传原生 form 属性。", type: "FormHTMLAttributes<HTMLFormElement>" },
];

const baseFormDocument = dataEntryDocuments.form;

export const formDocuments: Record<string, ComponentDocument> = {
  form: {
    ...baseFormDocument,
    description:
      "字段关联、校验结果、提交值、布局、Field anatomy 与覆盖层表单组合。Form family 同时拥有高层 FormField 和低层 FieldSet/Legend/Group/Label 结构。",
    demos: [
      ...(baseFormDocument.demos ?? []),
      {
        title: "Form composition helpers",
        description:
          "同一示例覆盖 FormField、FormGrid、FormActions 与 OverlayForm；Preview 与 Code 来自同一个源码文件。",
        code: canonicalCoreSource(FormAnatomyDemoSource),
        render: () => <FormAnatomyDemo />,
      },
      {
        title: "Low-level Field anatomy",
        description:
          "当产品需要原生 fieldset/legend 语义而不需要 FormField 自动克隆时，直接组合 FieldSet、FieldLegend、FieldGroup 与 FieldLabel。",
        code: canonicalCoreSource(FieldAnatomyDemoSource),
        render: () => <FieldAnatomyDemo />,
      },
    ],
    apiSections: [
      { title: "Field / FormField API", rows: fieldApi },
      { title: "FieldGroup API", rows: fieldGroupApi },
      { title: "FieldSet API", rows: fieldSetApi },
      { title: "FieldLegend API", rows: fieldLegendApi },
      { title: "FieldLabel API", rows: fieldLabelApi },
      { title: "FormLayout API", rows: formLayoutApi },
      { title: "FormGrid API", rows: formGridApi },
      { title: "FormActions API", rows: formActionsApi },
      { title: "OverlayForm API", rows: overlayFormApi },
    ],
  },
};
