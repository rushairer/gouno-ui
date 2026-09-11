import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import AutoCompleteDemo from "./autocomplete/autocomplete-0";
import AutoCompleteDemoSource from "./autocomplete/autocomplete-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const autoCompleteReviewDocuments: Record<string, ComponentDocument> = {
  autocomplete: {
    ...dataEntryDocuments.autocomplete,
    description:
      "保留文本输入的受控/非受控语义，并提供可访问 listbox 建议层。字符串 options 继续兼容；对象 option 可显式提供 value/label/disabled。尺寸、校验状态、标准 input 属性和真实 input ref 与其他输入控件一致。",
    code: canonicalCoreSource(AutoCompleteDemoSource),
    render: () => <AutoCompleteDemo />,
    api: [
      {
        name: "options",
        description:
          "建议集合；字符串是兼容简写，对象形式可分别声明 value、label 和 disabled。",
        type: 'readonly (string | { value: string; label?: string; disabled?: boolean })[]',
      },
      {
        name: "value",
        description: "受控输入值。选择建议后也以 option.value 写入。",
        type: "string",
      },
      {
        name: "defaultValue",
        description: "非受控初始输入值。",
        type: "string",
        defaultValue: '""',
      },
      {
        name: "onChange",
        description: "输入文本或选择建议导致值变化时回传最新字符串。",
        type: "(value: string) => void",
      },
      {
        name: "onSelect",
        description: "确认可用建议项时回传 value 与标准化 option。",
        type: "(value: string, option: { value: string; label: string; disabled: boolean }) => void",
      },
      {
        name: "emptyText",
        description:
          "无匹配项时的调用方文案；未提供时不制造默认英文空状态。",
        type: "ReactNode",
      },
      {
        name: "size",
        description: "Gouno ControlSize；不复用原生 input 的数字 size 属性。",
        type: '"small" | "middle" | "large"',
        defaultValue: '"middle"',
      },
      {
        name: "status",
        description:
          "显式校验状态；error 同步 aria-invalid，warning 仅改变校验视觉。",
        type: '"error" | "warning"',
      },
      {
        name: "...input props",
        description:
          "透传标准 name/id/placeholder/disabled/readOnly/ARIA/data-* 与 focus/blur/keyboard 事件；组合框自身拥有 role、expanded、controls、activedescendant 与 autocomplete 语义。",
        type: "InputHTMLAttributes<HTMLInputElement>",
      },
      {
        name: "ref",
        description: "指向真实文本 input，而不是外层建议定位容器。",
        type: "Ref<HTMLInputElement>",
      },
    ],
  },
};
