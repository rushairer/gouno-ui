import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import AISuggestionPickerExample from "./examples/ai-suggestion-picker";
import AISuggestionPickerExampleSource from "./examples/ai-suggestion-picker.tsx?raw";

const propsApi: ApiRow[] = [
  { name: "options", type: "readonly AISuggestionOption[]", description: "候选结果列表。Pattern 不负责生成这些内容。" },
  { name: "value", type: "string | null", description: "当前选中的候选值。" },
  { name: "onValueChange", type: "(value: string) => void", description: "用户切换候选时触发。" },
  { name: "onApply", type: "(value: string) => void", description: "点击统一确认动作时触发，由消费者决定如何写回业务字段。" },
  { name: "heading", type: "ReactNode", description: "建议区标题。", defaultValue: '"AI 建议"' },
  { name: "description", type: "ReactNode", description: "建议区辅助说明；不传时显示候选数量。" },
  { name: "groupLabel", type: "string", description: "RadioGroup accessible name。", defaultValue: '"AI 建议候选"' },
  { name: "onDismiss", type: "() => void", description: "可选取消 / 关闭入口。" },
  { name: "onRegenerate", type: "() => void", description: "可选重新生成入口；传入后 Header 右上角显示固定 icon-only 操作，并保留 accessible label/title。生成逻辑仍由消费者拥有。" },
  { name: "applyLabel", type: "string", description: "统一确认动作文案。", defaultValue: '"使用所选"' },
  { name: "className", type: "string", description: "扩展 Pattern 外层 surface。" },
];

const optionApi: ApiRow[] = [
  { name: "value", type: "string", description: "候选的主文本，同时作为选择值。" },
  { name: "description", type: "ReactNode", description: "可选候选解释或差异说明。" },
  { name: "monospace", type: "boolean", description: "路径、代码等机器可读候选使用等宽展示。", defaultValue: "false" },
];

export function PatternAISuggestionPickerDemo() {
  const exampleCode = canonicalExampleSource(AISuggestionPickerExampleSource);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Pattern · @gouno/ui/patterns
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>AISuggestionPicker AI 候选选择器</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          用于“一个业务字段对应多个互斥 AI 候选”的场景。Pattern 提供真实 Radio 选择、重新生成、取消与一个明确的确认动作；它不拥有模型、Prompt、持久化或字段校验。重新生成固定使用 icon-only 次级动作，避免窄容器中与标题、说明争抢横向空间。
        </Text>
      </header>

      <DemoSection
        title="候选选择后统一应用"
        description="Preview 与 Code 使用同一份示例源码。选择候选只改变选中态，只有点击“使用所选”才把结果写回示例字段。"
        code={exampleCode}
      >
        <AISuggestionPickerExample />
      </DemoSection>

      <DemoSection
        title="窄容器行为"
        description="重新生成始终保持 32×32 icon-only；标题与说明获得剩余宽度并自然换行，底部动作在必要时按按钮粒度换行。"
        code={exampleCode}
      >
        <div className="max-w-72">
          <AISuggestionPickerExample />
        </div>
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>Props API</Heading>
        <ApiTable rows={propsApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>AISuggestionOption</Heading>
        <ApiTable rows={optionApi} />
      </section>
    </div>
  );
}
