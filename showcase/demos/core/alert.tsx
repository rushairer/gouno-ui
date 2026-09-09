import type { ComponentDocument } from "../../components/component-page";
import BasicAlerts from "./alert/basic";
import BasicAlertsSource from "./alert/basic.tsx?raw";
import DescriptionAlerts from "./alert/description";
import DescriptionAlertsSource from "./alert/description.tsx?raw";
import ClosableAlert from "./alert/closable";
import ClosableAlertSource from "./alert/closable.tsx?raw";
import BannerVariants from "./alert/variants";
import BannerVariantsSource from "./alert/variants.tsx?raw";
import SemanticStyles from "./alert/semantic";
import SemanticStylesSource from "./alert/semantic.tsx?raw";
import ErrorBoundaryDemo from "./alert/error-boundary";
import ErrorBoundaryDemoSource from "./alert/error-boundary.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const alertDocuments: Record<string, ComponentDocument> = {
  alert: {
    title: "Alert 警告提示",
    description:
      "页面内持续可见的重要反馈。API 采用当前 Ant Design 高层语义，同时保持 Gouno 的单一命名与 semantic token 约束。所有 Preview 与 Code 都来自同一个可执行示例文件。",
    code: publicSource(BasicAlertsSource),
    render: () => <BasicAlerts />,
    demos: [
      {
        title: "图标与辅助描述",
        description: "showIcon 控制语义图标；description 承载补充说明。",
        code: publicSource(DescriptionAlertsSource),
        render: () => <DescriptionAlerts />,
      },
      {
        title: "操作与关闭生命周期",
        description:
          "action 独立承载操作；closable 对象集中管理 close icon、onClose、afterClose 和 aria 属性。示例中的状态与重新显示逻辑就是 Code 面板展示的同一份实现。",
        code: publicSource(ClosableAlertSource),
        render: () => <ClosableAlert />,
      },
      {
        title: "Banner 与视觉变体",
        description:
          "banner 默认 warning + icon；variant 只表达 outlined/filled 视觉，不混入语义颜色。",
        code: publicSource(BannerVariantsSource),
        render: () => <BannerVariants />,
      },
      {
        title: "自定义图标与 Semantic DOM",
        description:
          "classNames/styles 面向稳定语义区域，不要求消费者依赖内部节点结构。",
        code: publicSource(SemanticStylesSource),
        render: () => <SemanticStyles />,
      },
      {
        title: "ErrorBoundary",
        description:
          "Alert.ErrorBoundary 将局部 React 渲染错误降级为 error Alert；触发和重置状态也包含在同源示例中。",
        code: publicSource(ErrorBoundaryDemoSource),
        render: () => <ErrorBoundaryDemo />,
      },
    ],
    api: [
      { name: "title", description: "主要提示内容", type: "ReactNode" },
      { name: "description", description: "补充说明内容", type: "ReactNode" },
      {
        name: "children",
        description:
          "可选自定义补充内容，位于 title/description 后；不是 title 的别名",
        type: "ReactNode",
      },
      {
        name: "type",
        description: "语义类型；banner 未显式指定时默认为 warning",
        type: '"success" | "info" | "warning" | "error"',
        defaultValue: '"info"',
      },
      {
        name: "showIcon",
        description: "是否显示语义图标；banner 默认 true",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "icon",
        description: "自定义图标；仅在 showIcon 生效时显示",
        type: "ReactNode",
      },
      { name: "action", description: "右侧操作区域", type: "ReactNode" },
      {
        name: "closable",
        description:
          "关闭能力；对象形式集中配置关闭生命周期与可访问属性",
        type: "boolean | AlertClosableConfig",
        defaultValue: "false",
      },
      {
        name: "banner",
        description:
          "横幅模式；默认 warning + showIcon，并移除左右边框/圆角",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "variant",
        description: "纯视觉形态，不承载语义颜色",
        type: '"outlined" | "filled"',
        defaultValue: '"outlined"',
      },
      {
        name: "classNames",
        description:
          "按 Semantic DOM key 设置类名，也可使用函数根据 resolved props 返回",
        type: "Partial<Record<AlertSemantic, string>> | function",
      },
      {
        name: "styles",
        description:
          "按 Semantic DOM key 设置内联样式，也可使用函数根据 resolved props 返回",
        type: "Partial<Record<AlertSemantic, CSSProperties>> | function",
      },
      {
        name: "className",
        description: "根节点附加类名；在 classNames.root 之后合并",
        type: "string",
      },
      {
        name: "style",
        description: "根节点标准 React style；在 styles.root 之后合并",
        type: "CSSProperties",
      },
    ],
    apiSections: [
      {
        title: "AlertClosableConfig",
        rows: [
          { name: "closeIcon", description: "自定义关闭图标", type: "ReactNode" },
          {
            name: "onClose",
            description: "点击关闭按钮时触发",
            type: "(event: MouseEvent<HTMLButtonElement>) => void",
          },
          {
            name: "afterClose",
            description: "退出过渡完成并卸载后触发",
            type: "() => void",
          },
          {
            name: "aria-*",
            description: "传给关闭按钮的标准 ARIA 属性",
            type: "React.AriaAttributes",
          },
        ],
      },
      {
        title: "Semantic DOM",
        description: "classNames/styles 的稳定 key。",
        rows: [
          { name: "root", description: "Alert 根节点", type: "semantic slot" },
          { name: "icon", description: "图标区域", type: "semantic slot" },
          { name: "section", description: "文本内容区域", type: "semantic slot" },
          { name: "title", description: "标题区域", type: "semantic slot" },
          {
            name: "description",
            description: "说明区域",
            type: "semantic slot",
          },
          { name: "actions", description: "操作区域", type: "semantic slot" },
          { name: "close", description: "关闭按钮", type: "semantic slot" },
        ],
      },
      {
        title: "Alert.ErrorBoundary",
        rows: [
          {
            name: "title",
            description: "错误边界捕获后显示的标题",
            type: "ReactNode",
            defaultValue: '"Something went wrong"',
          },
          {
            name: "description",
            description: "自定义说明；未提供时显示捕获到的 error.message",
            type: "ReactNode",
          },
          {
            name: "children",
            description: "受错误边界保护的 React 子树",
            type: "ReactNode",
          },
        ],
      },
    ],
    notes: (
      <div className="text-sm leading-relaxed text-muted-foreground">
        旧 primitive 的 <code>variant="destructive"</code> /{" "}
        <code>variant="default"</code> 不再是公共 Alert API；语义使用{" "}
        <code>type</code>，视觉使用 <code>variant</code>。当前 Ant Design
        已弃用的 message/onClose/afterClose/closeText/closeIcon 顶层别名不进入
        Gouno canonical API。
      </div>
    ),
  },
};
