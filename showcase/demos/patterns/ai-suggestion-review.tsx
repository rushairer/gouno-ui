import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import AISuggestionReviewExample from "./examples/ai-suggestion-review";
import AISuggestionReviewExampleSource from "./examples/ai-suggestion-review.tsx?raw";

const propsApi: ApiRow[] = [
  { name: "items", type: "readonly AISuggestionReviewItem[]", description: "需要用户审阅的一组关联字段修改。" },
  { name: "selectedKeys", type: "readonly string[]", description: "当前准备应用的建议 key。" },
  { name: "onSelectedKeysChange", type: "(keys: string[]) => void", description: "勾选状态变化回调。" },
  { name: "onApply", type: "() => void", description: "点击“应用 N 项建议”时触发；实际写回由消费者负责。" },
  { name: "heading", type: "ReactNode", description: "建议区标题。", defaultValue: '"AI 建议"' },
  { name: "description", type: "ReactNode", description: "审阅说明；不传时显示已选择数量。" },
  { name: "groupLabel", type: "string", description: "建议列表 accessible name。", defaultValue: '"AI 建议选择"' },
  { name: "onCancel", type: "() => void", description: "可选取消入口。" },
  { name: "onRegenerate", type: "() => void", description: "可选重新生成入口；传入后 Header 右上角显示固定 icon-only 操作，并保留 accessible label/title。Pattern 不负责生成逻辑。" },
  { name: "className", type: "string", description: "扩展 Pattern 外层 surface。" },
];

const itemApi: ApiRow[] = [
  { name: "key", type: "string", description: "稳定建议标识，用于 selectedKeys。" },
  { name: "label", type: "string", description: "字段或修改项标签。" },
  { name: "value", type: "ReactNode", description: "建议的新值或修改摘要。" },
  { name: "monospace", type: "boolean", description: "路径、代码等机器可读内容使用等宽展示。", defaultValue: "false" },
];

export function PatternAISuggestionReviewDemo() {
  const exampleCode = canonicalExampleSource(AISuggestionReviewExampleSource);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Pattern · @gouno/ui/patterns
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>AISuggestionReview AI 建议审阅器</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          用于“一次 AI 操作会修改多个相关字段”的场景。Pattern 用 Checkbox 明确哪些修改将被采用，并把提交收敛到一个“应用 N 项建议”动作，避免静默覆盖。重新生成固定使用 icon-only 次级动作，窄容器不再切换文字密度。
        </Text>
      </header>

      <DemoSection
        title="多字段建议先审阅再提交"
        description="Preview 与 Code 使用同一份示例源码。取消某些建议后，确认动作会实时反映最终应用数量。"
        code={exampleCode}
      >
        <AISuggestionReviewExample />
      </DemoSection>

      <DemoSection
        title="窄容器行为"
        description="重新生成始终保持 32×32 icon-only；Header 为内容区 + 固定操作区，说明文字可以换行，底部按钮在空间不足时按按钮粒度换行。"
        code={exampleCode}
      >
        <div className="max-w-72">
          <AISuggestionReviewExample />
        </div>
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>Props API</Heading>
        <ApiTable rows={propsApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>AISuggestionReviewItem</Heading>
        <ApiTable rows={itemApi} />
      </section>
    </div>
  );
}
