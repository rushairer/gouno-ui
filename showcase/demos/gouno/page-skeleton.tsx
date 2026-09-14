import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import GounoPageSkeletonExample from "./examples/page-skeleton";
import GounoPageSkeletonExampleSource from "./examples/page-skeleton.tsx?raw";

export const pageSkeletonApi: ApiRow[] = [
  {
    name: "layout",
    type: '"collection" | "form" | "dashboard"',
    description: "选择已经由真实 Gouno 产品验证过的页面数据区骨架布局。",
  },
  {
    name: "aria-label",
    type: "string",
    description: "必填的本地化加载区域名称；PageSkeleton 自身提供 status / aria-live / aria-busy 语义。",
  },
  {
    name: "rows",
    type: "number",
    description: "collection 布局的占位行数，默认 5。",
  },
  {
    name: "columns",
    type: "number | readonly PageSkeletonColumn[]",
    description: "collection 的列数，或请求前已知的稳定表头与占位几何。只描述呈现，不承载排序、筛选、选择或数据 schema。",
  },
  {
    name: "pagination",
    type: "boolean",
    description: "collection 是否保留分页几何，默认 true。",
  },
  {
    name: "fields",
    type: "number",
    description: "form 布局的字段占位数量，默认 6。",
  },
  {
    name: "statistics",
    type: "number",
    description: "dashboard 布局的统计卡占位数量，默认 4。",
  },
  {
    name: "sections",
    type: "number",
    description: "dashboard 布局的大块内容区域数量，默认 2。",
  },
  {
    name: "className",
    type: "string",
    description: "扩展骨架数据区域布局；不用于复制产品业务语义。",
  },
  {
    name: "...div props",
    type: "HTMLAttributes<HTMLDivElement>",
    description: "除 role / aria-live / aria-busy / children 外的标准 div 属性。",
  },
];

export function GounoPageSkeletonDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Gouno · @gouno/ui/gouno
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>PageSkeleton 页面骨架</Heading>
          <Tag color="success">Canonical</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          Gouno 产品家族的页面数据区初始加载呈现策略。它只表达 collection、form、dashboard
          三类已经跨真实产品收敛的结构，不拥有请求生命周期、错误/空状态、路由或业务数据。
          稳定的 PageHeader、导航、集合表头和已经可用的数据应继续保留。
        </Text>
      </header>

      <DemoSection
        title="三类已准入布局"
        description="Preview 与 Code 使用同一个示例文件。页面负责判断 initial loading；PageSkeleton 只负责结构化占位。"
        code={canonicalExampleSource(GounoPageSkeletonExampleSource)}
      >
        <GounoPageSkeletonExample />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>PageSkeleton API</Heading>
        <ApiTable rows={pageSkeletonApi} />
      </section>
    </div>
  );
}
