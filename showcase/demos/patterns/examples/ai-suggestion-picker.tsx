import { useState } from "react";
import { Button, Field, Input, Text } from "../../../../src/core";
import { AISuggestionPicker, type AISuggestionOption } from "../../../../src/patterns";

const primaryOptions: readonly AISuggestionOption[] = [
  {
    value: "Agent 工作流可观测性：从运行记录到人工审批",
    description: "强调生产化后的运行证据与审批边界。",
  },
  {
    value: "AI 自动化进入生产后，为什么运行证据比生成结果更重要",
    description: "更偏观点型标题，突出生产治理判断。",
  },
  {
    value: "从生成到治理：Agent 自动化真正缺的是什么",
    description: "更短、更适合首页卡片与社交分享。",
  },
];

export default function AISuggestionPickerExample() {
  const [options, setOptions] = useState<readonly AISuggestionOption[]>(primaryOptions);
  const [value, setValue] = useState<string | null>(primaryOptions[0]?.value ?? null);
  const [applied, setApplied] = useState("每日 AI 资讯：Agent 工作流进入可观测阶段");
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <Button
          onClick={() => {
            setOptions(primaryOptions);
            setValue(primaryOptions[0]?.value ?? null);
            setVisible(true);
          }}
        >
          重新打开 AI 建议
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="当前标题">
        <Input aria-label="当前标题" value={applied} readOnly />
      </Field>

      <AISuggestionPicker
        aria-label="标题 AI 建议"
        heading="标题候选"
        description="候选结果先选择，再通过一个明确动作写回业务字段。"
        groupLabel="标题候选列表"
        options={options}
        value={value}
        onValueChange={setValue}
        onDismiss={() => setVisible(false)}
        onRegenerate={() => {
          const regenerated = [...primaryOptions].reverse();
          setOptions(regenerated);
          setValue(regenerated[0]?.value ?? null);
        }}
        onApply={(next) => setApplied(next)}
      />

      <Text size="xs" tone="muted">
        Pattern 只拥有候选选择与确认语义；模型调用、字段写入和业务校验仍由消费者负责。
      </Text>
    </div>
  );
}
