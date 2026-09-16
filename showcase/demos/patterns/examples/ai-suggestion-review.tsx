import { useMemo, useState } from "react";
import { Text } from "../../../../src/core";
import { AISuggestionReview, type AISuggestionReviewItem } from "../../../../src/patterns";

const suggestions: readonly AISuggestionReviewItem[] = [
  { key: "slug", label: "Slug", value: "agent-workflow-observability", monospace: true },
  { key: "seo-title", label: "SEO 标题", value: "Agent 工作流可观测性：运行证据、审批与失败回放" },
  { key: "seo-description", label: "SEO 描述", value: "拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。" },
];

export default function AISuggestionReviewExample() {
  const [selectedKeys, setSelectedKeys] = useState(suggestions.map((item) => item.key));
  const [appliedKeys, setAppliedKeys] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);

  const appliedLabel = useMemo(
    () => appliedKeys.length ? `最近应用：${appliedKeys.join("、")}` : "尚未应用建议",
    [appliedKeys],
  );

  if (!visible) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm font-medium"
          onClick={() => {
            setSelectedKeys(suggestions.map((item) => item.key));
            setVisible(true);
          }}
        >
          重新打开 AI 建议
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AISuggestionReview
        aria-label="路径与 SEO AI 建议"
        heading="路径与 SEO 建议"
        description="可以取消任意一项，再一次性应用剩余修改。"
        groupLabel="路径与 SEO 建议列表"
        items={suggestions}
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
        onCancel={() => setVisible(false)}
        onRegenerate={() => setSelectedKeys(suggestions.map((item) => item.key))}
        onApply={() => setAppliedKeys(selectedKeys)}
      />
      <Text size="xs" tone="muted">{appliedLabel}</Text>
    </div>
  );
}
