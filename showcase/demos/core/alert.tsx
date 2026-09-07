import { useState } from "react";
import { Megaphone, RotateCcw } from "lucide-react";
import { Alert, Button } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

function BasicAlerts() {
  return (
    <div className="grid w-full gap-3">
      <Alert type="success" title="操作成功" />
      <Alert type="info" title="有一条新的系统信息" />
      <Alert type="warning" title="配置即将过期" />
      <Alert type="error" title="保存失败，请检查输入" />
    </div>
  );
}

function DescriptionAlerts() {
  return (
    <div className="grid w-full gap-3">
      <Alert type="success" showIcon title="部署完成" description="生产环境已经切换到新版本，所有健康检查均通过。" />
      <Alert type="warning" showIcon title="需要关注" description="当前客户端拥有 admin scope，请确认它只分配给受信任服务。" />
    </div>
  );
}

function ClosableAlert() {
  const [key, setKey] = useState(0);
  const [status, setStatus] = useState("尚未关闭");
  return (
    <div className="grid w-full gap-3">
      <Alert
        key={key}
        type="info"
        showIcon
        title="可关闭通知"
        description="关闭完成后会触发 afterClose。"
        action={<Button size="small">查看详情</Button>}
        closable={{ "aria-label": "关闭通知", onClose: () => setStatus("正在关闭"), afterClose: () => setStatus("已关闭") }}
      />
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span aria-live="polite">{status}</span>
        <Button size="small" icon={<RotateCcw />} onClick={() => { setKey((value) => value + 1); setStatus("尚未关闭"); }}>重新显示</Button>
      </div>
    </div>
  );
}

function BannerVariants() {
  return (
    <div className="grid w-full gap-3 overflow-hidden rounded-lg border">
      <Alert banner title="计划维护：今晚 23:00–23:20" />
      <div className="grid gap-3 p-4">
        <Alert type="info" variant="outlined" showIcon title="Outlined" description="默认保留语义边框与轻量背景。" />
        <Alert type="warning" variant="filled" showIcon title="Filled" description="Filled 使用更明确的语义色背景。" />
      </div>
    </div>
  );
}

function SemanticStyles() {
  return (
    <Alert
      type="info"
      showIcon
      icon={<Megaphone />}
      title="Semantic DOM"
      description="classNames 与 styles 可以只定制指定语义区域，而无需依赖内部 DOM 层级。"
      classNames={{ title: "font-mono", actions: "self-center" }}
      styles={{ root: { maxWidth: 640 }, description: { maxWidth: 480 } }}
      action={<Button size="small">了解更多</Button>}
    />
  );
}

function BrokenWidget(): never {
  throw new Error("Widget render failed");
}

function ErrorBoundaryDemo() {
  const [broken, setBroken] = useState(false);
  const [key, setKey] = useState(0);
  return (
    <div className="grid w-full gap-3">
      <Alert.ErrorBoundary key={key} title="局部模块渲染失败">
        {broken ? <BrokenWidget /> : <div className="rounded-lg border p-4">模块运行正常。</div>}
      </Alert.ErrorBoundary>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setBroken(true)}>触发渲染错误</Button>
        <Button onClick={() => { setBroken(false); setKey((value) => value + 1); }}>重置边界</Button>
      </div>
    </div>
  );
}

const basicCode = `import { Alert } from "@gouno/ui/core";

export default function Example() {
  return (
    <div className="grid gap-3">
      <Alert type="success" title="操作成功" />
      <Alert type="info" title="有一条新的系统信息" />
      <Alert type="warning" title="配置即将过期" />
      <Alert type="error" title="保存失败，请检查输入" />
    </div>
  );
}`;

const descriptionCode = `<Alert
  type="success"
  showIcon
  title="部署完成"
  description="生产环境已经切换到新版本，所有健康检查均通过。"
/>`;

const closableCode = `<Alert
  type="info"
  showIcon
  title="可关闭通知"
  description="关闭完成后会触发 afterClose。"
  action={<Button size="small">查看详情</Button>}
  closable={{
    "aria-label": "关闭通知",
    onClose: () => console.log("closing"),
    afterClose: () => console.log("closed"),
  }}
/>`;

const bannerCode = `<>
  <Alert banner title="计划维护：今晚 23:00–23:20" />
  <Alert type="info" variant="outlined" showIcon title="Outlined" />
  <Alert type="warning" variant="filled" showIcon title="Filled" />
</>`;

const semanticCode = `<Alert
  type="info"
  showIcon
  icon={<Megaphone />}
  title="Semantic DOM"
  description="按语义区域定制。"
  classNames={{ title: "font-mono" }}
  styles={{ root: { maxWidth: 640 } }}
  action={<Button size="small">了解更多</Button>}
/>`;

const boundaryCode = `<Alert.ErrorBoundary title="局部模块渲染失败">
  <RiskyWidget />
</Alert.ErrorBoundary>`;

