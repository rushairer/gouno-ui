import { useState } from "react";
import { Archive, Sparkles, Trash2 } from "lucide-react";
import { Button, Card, Heading, Tag, Text } from "../../src/core";
import { BulkActionBar } from "../../src/patterns";
import { CodeBlock } from "../components/code-block";

const exampleCode = `<BulkActionBar
  selectionLabel={\`已选择 \${selected.length} 项\`}
  onCancel={() => setSelected([])}
>
  <Button size="small" onClick={archive}>归档</Button>
  <Button size="small" color="error" onClick={remove}>删除</Button>
</BulkActionBar>`;

const api = [
  ["selectionLabel", "ReactNode", "当前选择上下文，例如“已选择 3 项”。"],
  ["onCancel", "() => void", "取消当前选择；Pattern 固定提供取消入口。"],
  ["cancelLabel", "ReactNode", "取消入口文案，默认“取消”。"],
  ["children", "ReactNode", "任意产品级批量动作；Pattern 不认识 AI、发布、删除等业务。"],
  ["aria-label", "string", "标准 toolbar accessible name，默认“批量操作”。"],
  ["className", "string", "扩展外层 sticky toolbar surface。"],
] as const;

export function PatternBulkActionBarDemo() {
  const [selected, setSelected] = useState(["a", "b", "c"]);
  const [message, setMessage] = useState("选择三项以显示批量操作。 ");

  const reset = () => {
    setSelected(["a", "b", "c"]);
    setMessage("已恢复 3 项选择。 ");
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pattern · @gouno/ui/patterns</div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>BulkActionBar 批量操作栏</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          当用户已经选择一组资源时，统一提供选择上下文、任意批量动作和取消选择入口。它只协调交互与可达性，不拥有资源列表、选择状态或业务动作。
        </Text>
      </header>

      <Card padding="base" className="min-h-72">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text size="sm" tone="muted">{message}</Text>
            {selected.length === 0 ? <Button size="small" onClick={reset}>恢复选择</Button> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["文章 A", "文章 B", "文章 C"].map((item, index) => (
              <button
                key={item}
                type="button"
                aria-pressed={selected.includes(String.fromCharCode(97 + index))}
                onClick={() => {
                  const key = String.fromCharCode(97 + index);
                  setSelected((current) => current.includes(key) ? current.filter((value) => value !== key) : [...current, key]);
                }}
                className="rounded-lg border bg-card px-4 py-5 text-left text-sm transition-colors hover:bg-muted aria-pressed:border-primary/40 aria-pressed:bg-accent/30"
              >
                {item}
              </button>
            ))}
          </div>
          {selected.length > 0 ? (
            <BulkActionBar selectionLabel={`已选择 ${selected.length} 项`} onCancel={() => setSelected([])}>
              <Button size="small" icon={<Sparkles />} onClick={() => setMessage(`对 ${selected.length} 项执行辅助动作。`)}>辅助</Button>
              <Button size="small" icon={<Archive />} onClick={() => setMessage(`已归档 ${selected.length} 项。`)}>归档</Button>
              <Button size="small" color="error" icon={<Trash2 />} onClick={() => setMessage(`请求删除 ${selected.length} 项。`)}>删除</Button>
            </BulkActionBar>
          ) : null}
        </div>
      </Card>

      <div>
        <Heading level={3}>Example</Heading>
        <div className="mt-3"><CodeBlock code={exampleCode} /></div>
      </div>

      <div>
        <Heading level={3}>Public API</Heading>
        <div className="mt-3 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">API</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">职责</th></tr></thead>
            <tbody className="divide-y">
              {api.map(([name, type, description]) => (
                <tr key={name}><td className="px-4 py-3 font-mono text-xs text-primary">{name}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td><td className="px-4 py-3 text-muted-foreground">{description}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
