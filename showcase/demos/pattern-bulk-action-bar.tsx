import { Heading, Tag, Text } from "../../src/core";
import { ApiTable, type ApiRow } from "../components/api-table";
import { DemoSection } from "../components/demo-section";
import { canonicalExampleSource } from "./example-source";
import BulkActionBarExample from "./examples/pattern-bulk-action-bar";
import BulkActionBarExampleSource from "./examples/pattern-bulk-action-bar.tsx?raw";

const api: ApiRow[] = [
  {
    name: "selectionLabel",
    type: "ReactNode",
    description: "当前选择上下文，例如“已选择 3 项”。",
  },
  {
    name: "onCancel",
    type: "() => void",
    description: "取消当前选择；Pattern 固定提供取消入口。",
  },
  {
    name: "cancelLabel",
    type: "ReactNode",
    description: "取消入口文案。",
    defaultValue: '"取消"',
  },
  {
    name: "children",
    type: "ReactNode",
    description: "任意产品级批量动作；Pattern 不认识 AI、发布、删除等业务。",
  },
  {
    name: "aria-label",
    type: "string",
    description: "标准 toolbar accessible name。",
    defaultValue: '"批量操作"',
  },
  {
    name: "className",
    type: "string",
    description: "扩展外层 sticky toolbar surface。",
  },
];

export function PatternBulkActionBarDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Pattern · @gouno/ui/patterns
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>BulkActionBar 批量操作栏</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          当用户已经选择一组资源时，统一提供选择上下文、任意批量动作和取消选择入口。它只协调交互与可达性，不拥有资源列表、选择状态或业务动作。
        </Text>
      </header>

      <DemoSection
        title="批量选择与操作"
        description="Preview 直接渲染下面 Code 所读取的同一份示例源码；选择资源、消息状态以及三个动作都不会再出现两套实现。"
        code={canonicalExampleSource(BulkActionBarExampleSource)}
      >
        <BulkActionBarExample />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>Public API</Heading>
        <ApiTable rows={api} />
      </section>
    </div>
  );
}
