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
    description: "选择低保真的 collection、form 或 dashboard 页面骨架预设。",
  },
  {
    name: "aria-label",
    type: "string",
    description: "必填的本地化加载区域名称；PageSkeleton 自身提供 status / aria-live / aria-busy 语义。",
  },
  {
    name: "rows",
    type: "number",
    description: "collection 的粗略占位行数，默认 5。",
  },
  {
    name: "columns",
    type: "number",
    description: "collection 的粗略桌面占位列数，默认 5；不承载真实表头或业务列定义。",
  },
  {
    name: "pagination",
    type: "boolean",
    description: "collection 是否保留分页轮廓，默认 true。",
  },
  {
    name: "fields",
    type: "number",
    description: "form 的粗略字段占位数量，默认 6。",
  },
  {
    name: "statistics",
    type: "number",
    description: "dashboard 的统计卡占位数量，默认 4。",
  },
  {
    name: "sections",
    type: "number",
    description: "dashboard 的大块内容占位数量，默认 2。",
  },
  {
    name: "className",
    type: "string",
    description: "扩展骨架区域布局；不用于复制产品业务语义。",
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
          三个低保真的常见页面轮廓：collection、form、dashboard。它们用于建立加载中的页面形状，
          不描述真实 Filter、Toolbar、表头、业务字段或请求生命周期。
        </Text>
      </header>

      <DemoSection
        title="三类页面轮廓"
        description="Preview 与 Code 使用同一个示例文件。选择最接近目标页面的 preset 即可，不追求与真实页面逐字段一致。"
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