export const alertDocuments: Record<string, ComponentDocument> = {
  alert: {
    title: "Alert 警告提示",
    description: "页面内持续可见的重要反馈。API 采用当前 Ant Design 高层语义，同时保持 Gouno 的单一命名与 semantic token 约束。",
    code: basicCode,
    render: () => <BasicAlerts />,
    demos: [
      { title: "图标与辅助描述", description: "showIcon 控制语义图标；description 承载补充说明。", code: descriptionCode, render: () => <DescriptionAlerts /> },
      { title: "操作与关闭生命周期", description: "action 独立承载操作；closable 对象集中管理 close icon、onClose、afterClose 和 aria 属性。", code: closableCode, render: () => <ClosableAlert /> },
      { title: "Banner 与视觉变体", description: "banner 默认 warning + icon；variant 只表达 outlined/filled 视觉，不混入语义颜色。", code: bannerCode, render: () => <BannerVariants /> },
      { title: "自定义图标与 Semantic DOM", description: "classNames/styles 面向稳定语义区域，不要求消费者依赖内部节点结构。", code: semanticCode, render: () => <SemanticStyles /> },
      { title: "ErrorBoundary", description: "Alert.ErrorBoundary 将局部 React 渲染错误降级为 error Alert。", code: boundaryCode, render: () => <ErrorBoundaryDemo /> },
    ],
    api: [
      { name: "title", description: "主要提示内容", type: "ReactNode" },
      { name: "description", description: "补充说明内容", type: "ReactNode" },
      { name: "children", description: "可选自定义补充内容，位于 title/description 后；不是 title 的别名", type: "ReactNode" },
      { name: "type", description: "语义类型；banner 未显式指定时默认为 warning", type: '"success" | "info" | "warning" | "error"', defaultValue: '"info"' },
      { name: "showIcon", description: "是否显示语义图标；banner 默认 true", type: "boolean", defaultValue: "false" },
      { name: "icon", description: "自定义图标；仅在 showIcon 生效时显示", type: "ReactNode" },
      { name: "action", description: "右侧操作区域", type: "ReactNode" },
      { name: "closable", description: "关闭能力；对象形式集中配置关闭生命周期与可访问属性", type: "boolean | AlertClosableConfig", defaultValue: "false" },
      { name: "banner", description: "横幅模式；默认 warning + showIcon，并移除左右边框/圆角", type: "boolean", defaultValue: "false" },
      { name: "variant", description: "纯视觉形态，不承载语义颜色", type: '"outlined" | "filled"', defaultValue: '"outlined"' },
      { name: "classNames", description: "按 Semantic DOM key 设置类名，也可使用函数根据 resolved props 返回", type: "Partial<Record<AlertSemantic, string>> | function" },
      { name: "styles", description: "按 Semantic DOM key 设置内联样式，也可使用函数根据 resolved props 返回", type: "Partial<Record<AlertSemantic, CSSProperties>> | function" },
      { name: "className", description: "根节点附加类名；在 classNames.root 之后合并", type: "string" },
      { name: "style", description: "根节点标准 React style；在 styles.root 之后合并", type: "CSSProperties" },
    ],
    apiSections: [
      { title: "AlertClosableConfig", rows: [
        { name: "closeIcon", description: "自定义关闭图标", type: "ReactNode" },
        { name: "onClose", description: "点击关闭按钮时触发", type: "(event: MouseEvent<HTMLButtonElement>) => void" },
        { name: "afterClose", description: "退出过渡完成并卸载后触发", type: "() => void" },
        { name: "aria-*", description: "传给关闭按钮的标准 ARIA 属性", type: "React.AriaAttributes" },
      ]},
      { title: "Semantic DOM", description: "classNames/styles 的稳定 key。", rows: [
        { name: "root", description: "Alert 根节点", type: "semantic slot" },
        { name: "icon", description: "图标区域", type: "semantic slot" },
        { name: "section", description: "文本内容区域", type: "semantic slot" },
        { name: "title", description: "标题区域", type: "semantic slot" },
        { name: "description", description: "说明区域", type: "semantic slot" },
        { name: "actions", description: "操作区域", type: "semantic slot" },
        { name: "close", description: "关闭按钮", type: "semantic slot" },
      ]},
      { title: "Alert.ErrorBoundary", rows: [
        { name: "title", description: "错误边界捕获后显示的标题", type: "ReactNode", defaultValue: '"Something went wrong"' },
        { name: "description", description: "自定义说明；未提供时显示捕获到的 error.message", type: "ReactNode" },
        { name: "children", description: "受错误边界保护的 React 子树", type: "ReactNode" },
      ]},
    ],
    notes: <div className="text-sm leading-relaxed text-muted-foreground">旧 primitive 的 <code>variant="destructive"</code> / <code>variant="default"</code> 不再是公共 Alert API；语义使用 <code>type</code>，视觉使用 <code>variant</code>。当前 Ant Design 已弃用的 message/onClose/afterClose/closeText/closeIcon 顶层别名不进入 Gouno canonical API。</div>,
  },
};
