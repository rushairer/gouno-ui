import { Heading, Segmented, Tag, Text } from "../../src/core";
import { ThemeToggle, useTheme, type ThemeMode } from "../../src/theme";
import { ApiTable, type ApiRow } from "../components/api-table";
import { DemoSection } from "../components/demo-section";

const modeOptions = [
  { label: "跟随系统", value: "system" },
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
] as const;

const themeExampleCode = `import { Segmented, Tag } from "@gouno/ui/core";
import {
  ThemeProvider,
  ThemeToggle,
  useTheme,
  type ThemeMode,
} from "@gouno/ui/theme";

const modeOptions = [
  { label: "跟随系统", value: "system" },
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
] as const;

function ThemeControls() {
  const { brand, mode, resolvedMode, setMode } = useTheme();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Tag color="primary">brand: {brand}</Tag>
        <Tag color="default">mode: {mode}</Tag>
        <Tag color={resolvedMode === "dark" ? "info" : "success"}>
          resolved: {resolvedMode}
        </Tag>
      </div>
      <Segmented<ThemeMode>
        aria-label="主题模式"
        options={modeOptions}
        value={mode}
        onChange={setMode}
      />
      <ThemeToggle />
    </div>
  );
}

export function AppTheme() {
  return (
    <ThemeProvider brand="blog-admin" storageKey="gouno-theme-mode">
      <ThemeControls />
    </ThemeProvider>
  );
}`;

const providerApi: ApiRow[] = [
  { name: "brand", description: "产品品牌，写入 documentElement.dataset.brand。", type: "Brand" },
  { name: "storageKey", description: "明暗模式的 localStorage key；由消费应用显式拥有。", type: "string" },
  { name: "density", description: "全局密度，写入 data-density。", type: '"comfortable" | "compact"', defaultValue: '"comfortable"' },
  { name: "children", description: "共享主题上下文的应用子树。", type: "ReactNode" },
];

const toggleApi: ApiRow[] = [
  { name: "label", description: "主题切换入口的可访问名称。", type: "string", defaultValue: '"主题"' },
  { name: "labels", description: "light / dark / system 三种模式的显示文案。", type: "Record<ThemeMode, string>", defaultValue: "内置中文文案" },
];

const contextApi: ApiRow[] = [
  { name: "useTheme()", description: "读取 brand、mode、resolvedMode，并通过 setMode 持久化模式。", type: "{ brand; mode; resolvedMode; setMode }" },
  { name: "ThemeMode", description: "用户选择的主题模式。", type: '"light" | "dark" | "system"' },
  { name: "Brand", description: "Gouno 产品家族品牌。", type: '"blog" | "blog-admin" | "gosso-admin"' },
  { name: "Density", description: "全局交互密度。", type: '"comfortable" | "compact"' },
  { name: "resolveMode", description: "将 system + 系统偏好解析为 light/dark。", type: "(mode: ThemeMode, systemDark: boolean) => 'light' | 'dark'" },
  { name: "readMode", description: "从指定 storageKey 读取合法模式，非法或不可用时回退 system。", type: "(storageKey: string) => ThemeMode" },
  { name: "brandNames", description: "Brand 到产品显示名称的 canonical 映射。", type: "Record<Brand, string>" },
];

export function ThemeSystemDemo() {
  const { brand, mode, resolvedMode, setMode } = useTheme();

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
        description="Preview 运行在 Showcase 的 canonical ThemeProvider 中；Code 同时给出应用根部 Provider 与控制组件的完整消费方式。"
        code={themeExampleCode}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Tag color="primary">brand: {brand}</Tag>
            <Tag color="default">mode: {mode}</Tag>
            <Tag color={resolvedMode === "dark" ? "info" : "success"}>
              resolved: {resolvedMode}
            </Tag>
          </div>
          <div className="flex flex-col gap-3">
            <Text as="div" size="sm" className="font-medium">
              模式控制
            </Text>
            <Segmented<ThemeMode>
              aria-label="主题模式"
              options={modeOptions}
              value={mode}
              onChange={setMode}
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Text size="sm" tone="muted">
              ThemeToggle 与显式模式控制共享同一个 ThemeProvider 状态。
            </Text>
          </div>
        </div>
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>ThemeProvider API</Heading>
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
