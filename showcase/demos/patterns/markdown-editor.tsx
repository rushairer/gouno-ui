import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import MarkdownEditorExample from "./examples/markdown-editor";
import MarkdownEditorExampleSource from "./examples/markdown-editor.tsx?raw";

const propsApi: ApiRow[] = [
  { name: "value", type: "string", description: "受控 Markdown 文本。" },
  { name: "onChange", type: "(value: string) => void", description: "正文变化回调。" },
  { name: "mode", type: '"edit" | "split" | "preview"', description: "受控视图模式。" },
  { name: "defaultMode", type: '"edit" | "split" | "preview"', description: "非受控初始视图。", defaultValue: '"edit"' },
  { name: "onModeChange", type: "(mode) => void", description: "编辑 / 分屏 / 预览切换回调。" },
  { name: "onSelectionChange", type: "(selection) => void", description: "光标或选区变化回调；产品可据此决定 AI 的作用域。" },
  { name: "renderPreview", type: "(value: string) => ReactNode", description: "预览渲染器。MarkdownEditor 不绑定具体 Markdown parser。" },
  { name: "toolbarActions", type: "ReactNode", description: "产品级工具扩展槽。AI、插入媒体等业务动作通过这里注入，不是 MarkdownEditor 内建能力。" },
  { name: "placeholder", type: "string", description: "编辑区占位文本。" },
  { name: "readOnly", type: "boolean", description: "只读模式；隐藏格式工具并禁止写入。", defaultValue: "false" },
  { name: "textareaAriaLabel", type: "string", description: "编辑区 accessible name。", defaultValue: '"Markdown 正文"' },
  { name: "previewAriaLabel", type: "string", description: "预览区 accessible name。", defaultValue: '"Markdown 预览"' },
  { name: "editorClassName", type: "string", description: "扩展内部 Textarea 样式。" },
  { name: "className", type: "string", description: "扩展编辑器外层 surface。" },
];

const refApi: ApiRow[] = [
  { name: "focus()", type: "() => void", description: "聚焦 Markdown Textarea。" },
  { name: "getSelection()", type: "() => MarkdownEditorSelection", description: "读取当前光标 / 选区及文本。" },
  { name: "setSelection(start, end?)", type: "(start: number, end?: number) => void", description: "定位光标或选择文本。" },
  { name: "insertText(text, options?)", type: "(text: string, options?) => void", description: "在当前选区 / 光标位置插入产品生成的内容；可选择是否替换选区、是否选中新插入文本。" },
];

export function PatternMarkdownEditorDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Pattern · @gouno/ui/patterns
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>MarkdownEditor Markdown 编辑器</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          统一 Markdown 编辑、格式工具、编辑 / 分屏 / 预览视图，以及光标与选区控制。Pattern 不认识 Blog、AI 或媒体库；产品动作通过 toolbarActions 与 ref API 组合。
        </Text>
      </header>

      <DemoSection
        title="编辑、分屏、预览与产品扩展"
        description="格式按钮修改 Markdown 文本；预览通过 renderPreview 注入。示例中的 AI / 插入只是 toolbarActions 自定义动作，用来展示产品如何扩展工具栏。"
        code={canonicalExampleSource(MarkdownEditorExampleSource)}
      >
        <MarkdownEditorExample />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>Props API</Heading>
        <ApiTable rows={propsApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>Ref API</Heading>
        <ApiTable rows={refApi} />
      </section>
    </div>
  );
}
