import Example1 from "./input/input-0";
import Example1Source from "./input/input-0.tsx?raw";
import Example2 from "./input/input-1";
import Example2Source from "./input/input-1.tsx?raw";
import Example3 from "./input/input-2";
import Example3Source from "./input/input-2.tsx?raw";
import Example4 from "./textarea/textarea-0";
import Example4Source from "./textarea/textarea-0.tsx?raw";
import Example5 from "./textarea/textarea-1";
import Example5Source from "./textarea/textarea-1.tsx?raw";
import Example6 from "./textarea/textarea-2";
import Example6Source from "./textarea/textarea-2.tsx?raw";
import Example7 from "./select/select-0";
import Example7Source from "./select/select-0.tsx?raw";
import Example8 from "./select/select-1";
import Example8Source from "./select/select-1.tsx?raw";
import Example9 from "./select/select-2";
import Example9Source from "./select/select-2.tsx?raw";
import Example10 from "./input-number/input-number-0";
import Example10Source from "./input-number/input-number-0.tsx?raw";
import Example11 from "./input-number/input-number-1";
import Example11Source from "./input-number/input-number-1.tsx?raw";
import Example12 from "./date-picker/date-picker-0";
import Example12Source from "./date-picker/date-picker-0.tsx?raw";
import Example13 from "./date-picker/date-picker-1";
import Example13Source from "./date-picker/date-picker-1.tsx?raw";
import Example14 from "./form/form-0";
import Example14Source from "./form/form-0.tsx?raw";
import Example15 from "./form/form-1";
import Example15Source from "./form/form-1.tsx?raw";
import Example16 from "./upload/upload-0";
import Example16Source from "./upload/upload-0.tsx?raw";
import Example17 from "./upload/upload-1";
import Example17Source from "./upload/upload-1.tsx?raw";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  DateRangePicker,
  Field,
  Form,
  Input,
  InputNumber,
  InputOTP,
  Mentions,
  Radio,
  Rate,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  Text,
  Textarea,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

