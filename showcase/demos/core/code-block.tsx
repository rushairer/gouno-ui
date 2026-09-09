import type { ComponentDocument } from "../../components/component-page";
import BasicCodeBlockDemo from "./code-block/basic";
import BasicCodeBlockDemoSource from "./code-block/basic.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const codeBlockDocuments: Record<string, ComponentDocument> = {
  "code-block": {
    title: "CodeBlock 代码块",
    description:
      "用于只读代码展示。Core 负责滚动边界、语言标识与复制反馈；语法高亮引擎由 renderCode 注入，避免把 Prism、rehype 等实现细节固化进公共 API。",
    code: publicSource(BasicCodeBlockDemoSource),
    render: () => <BasicCodeBlockDemo />,
    api: [
      { name: "code", description: "唯一权威源码文本，同时作为默认显示内容与复制内容", type: "string" },
      { name: "language", description: "可选语言标识；不绑定具体高亮引擎的语言联合类型", type: "string" },
      { name: "copyable", description: "是否显示复制入口", type: "boolean", defaultValue: "true" },
      { name: "copyLabel", description: "复制动作的可见与可访问名称", type: "string", defaultValue: '"复制代码"' },
      { name: "copiedLabel", description: "复制成功后的可见与可访问名称", type: "string", defaultValue: '"代码已复制"' },
      { name: "renderCode", description: "可选代码呈现函数；接收与复制内容完全相同的 code 字符串，可用于语法高亮", type: "(code: string) => ReactNode" },
      { name: "className", description: "附加根节点样式类", type: "string" },
    ],
    notes: (
      <p className="text-sm text-muted-foreground">
        renderCode 只改变代码的视觉 token 呈现，不提供第二份源码写入口。复制始终使用 code，调用方应让高亮器消费传入的同一字符串。
      </p>
    ),
  },
};
