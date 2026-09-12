import type { ComponentDocument } from "../../components/component-page";
import Basic from "./config-provider/basic";
import BasicSource from "./config-provider/basic.tsx?raw";
import Localized from "./config-provider/localized";
import LocalizedSource from "./config-provider/localized.tsx?raw";
const canonicalExampleSource = (source: string) => source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const configProviderDocuments: Record<string, ComponentDocument> = {
  "config-provider": {
    title: "ConfigProvider 组件语言",
    description: "通用操作文案默认英文；完整语言包按 React 子树配置，组件局部覆盖优先。业务内容仍由产品提供。",
    code: canonicalExampleSource(BasicSource), render: () => <Basic />,
    demos: [{ title: "中文、局部覆盖与动态切换", code: canonicalExampleSource(LocalizedSource), render: () => <Localized /> }],
    api: [
      { name: "locale", type: "ComponentLocale", description: "完整语言包；enUS 或 zhCN。省略时继承最近 Provider，最外层回退 enUS。", defaultValue: "继承 / enUS" },
      { name: "children", type: "ReactNode", description: "配置生效的 React 子树，包括通过 Portal 渲染的浮层。" },
    ],
    apiSections: [{ title: "ComponentLocale", rows: [
      { name: "locale", type: "string", description: "语言标识；不自动修改 HTML lang、格式化日期或持久化语言。" },
      { name: "input / datePicker / inputNumber / select / upload / pagination", type: "各组件的完整语言配置", description: "通用文案及带类型的动态标签函数；完整字段见 docs/component-localization.md。" },
    ] }],
    notes: "优先级：组件显式文案和 locale 局部覆盖 → 最近 Provider → 英文默认值。已有 placeholder、prevText、nextText 等入口不在组件局部 locale 中重复。",
  },
};