const api = {
  input: [
    { name: "value", description: "受控文本值", type: "string" },
    { name: "defaultValue", description: "非受控初始文本", type: "string" },
    {
      name: "size",
      description: "控件尺寸",
      type: '"small" | "middle" | "large"',
      defaultValue: '"middle"',
    },
    { name: "prefix", description: "前置插槽", type: "ReactNode" },
    { name: "suffix", description: "后置插槽", type: "ReactNode" },
    {
      name: "allowClear",
      description: "显示清除按钮",
      type: "boolean",
      defaultValue: "false",
    },
    { name: "onClear", description: "清除按钮回调", type: "() => void" },
    { name: "status", description: "校验状态", type: '"error" | "warning"' },
    { name: "disabled", description: "禁用输入", type: "boolean" },
    { name: "readOnly", description: "只读输入", type: "boolean" },
    { name: "name", description: "原生表单字段名", type: "string" },
    { name: "id", description: "原生元素 ID", type: "string" },
    { name: "placeholder", description: "占位提示", type: "string" },
    {
      name: "onChange",
      description: "原生值变化事件",
      type: "ChangeEventHandler<HTMLInputElement>",
    },
    { name: "ref", description: "输入元素引用", type: "Ref<HTMLInputElement>" },
    { name: "className", description: "附加类名", type: "string" },
  ],
  textarea: [
    { name: "value", description: "受控文本值", type: "string" },
    { name: "defaultValue", description: "非受控初始文本", type: "string" },
    {
      name: "showCount",
      description: "显示字符计数",
      type: "boolean",
      defaultValue: "false",
    },
    { name: "maxLength", description: "最大字符数", type: "number" },
    {
      name: "size",
      description: "控件尺寸",
      type: '"small" | "middle" | "large"',
    },
    { name: "status", description: "校验状态", type: '"error" | "warning"' },
    { name: "rows", description: "可见行数", type: "number" },
    { name: "cols", description: "可见列数", type: "number" },
    { name: "disabled", description: "禁用输入", type: "boolean" },
    { name: "readOnly", description: "只读输入", type: "boolean" },
    { name: "name", description: "原生表单字段名", type: "string" },
    { name: "id", description: "原生元素 ID", type: "string" },
    { name: "placeholder", description: "占位提示", type: "string" },
    {
      name: "onChange",
      description: "原生值变化事件",
      type: "ChangeEventHandler<HTMLTextAreaElement>",
    },
    {
      name: "ref",
      description: "文本域引用",
      type: "Ref<HTMLTextAreaElement>",
    },
    { name: "className", description: "附加类名", type: "string" },
  ],
  select: [
    {
      name: "children",
      description: "option/optgroup 组合",
      type: "ReactNode",
    },
    { name: "value", description: "受控选项值", type: "string | string[]" },
    {
      name: "defaultValue",
      description: "非受控初始选项",
      type: "string | string[]",
    },
    { name: "placeholder", description: "未选择时的提示", type: "string" },
    {
      name: "size",
      description: "控件尺寸",
      type: '"small" | "middle" | "large"',
    },
    { name: "status", description: "校验状态", type: '"error" | "warning"' },
    { name: "loading", description: "加载中并禁用选择", type: "boolean" },
    { name: "disabled", description: "禁用选择", type: "boolean" },
    { name: "multiple", description: "允许多选", type: "boolean" },
    { name: "name", description: "原生表单字段名", type: "string" },
    { name: "id", description: "原生元素 ID", type: "string" },
    { name: "required", description: "原生必填约束", type: "boolean" },
    {
      name: "onChange",
      description: "原生值变化事件",
      type: "ChangeEventHandler<HTMLSelectElement>",
    },
    {
      name: "ref",
      description: "选择元素引用",
      type: "Ref<HTMLSelectElement>",
    },
    { name: "className", description: "附加类名", type: "string" },
  ],
  form: [
    {
      name: "children",
      description: "Field、控件和操作按钮",
      type: "ReactNode",
    },
    {
      name: "layout",
      description: "表单布局",
      type: '"vertical" | "horizontal" | "inline"',
      defaultValue: '"vertical"',
    },
    {
      name: "disabled",
      description: "整体禁用字段",
      type: "boolean",
      defaultValue: "false",
    },
    {
      name: "loading",
      description: "提交中状态",
      type: "boolean",
      defaultValue: "false",
    },
    {
      name: "onFinish",
      description: "校验成功回调",
      type: "(formData, values) => void",
    },
    {
      name: "onFinishFailed",
      description: "校验失败回调",
      type: "(event) => void",
    },
    {
      name: "validateMessages",
      description: "原生校验消息模板",
      type: "Record<string, string>",
    },
    { name: "name", description: "原生表单名", type: "string" },
    { name: "method", description: "原生提交方法", type: "string" },
    { name: "action", description: "原生提交地址", type: "string" },
    { name: "noValidate", description: "禁用原生校验", type: "boolean" },
    { name: "className", description: "附加类名", type: "string" },
  ],
  "input-number": [
    { name: "value", description: "受控数值", type: "number | null" },
    {
      name: "defaultValue",
      description: "非受控初始数值",
      type: "number | null",
    },
    { name: "min", description: "最小值", type: "number" },
    { name: "max", description: "最大值", type: "number" },
    { name: "step", description: "步进值", type: "number" },
    { name: "precision", description: "小数精度", type: "number" },
    {
      name: "formatter",
      description: "显示格式化函数",
      type: "(value) => string",
    },
    { name: "parser", description: "输入解析函数", type: "(value) => number" },
    { name: "controls", description: "显示步进按钮", type: "boolean" },
    { name: "keyboard", description: "启用方向键步进", type: "boolean" },
    { name: "onStep", description: "步进回调", type: "(value, info) => void" },
  ],
  "date-picker": [
    { name: "value", description: "受控日期值", type: "string" },
    { name: "defaultValue", description: "非受控初始日期", type: "string" },
    { name: "min", description: "最早可选日期", type: "string" },
    { name: "max", description: "最晚可选日期", type: "string" },
    {
      name: "size",
      description: "控件尺寸",
      type: '"small" | "middle" | "large"',
    },
    { name: "status", description: "校验状态", type: '"error" | "warning"' },
    { name: "allowClear", description: "显示清除按钮", type: "boolean" },
    { name: "disabled", description: "禁用选择", type: "boolean" },
    { name: "readOnly", description: "只读日期", type: "boolean" },
    { name: "onChange", description: "日期变化回调", type: "(value) => void" },
    { name: "ref", description: "输入元素引用", type: "Ref<HTMLInputElement>" },
  ],
  upload: [
    { name: "files", description: "受控文件列表", type: "File[]" },
    { name: "defaultFiles", description: "非受控初始文件列表", type: "File[]" },
    {
      name: "onFiles",
      description: "文件列表变化回调",
      type: "(files) => void",
    },
    { name: "onRemove", description: "移除文件回调", type: "(file) => void" },
    { name: "accept", description: "允许的文件类型", type: "string" },
    { name: "multiple", description: "允许多选文件", type: "boolean" },
    { name: "maxCount", description: "最大文件数", type: "number" },
    { name: "maxSize", description: "单文件最大字节数", type: "number" },
    {
      name: "beforeSelect",
      description: "选择前校验",
      type: "(files) => boolean",
    },
    { name: "onReject", description: "拒绝文件回调", type: "(reason) => void" },
    { name: "drag", description: "启用拖放区域", type: "boolean" },
    { name: "disabled", description: "禁用上传", type: "boolean" },
    { name: "error", description: "错误提示", type: "ReactNode" },
  ],
};

