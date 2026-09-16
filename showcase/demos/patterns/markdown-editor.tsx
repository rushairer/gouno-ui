import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { MarkdownPreview } from "../../components/markdown-preview";
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
  { name: "renderPreview", type: "(value: string) => ReactNode", description: "预览渲染器。MarkdownEditor 不绑定具体 Markdown parser；产品接入自己选定的 Markdown renderer。" },
  { name: "toolbarActions", type: "ReactNode | ({ density, compact }) => ReactNode", description: "产品级工具扩展槽。需要参与紧凑态时使用 render callback，根据 compact / density 在文本按钮与 icon-only 之间切换；业务动作仍由产品拥有。" },
  { name: "headingLevels", type: "readonly (1 | 2 | 3 | 4 | 5 | 6)[]", description: "段落 / 标题菜单可用的标题级别。正文编辑默认保留页面级 H1 给外部标题；独立 Markdown 文档可显式开启 H1。", defaultValue: "[2,3,4,5,6]" },
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
          统一 Markdown 编辑、段落 / H1–H6 标题转换、格式工具、编辑 / 分屏 / 预览视图，以及光标与选区控制。正文型消费者可限制 headingLevels；产品动作继续通过 toolbarActions 与 ref API 组合。工具栏按自身容器宽度自适应：空间不足时低优先级内建格式命令会依次进入“更多格式”；继续变窄时，带图标的产品动作与视图切换收敛为仅图标；只有极窄容器才允许多行。产品注入的 toolbarActions 应使用 density-aware render callback，为紧凑态显式提供可识别图标与 aria-label，而不是依赖 Pattern 猜测子节点 DOM。
        </Text>
      </header>

      <DemoSection
        title="常用 Markdown、标题层级、代码高亮与产品扩展"
        description="段落样式菜单会识别当前光标所在块，并在正文与 H1–H6 之间转换；示例显式开启完整标题范围。Showcase renderer 额外演示表格、任务列表、删除线、图片和带语言标记的 fenced code 高亮。MarkdownEditor 仍通过 renderPreview 保持 parser 解耦。示例中的 AI 写作 / 插图只是 toolbarActions 自定义动作；缩窄 Demo 容器时，行内代码、链接等较低优先级默认命令会自动收进“更多格式”；继续变窄后，AI 写作 / 插图与编辑 / 分屏 / 预览会切换为 icon-only，仍放不下时才退回多行布局。"
        code={canonicalExampleSource(MarkdownEditorExampleSource)}
      >
        <MarkdownEditorExample renderPreview={(markdown) => <MarkdownPreview value={markdown} />} />
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