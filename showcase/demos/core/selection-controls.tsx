import { useState } from "react";
import { Checkbox, Radio, Space, Switch, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

const sharedCheckApi = [
  { name: "label", description: "可见标签；传入后与原生 input 建立关联", type: "ReactNode" },
  { name: "checked", description: "受控选中状态", type: "boolean" },
  { name: "defaultChecked", description: "非受控初始选中状态", type: "boolean", defaultValue: "false" },
  { name: "disabled", description: "禁用原生控件", type: "boolean", defaultValue: "false" },
  { name: "name", description: "原生表单字段名；Radio 使用相同 name 组成互斥组", type: "string" },
  { name: "value", description: "原生表单提交值", type: "string | number | readonly string[]" },
  { name: "onChange", description: "原生 change 事件", type: "ChangeEventHandler<HTMLInputElement>" },
  { name: "id", description: "原生 input ID；未提供时自动生成以关联 label", type: "string" },
  { name: "aria-label", description: "没有可见 label 时的可访问名称", type: "string" },
] as const;

function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Space orientation="vertical" align="start">
      <Checkbox
        label="接受条款"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <Checkbox label="已锁定选项" disabled defaultChecked />
      <Text size="sm" tone="muted" aria-live="polite">
        当前：{checked ? "已接受" : "未接受"}
      </Text>
    </Space>
  );
}

function RadioDemo() {
  const [plan, setPlan] = useState("basic");
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">套餐</legend>
      <Space orientation="vertical" align="start">
        <Radio
          name="plan"
          value="basic"
          label="基础版"
          checked={plan === "basic"}
          onChange={(event) => event.currentTarget.checked && setPlan("basic")}
        />
        <Radio
          name="plan"
          value="pro"
          label="专业版"
          checked={plan === "pro"}
          onChange={(event) => event.currentTarget.checked && setPlan("pro")}
        />
        <Radio name="plan" value="legacy" label="旧套餐" disabled />
        <Text size="sm" tone="muted" aria-live="polite">
          当前：{plan === "basic" ? "基础版" : "专业版"}
        </Text>
      </Space>
    </fieldset>
  );
}

function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Space orientation="vertical" align="start">
      <Switch
        label="启用通知"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <Switch label="系统策略" disabled defaultChecked />
      <Text size="sm" tone="muted" aria-live="polite">
        通知：{enabled ? "开启" : "关闭"}
      </Text>
    </Space>
  );
}

export const selectionControlDocuments: Record<string, ComponentDocument> = {
  checkbox: {
    title: "Checkbox 多选框",
    description: "基于原生 checkbox 的可访问选择控件，支持受控/非受控、禁用、表单提交和自动 label 关联。",
    code: `function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label="接受条款"
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
}`,
    render: () => <CheckboxDemo />,
    api: [
      ...sharedCheckApi,
      { name: "className", description: "附加到原生 checkbox input", type: "string" },
    ],
  },
  radio: {
    title: "Radio 单选框",
    description: "基于原生 radio 的互斥选择控件；相同 name 组成一组，业务负责提供组级 fieldset/legend 语义。",
    code: `function RadioDemo() {
  const [plan, setPlan] = useState("basic");
  return (
    <fieldset>
      <legend>套餐</legend>
      <Radio name="plan" value="basic" label="基础版" checked={plan === "basic"} onChange={() => setPlan("basic")} />
      <Radio name="plan" value="pro" label="专业版" checked={plan === "pro"} onChange={() => setPlan("pro")} />
    </fieldset>
  );
}`,
    render: () => <RadioDemo />,
    api: [
      ...sharedCheckApi,
      { name: "className", description: "附加到原生 radio input", type: "string" },
    ],
  },
  switch: {
    title: "Switch 开关",
    description: "即时切换布尔状态。底层使用原生 checkbox + role=switch，保留键盘、表单与 disabled 行为。",
    code: `function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Switch
      label="启用通知"
      checked={enabled}
      onChange={(event) => setEnabled(event.currentTarget.checked)}
    />
  );
}`,
    render: () => <SwitchDemo />,
    api: [
      ...sharedCheckApi,
      { name: "className", description: "附加到 Switch 的外层 label，用于布局扩展", type: "string" },
    ],
  },
};
