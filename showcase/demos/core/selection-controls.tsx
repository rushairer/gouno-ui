import type { ApiRow } from "../../components/api-table";
import type { ComponentDocument } from "../../components/component-page";
import CheckboxDemo from "./selection-controls/checkbox";
import CheckboxDemoSource from "./selection-controls/checkbox.tsx?raw";
import CheckboxGroupDemo from "./selection-controls/checkbox-group";
import CheckboxGroupDemoSource from "./selection-controls/checkbox-group.tsx?raw";
import RadioDemo from "./selection-controls/radio";
import RadioDemoSource from "./selection-controls/radio.tsx?raw";
import SwitchDemo from "./selection-controls/switch";
import SwitchDemoSource from "./selection-controls/switch.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

const sharedCheckApi: ApiRow[] = [
  {
    name: "label",
    description: "可见标签；传入后与原生 input 建立关联。",
    type: "ReactNode",
  },
  { name: "checked", description: "受控选中状态。", type: "boolean" },
  {
    name: "defaultChecked",
    description: "非受控初始选中状态。",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "disabled",
    description: "禁用原生控件。",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "name",
    description: "原生表单字段名；Radio 使用相同 name 组成互斥组。",
    type: "string",
  },
  {
    name: "value",
    description: "原生表单提交值。",
    type: "string | number | readonly string[]",
  },
  {
    name: "onChange",
    description: "原生 change 事件。",
    type: "ChangeEventHandler<HTMLInputElement>",
  },
  {
    name: "id",
    description: "原生 input ID；未提供时自动生成以关联 label。",
    type: "string",
  },
  {
    name: "aria-label",
    description: "没有可见 label 时的可访问名称。",
    type: "string",
  },
];

const checkboxGroupApi: ApiRow[] = [
  {
    name: "label",
    description: "组级可见标题，渲染为 FieldLegend。",
    type: "string",
  },
  {
    name: "children",
    description: "组内 Checkbox 或其他选择控件。",
    type: "ReactNode",
  },
];

export const selectionControlDocuments: Record<string, ComponentDocument> = {
  checkbox: {
    title: "Checkbox 多选框",
    description:
      "基于原生 checkbox 的可访问选择控件，支持受控/非受控、禁用、表单提交和自动 label 关联；CheckboxGroup 提供 fieldset/legend 组级语义。",
    code: canonicalCoreSource(CheckboxDemoSource),
    render: () => <CheckboxDemo />,
    demos: [
      {
        title: "CheckboxGroup 组级语义",
        description:
          "Preview 与 Code 来自同一个源码文件；相同 name 的 checkbox 会按原生 FormData 语义提交多值。",
        code: canonicalCoreSource(CheckboxGroupDemoSource),
        render: () => <CheckboxGroupDemo />,
      },
    ],
    api: [
      ...sharedCheckApi,
      {
        name: "className",
        description: "附加到原生 checkbox input。",
        type: "string",
      },
    ],
    apiSections: [{ title: "CheckboxGroup API", rows: checkboxGroupApi }],
  },
  radio: {
    title: "Radio 单选框",
    description:
      "基于原生 radio 的互斥选择控件；相同 name 组成一组，业务负责提供组级 fieldset/legend 语义。",
    code: canonicalCoreSource(RadioDemoSource),
    render: () => <RadioDemo />,
    api: [
      ...sharedCheckApi,
      {
        name: "className",
        description: "附加到原生 radio input。",
        type: "string",
      },
    ],
  },
  switch: {
    title: "Switch 开关",
    description:
      "即时切换布尔状态。底层使用原生 checkbox + role=switch，保留键盘、表单与 disabled 行为。",
    code: canonicalCoreSource(SwitchDemoSource),
    render: () => <SwitchDemo />,
    api: [
      ...sharedCheckApi,
      {
        name: "className",
        description: "附加到 Switch 的外层 label，用于布局扩展。",
        type: "string",
      },
    ],
  },
};