export const dataEntryDocuments: Record<string, ComponentDocument> = {
  input: {
    title: "Input 输入框",
    description: "文本输入、插槽、尺寸、清除、校验和原生表单能力。",
    code: Example1Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example1 />,
    demos: [
      {
        title: "尺寸、插槽与状态",
        code: Example2Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example2 />,
      },
      {
        title: "受控与清除",
        code: Example3Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example3 />,
      },
    ],
    api: api.input,
  },
  textarea: {
    title: "Textarea 多行输入",
    description: "尺寸、字符计数、受控值和校验状态。",
    code: Example4Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example4 />,
    demos: [
      {
        title: "字符计数与受控值",
        code: Example5Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example5 />,
      },
      {
        title: "尺寸与状态",
        code: Example6Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example6 />,
      },
    ],
    api: api.textarea,
  },
  select: {
    title: "Select 选择器",
    description: "原生选择器、键盘操作、表单序列化和移动端体验。",
    code: Example7Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example7 />,
    demos: [
      {
        title: "尺寸与状态",
        code: Example8Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example8 />,
      },
      {
        title: "受控模式",
        code: Example9Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example9 />,
      },
    ],
    api: api.select,
  },
  "input-number": {
    title: "InputNumber 数字输入",
    description: "边界、步长、精度、格式化和键盘操作。",
    code: Example10Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example10 />,
    demos: [
      {
        title: "受控与格式化",
        code: Example11Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example11 />,
      },
    ],
    api: api["input-number"],
  },
  "date-picker": {
    title: "DatePicker 日期选择",
    description: "日期边界、尺寸、状态、受控值和清除。",
    code: Example12Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example12 />,
    demos: [
      {
        title: "受控与清除",
        code: Example13Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example13 />,
      },
    ],
    api: api["date-picker"],
  },
  form: {
    title: "Form 表单",
    description: "字段关联、校验结果、提交值、布局和整体状态。",
    code: Example14Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example14 />,
    demos: [
      {
        title: "校验与提交",
        code: Example15Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example15 />,
      },
    ],
    api: api.form,
  },
  upload: {
    title: "Upload 上传",
    description: "文件选择、拖放、受控列表和校验。",
    code: Example16Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example16 />,
    demos: [
      {
        title: "受控拖放区域",
        code: Example17Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example17 />,
      },
    ],
    api: api.upload,
  },
  "date-range-picker": {
    title: "DateRangePicker 日期范围",
    description: "受控开始和结束日期。",
    code: '<DateRangePicker start="2026-09-01" end="2026-09-06" onChange={() => undefined} />',
    render: () => (
      <DateRangePicker
        start="2026-09-01"
        end="2026-09-06"
        onChange={() => undefined}
      />
    ),
  },
  "time-picker": {
    title: "TimePicker 时间选择",
    description: "原生时间输入和键盘操作。",
    code: '<TimePicker aria-label="发布时间" />',
    render: () => <TimePicker aria-label="发布时间" />,
  },
  "color-picker": {
    title: "ColorPicker 颜色选择",
    description: "浏览器原生颜色选择。",
    code: '<ColorPicker defaultValue="#1677ff" />',
    render: () => <ColorPicker aria-label="品牌色" defaultValue="#1677ff" />,
  },
  checkbox: {
    title: "Checkbox 多选框",
    description: "独立选择和禁用状态。",
    code: '<Checkbox label="接受条款" defaultChecked />',
    render: () => <Checkbox label="接受条款" defaultChecked />,
  },
  radio: {
    title: "Radio 单选框",
    description: "使用相同 name 组成单选组。",
    code: '<Radio name="plan" label="基础版" defaultChecked />',
    render: () => <Radio name="plan" label="基础版" defaultChecked />,
  },
  switch: {
    title: "Switch 开关",
    description: "即时切换布尔状态。",
    code: '<Switch label="启用通知" defaultChecked />',
    render: () => <Switch label="启用通知" defaultChecked />,
  },
  slider: {
    title: "Slider 滑动输入",
    description: "范围、步长、禁用和键盘调整。",
    code: '<Slider aria-label="音量" min={0} max={100} defaultValue={40} />',
    render: () => (
      <Slider aria-label="音量" min={0} max={100} defaultValue={40} />
    ),
  },
  rate: {
    title: "Rate 评分",
    description: "受控或非受控星级评分。",
    code: "<Rate defaultValue={3} />",
    render: () => <Rate defaultValue={3} />,
  },
  autocomplete: {
    title: "AutoComplete 自动完成",
    description: "输入过滤和可访问列表框。",
    code: '<AutoComplete placeholder="输入城市" options={["Beijing", "Shanghai"]} />',
    render: () => (
      <AutoComplete placeholder="输入城市" options={["Beijing", "Shanghai"]} />
    ),
  },
  segmented: {
    title: "Segmented 分段控制",
    description: "在少量互斥选项之间切换。",
    code: '<Segmented options={["日", "周", "月"]} defaultValue="周" />',
    render: () => <Segmented options={["日", "周", "月"]} defaultValue="周" />,
  },
  cascader: {
    title: "Cascader 级联选择",
    description: "从层级数据中逐级选择。",
    code: '<Cascader options={[{ value: "zhejiang", label: "浙江" }]} />',
    render: () => <Cascader options={[{ value: "zhejiang", label: "浙江" }]} />,
  },
  "tree-select": {
    title: "TreeSelect 树选择",
    description: "从树形数据中选择节点。",
    code: '<TreeSelect treeData={[{ value: "docs", title: "文档" }]} />',
    render: () => <TreeSelect treeData={[{ value: "docs", title: "文档" }]} />,
  },
  transfer: {
    title: "Transfer 穿梭框",
    description: "在两个集合间移动条目。",
    code: '<Transfer dataSource={[{ key: "1", title: "成员一" }]} />',
    render: () => <Transfer dataSource={[{ key: "1", title: "成员一" }]} />,
  },
  mentions: {
    title: "Mentions 提及",
    description: "输入 @ 时显示匹配建议。",
    code: '<Mentions options={["alice", "bob"]} />',
    render: () => <Mentions options={["alice", "bob"]} />,
  },
  "input-otp": {
    title: "Input.OTP 验证码输入",
    description: "自动跳格和退格回退。",
    code: "<InputOTP length={6} />",
    render: () => <InputOTP length={6} />,
  },
};
