import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import ColorPickerDemo from "./color-picker/color-picker-0";
import ColorPickerDemoSource from "./color-picker/color-picker-0.tsx?raw";
import DateRangePickerDemo from "./date-range-picker/date-range-picker-0";
import DateRangePickerDemoSource from "./date-range-picker/date-range-picker-0.tsx?raw";
import TimePickerDemo from "./time-picker/time-picker-0";
import TimePickerDemoSource from "./time-picker/time-picker-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const nativePickerReviewDocuments: Record<string, ComponentDocument> = {
  "time-picker": {
    ...dataEntryDocuments["time-picker"],
    description:
      "保留原生 input[type=time] 的表单、键盘和值语义，同时统一 Gouno ControlSize、校验状态、标准 ARIA 与真实 input ref。",
    code: canonicalCoreSource(TimePickerDemoSource),
    render: () => <TimePickerDemo />,
    api: [
      { name: "size", description: "Gouno 控件尺寸；不复用原生 input 的数字 size 属性。", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
      { name: "status", description: "校验状态；error 会同步 aria-invalid，warning 只表达显式校验状态。", type: '"error" | "warning"' },
      { name: "value / defaultValue", description: "沿用原生时间输入值语义与 React 受控/非受控行为。", type: "InputHTMLAttributes<HTMLInputElement>[\"value\"]" },
      { name: "min / max / step", description: "沿用原生 time input 的范围和步进约束。", type: "string | number" },
      { name: "disabled / readOnly / required", description: "沿用原生表单状态，不创建第二套能力开关。", type: "boolean" },
      { name: "...input props", description: "透传标准 id/name/form/ARIA/data-* 与原生事件。", type: "InputHTMLAttributes<HTMLInputElement>" },
      { name: "ref", description: "指向真实 input[type=time]。", type: "Ref<HTMLInputElement>" },
    ],
  },
  "color-picker": {
    ...dataEntryDocuments["color-picker"],
    description:
      "保留浏览器原生 input[type=color] 交互，同时统一 Gouno ControlSize、校验状态、标准 ARIA 与真实 input ref。",
    code: canonicalCoreSource(ColorPickerDemoSource),
    render: () => <ColorPickerDemo />,
    api: [
      { name: "size", description: "Gouno 控件尺寸；不复用原生 input 的数字 size 属性。", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
      { name: "status", description: "校验状态；error 会同步 aria-invalid，warning 只表达显式校验状态。", type: '"error" | "warning"' },
      { name: "value / defaultValue", description: "沿用原生颜色输入值语义与 React 受控/非受控行为。", type: "InputHTMLAttributes<HTMLInputElement>[\"value\"]" },
      { name: "disabled", description: "沿用原生禁用语义。", type: "boolean" },
      { name: "...input props", description: "透传标准 id/name/form/ARIA/data-* 与原生事件。", type: "InputHTMLAttributes<HTMLInputElement>" },
      { name: "ref", description: "指向真实 input[type=color]。", type: "Ref<HTMLInputElement>" },
    ],
  },
  "date-range-picker": {
    ...dataEntryDocuments["date-range-picker"],
    description:
      "两个原生 date input 组成的受控日期范围。根节点拥有组合布局；每个输入分别拥有自己的原生属性、表单身份、ARIA 名称和可选 ref，避免把同一个 id/name/aria-label 复制到两个语义元素。",
    code: canonicalCoreSource(DateRangePickerDemoSource),
    render: () => <DateRangePickerDemo />,
    api: [
      { name: "start", description: "受控开始日期，使用原生 yyyy-mm-dd 值。", type: "string" },
      { name: "end", description: "受控结束日期，使用原生 yyyy-mm-dd 值。", type: "string" },
      { name: "onChange", description: "任一输入变化时回传完整 range；清空输入时对应字段为 undefined。", type: "(range: DateRange) => void" },
      { name: "size", description: "两个日期输入共享的 Gouno ControlSize。", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
      { name: "status", description: "共享校验状态；error 会把两个输入标记 aria-invalid。", type: '"error" | "warning"' },
      { name: "startInputProps", description: "仅属于开始日期 input 的标准属性、ARIA、name/id、约束和可选 ref。", type: "DateRangePickerInputProps" },
      { name: "endInputProps", description: "仅属于结束日期 input 的标准属性、ARIA、name/id、约束和可选 ref。", type: "DateRangePickerInputProps" },
      { name: "separator", description: "两个输入之间的纯视觉分隔内容。", type: "ReactNode", defaultValue: '"–"' },
      { name: "...div props", description: "根组合节点透传标准 div/ARIA/data/event 属性。", type: "HTMLAttributes<HTMLDivElement>" },
      { name: "ref", description: "指向真实根 div；单个 input ref 由对应 input props 拥有。", type: "Ref<HTMLDivElement>" },
    ],
  },
};
