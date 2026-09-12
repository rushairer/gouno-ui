import { Heading, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import ThemeControlsExample from "./examples/controls";
import ThemeControlsExampleSource from "./examples/controls.tsx?raw";

const providerApi: ApiRow[] = [
  {
    name: "brand",
    description: "产品品牌，写入 documentElement.dataset.brand。",
    type: "Brand",
  },
  {
    name: "storageKey",
    description: "明暗模式的 localStorage key；由消费应用显式拥有。",
    type: "string",
  },
  {
    name: "density",
    description: "全局密度，写入 data-density。",
    type: '"comfortable" | "compact"',
    defaultValue: '"comfortable"',
  },
  {
    name: "children",
    description: "共享主题上下文的应用子树。",
    type: "ReactNode",
  },
];

const toggleApi: ApiRow[] = [
  {
    name: "label",
    description: "主题切换入口的可访问名称。",
    type: "string",
    defaultValue: '"主题"',
  },
  {
    name: "labels",
    description: "light / dark / system 三种模式的显示文案。",
    type: "Record<ThemeMode, string>",
    defaultValue: "内置中文文案",
  },
];

const contextApi: ApiRow[] = [
  {
    name: "useTheme()",
    description: "读取 brand、mode、resolvedMode，并通过 setMode 持久化模式。",
    type: "{ brand; mode; resolvedMode; setMode }",
  },
  {
    name: "ThemeMode",
    description: "用户选择的主题模式。",
    type: '"light" | "dark" | "system"',
  },
  {
    name: "Brand",
    description: "Gouno 产品家族品牌。",
    type: '"blog" | "blog-admin" | "gosso-admin"',
  },
  {
    name: "Density",
    description: "全局交互密度。",
    type: '"comfortable" | "compact"',
  },
  {
    name: "resolveMode",
    description: "将 system + 系统偏好解析为 light/dark。",
    type: "(mode: ThemeMode, systemDark: boolean) => 'light' | 'dark'",
  },
  {
    name: "readMode",
    description: "从指定 storageKey 读取合法模式，非法或不可用时回退 system。",
    type: "(storageKey: string) => ThemeMode",
  },
  {
    name: "brandNames",
    description: "Brand 到产品显示名称的 canonical 映射。",
    type: "Record<Brand, string>",
  },
];

export function ThemeSystemDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Theme · @gouno/ui/theme
        </div>
        <Heading level={1}>Theme System 主题系统</Heading>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          Theme 是正式所有权层，负责品牌、明暗模式、持久化与浏览器主题副作用；它不是通用应用状态 Provider。
        </Text>
      </header>

      <DemoSection
        title="主题模式控制"
        description="Preview 直接渲染下面 Code 所读取的同一份示例源码；该示例假设应用根部已经由 ThemeProvider 提供主题上下文。"
        code={canonicalExampleSource(ThemeControlsExampleSource)}
      >
        <ThemeControlsExample />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>ThemeProvider API</Heading>
        <Text size="sm" tone="muted">
          ThemeProvider 应放在产品应用根部；交互示例不额外嵌套 Provider，避免示例修改 Showcase 自身的 document theme 副作用。
        </Text>
        <ApiTable rows={providerApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>ThemeToggle API</Heading>
        <ApiTable rows={toggleApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>Context 与类型/工具</Heading>
        <ApiTable rows={contextApi} />
      </section>
    </div>
  );
}
