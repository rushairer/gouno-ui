import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import MentionsDemo from "./mentions/mentions-0";
import MentionsDemoSource from "./mentions/mentions-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const mentionsReviewDocuments: Record<string, ComponentDocument> = {
  mentions: {
    ...dataEntryDocuments.mentions,
    description:
      "多行文本提及保持原生 textarea/textbox 语义，并把 value/defaultValue/onChange 收敛为单一字符串状态。Core 只负责尾部 mention token 解析、本地 options 过滤、textbox/listbox ARIA 关联、方向键高亮与 Enter 选择；远程搜索、debounce 和用户资源加载继续由调用方拥有。",
    code: canonicalCoreSource(MentionsDemoSource),
    render: () => <MentionsDemo />,
    api: [
      {
        name: "options",
        description: "本地可提及值列表；Core 只做当前 token 的大小写不敏感过滤。",
        type: "readonly string[]",
      },
      {
        name: "prefix",
        description: "触发当前 mention token 的前缀；支持需要正则转义的字符。",
        type: "string",
        defaultValue: '"@"',
      },
      {
        name: "value",
        description: "受控文本字符串。",
        type: "string",
      },
      {
        name: "defaultValue",
        description: "非受控初始文本字符串。",
        type: "string",
        defaultValue: '""',
      },
      {
        name: "onChange",
        description: "输入或选择 mention 后回传完整文本字符串。",
        type: "(value: string) => void",
      },
      {
        name: "onSelect",
        description: "确认建议时回传不含 prefix 的 mention 值；它不是原生文本 selection 事件。",
        type: "(value: string) => void",
      },
      {
        name: "size",
        description: "沿用 Textarea 的 Gouno ControlSize。",
        type: '"small" | "middle" | "large"',
        defaultValue: '"middle"',
      },
      {
        name: "status",
        description: "沿用 Textarea 的 error/warning 校验视觉与 aria-invalid 规则。",
        type: '"error" | "warning"',
      },
      {
        name: "showCount / maxLength",
        description: "沿用 Textarea 的字符计数与原生 maxLength 合同。",
        type: "boolean / number",
      },
      {
        name: "...textarea props",
        description:
          "透传标准 textarea 的 name/form/placeholder/disabled/readOnly/ARIA/data/event/className 等属性；原生多行 textbox 语义保持不变，autocomplete/listbox 关联属性由 Mentions 保护。",
        type: "TextareaHTMLAttributes<HTMLTextAreaElement>",
      },
      {
        name: "ref",
        description: "指向真实 textarea。",
        type: "Ref<HTMLTextAreaElement>",
      },
    ],
  },
};
