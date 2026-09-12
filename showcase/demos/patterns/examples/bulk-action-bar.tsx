import { useState } from "react";
import { Archive, Sparkles, Trash2 } from "lucide-react";
import { Button, Text } from "../../../../src/core";
import { BulkActionBar } from "../../../../src/patterns";

const resources = [
  { key: "a", label: "文章 A" },
  { key: "b", label: "文章 B" },
  { key: "c", label: "文章 C" },
] as const;

export default function BulkActionBarExample() {
  const [selected, setSelected] = useState(["a", "b", "c"]);
  const [message, setMessage] = useState("选择三项以显示批量操作。");

  const reset = () => {
    setSelected(["a", "b", "c"]);
    setMessage("已恢复 3 项选择。");
  };

  return (
    <div className="flex min-h-64 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text size="sm" tone="muted">
          {message}
        </Text>
        {selected.length === 0 ? (
          <Button size="small" onClick={reset}>
            恢复选择
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {resources.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={selected.includes(item.key)}
            onClick={() =>
              setSelected((current) =>
                current.includes(item.key)
                  ? current.filter((value) => value !== item.key)
                  : [...current, item.key],
              )
            }
            className="rounded-lg border bg-card px-4 py-5 text-left text-sm transition-colors hover:bg-muted aria-pressed:border-primary/40 aria-pressed:bg-accent/30"
          >
            {item.label}
          </button>
        ))}
      </div>

      {selected.length > 0 ? (
        <BulkActionBar
          selectionLabel={`已选择 ${selected.length} 项`}
          onCancel={() => setSelected([])}
        >
          <Button
            size="small"
            icon={<Sparkles />}
            onClick={() => setMessage(`对 ${selected.length} 项执行辅助动作。`)}
          >
            辅助
          </Button>
          <Button
            size="small"
            icon={<Archive />}
            onClick={() => setMessage(`已归档 ${selected.length} 项。`)}
          >
            归档
          </Button>
          <Button
            size="small"
            color="error"
            icon={<Trash2 />}
            onClick={() => setMessage(`请求删除 ${selected.length} 项。`)}
          >
            删除
          </Button>
        </BulkActionBar>
      ) : null}
    </div>
  );
}
