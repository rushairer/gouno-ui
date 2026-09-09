import { useState } from "react";
import { ArrowRight, Download, Plus } from "lucide-react";
import {
  Button,
  ButtonLink,
  ChoiceButton,
  IconButton,
  IconButtonLink,
  NavigationProvider,
  Space,
  Text,
  type LinkAdapterProps,
} from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

function DemoRouterLink({ to, ...props }: LinkAdapterProps) {
  return <a {...props} href={to} data-route={to} />;
}

function ButtonTypesDemo() {
  const [action, setAction] = useState("尚未操作");
  return (
    <Space orientation="vertical">
      <Space wrap>
        <Button variant="solid" color="primary" onClick={() => setAction("主要按钮")}>
          主要按钮
        </Button>
        <Button variant="outline" onClick={() => setAction("次要按钮")}>
          次要按钮
        </Button>
        <Button variant="dashed" onClick={() => setAction("虚线按钮")}>
          虚线按钮
        </Button>
        <Button variant="text" onClick={() => setAction("文本按钮")}>
          文本按钮
        </Button>
        <Button variant="link" onClick={() => setAction("操作型链接按钮")}>
          操作型链接
        </Button>
      </Space>
      <Text tone="muted" aria-live="polite">
        最近操作：{action}
      </Text>
    </Space>
  );
}

function StateDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Space orientation="vertical">
      <Space wrap className="items-center">
        <Button size="small">Small</Button>
        <Button size="middle">Middle</Button>
        <Button size="large">Large</Button>
        <Button variant="solid" color="error">
          危险操作
        </Button>
        <Button
          variant="solid"
          color="primary"
          loading={loading}
          loadingText="保存中"
          onClick={() => setLoading(true)}
        >
          保存
        </Button>
        <Button onClick={() => setLoading((value) => !value)}>
          {loading ? "结束加载" : "模拟加载"}
        </Button>
        <Button disabled>禁用</Button>
      </Space>
      <Button block shape="round">
        Block + Round
      </Button>
    </Space>
  );
}

function IconFamilyDemo() {
  return (
    <Space wrap>
      <Button variant="solid" color="primary" icon={<Plus />}>
        新建
      </Button>
      <Button icon={<ArrowRight />} iconPlacement="end">
        下一步
      </Button>
      <IconButton label="下载" icon={<Download />} />
      <IconButtonLink
        label="查看图标文档"
        icon={<ArrowRight />}
        to="#core-icon"
        variant="outline"
      />
    </Space>
  );
}

function NavigationDemo() {
  return (
    <NavigationProvider link={DemoRouterLink}>
      <Space wrap>
        <ButtonLink href="https://github.com/rushairer/gouno-ui" target="_blank" rel="noreferrer">
          外部链接
        </ButtonLink>
        <ButtonLink to="/settings" variant="solid" color="primary">
          路由链接
        </ButtonLink>
        <ButtonLink to="/locked" disabled>
          禁用链接
        </ButtonLink>
      </Space>
    </NavigationProvider>
  );
}

function ChoiceDemo() {
  const [selected, setSelected] = useState("preview");
  return (
    <Space wrap>
      <ChoiceButton selected={selected === "preview"} onClick={() => setSelected("preview")}>
        Preview
      </ChoiceButton>
      <ChoiceButton selected={selected === "code"} onClick={() => setSelected("code")}>
        Code
      </ChoiceButton>
    </Space>
  );
}

const buttonApi = [
  { name: "variant", description: "视觉形态", type: '"solid" | "outline" | "ghost" | "link" | "text" | "dashed"', defaultValue: '"outline"' },
  { name: "color", description: "语义色", type: '"default" | "primary" | "success" | "warning" | "error" | "info"', defaultValue: '"default"' },
  { name: "size", description: "按钮尺寸", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
  { name: "loading", description: "显示加载状态并禁止重复操作", type: "boolean", defaultValue: "false" },
  { name: "loadingText", description: "加载状态文案", type: "ReactNode" },
  { name: "icon", description: "按钮图标；作为装饰隐藏于辅助技术", type: "ReactNode" },
  { name: "iconPlacement", description: "图标逻辑位置", type: '"start" | "end"', defaultValue: '"start"' },
  { name: "shape", description: "按钮形状", type: '"default" | "round" | "circle"', defaultValue: '"default"' },
  { name: "block", description: "撑满父容器宽度", type: "boolean", defaultValue: "false" },
  { name: "ref", description: "原生 button ref", type: "Ref<HTMLButtonElement>" },
  { name: "disabled", description: "禁用操作", type: "boolean", defaultValue: "false" },
  { name: "type", description: "原生按钮类型", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
  { name: "onClick", description: "原生点击回调；disabled/loading 时不会触发", type: "MouseEventHandler<HTMLButtonElement>" },
];

const buttonLinkApi = [
  { name: "to", description: "路由目标；由 NavigationProvider 的 link adapter 消费", type: "string" },
  { name: "href", description: "默认 anchor 模式的链接目标", type: "string" },
  { name: "variant", description: "与 Button 相同的视觉形态", type: "ButtonVariant", defaultValue: '"link"' },
  { name: "color", description: "语义色", type: "ButtonColor", defaultValue: '"default"' },
  { name: "size", description: "链接按钮尺寸", type: "ButtonSize", defaultValue: '"middle"' },
  { name: "icon", description: "链接图标", type: "ReactNode" },
  { name: "iconPlacement", description: "图标逻辑位置", type: "ButtonIconPlacement", defaultValue: '"start"' },
  { name: "shape", description: "链接按钮形状", type: "ButtonShape", defaultValue: '"default"' },
  { name: "disabled", description: "阻止导航并移出 Tab 顺序", type: "boolean", defaultValue: "false" },
  { name: "loading", description: "显示加载状态并阻止导航", type: "boolean", defaultValue: "false" },
  { name: "loadingText", description: "加载状态文案", type: "ReactNode" },
  { name: "block", description: "撑满父容器宽度", type: "boolean", defaultValue: "false" },
  { name: "ref", description: "链接 adapter ref", type: "Ref<HTMLAnchorElement>" },
  { name: "target", description: "原生链接 target", type: "HTMLAttributeAnchorTarget" },
  { name: "rel", description: "原生链接 rel", type: "string" },
  { name: "onClick", description: "链接点击回调；disabled/loading 时不会触发", type: "MouseEventHandler<HTMLAnchorElement>" },
];

export const buttonDocuments: Record<string, ComponentDocument> = {
  button: {
    title: "Button 按钮",
    description:
      "Button family 区分操作与导航：Button 触发动作，ButtonLink/ IconButtonLink 保留真实链接语义，ChoiceButton 表达二态选择，NavigationProvider 负责路由适配。",
    code: `function ButtonTypesDemo() {
  const [action, setAction] = useState("尚未操作");
  return (
    <Space orientation="vertical">
      <Space wrap>
        <Button variant="solid" color="primary" onClick={() => setAction("主要按钮")}>主要按钮</Button>
        <Button variant="outline" onClick={() => setAction("次要按钮")}>次要按钮</Button>
        <Button variant="dashed" onClick={() => setAction("虚线按钮")}>虚线按钮</Button>
        <Button variant="text" onClick={() => setAction("文本按钮")}>文本按钮</Button>
        <Button variant="link" onClick={() => setAction("操作型链接按钮")}>操作型链接</Button>
      </Space>
      <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
    </Space>
  );
}`,
    render: () => <ButtonTypesDemo />,
    demos: [
      {
        title: "尺寸、语义状态与布局",
        code: `function StateDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Space orientation="vertical">
      <Space wrap className="items-center">
        <Button size="small">Small</Button>
        <Button size="middle">Middle</Button>
        <Button size="large">Large</Button>
        <Button variant="solid" color="error">危险操作</Button>
        <Button variant="solid" color="primary" loading={loading} loadingText="保存中" onClick={() => setLoading(true)}>保存</Button>
        <Button disabled>禁用</Button>
      </Space>
      <Button block shape="round">Block + Round</Button>
    </Space>
  );
}`,
        render: () => <StateDemo />,
      },
      {
        title: "IconButton 与 IconButtonLink",
        description: "纯图标操作必须提供 label；导航版本仍渲染真实链接且不产生空文本节点。",
        code: `<Space wrap>
  <Button variant="solid" color="primary" icon={<Plus />}>新建</Button>
  <Button icon={<ArrowRight />} iconPlacement="end">下一步</Button>
  <IconButton label="下载" icon={<Download />} />
  <IconButtonLink label="查看图标文档" icon={<ArrowRight />} to="#core-icon" variant="outline" />
</Space>`,
        render: () => <IconFamilyDemo />,
      },
      {
        title: "真实链接与路由适配",
        description: "页面导航使用 ButtonLink；NavigationProvider 只注入 link adapter，不承载应用状态。",
        code: `function RouterLink({ to, ...props }: LinkAdapterProps) {
  return <a {...props} href={to} data-route={to} />;
}

<NavigationProvider link={RouterLink}>
  <Space wrap>
    <ButtonLink href="https://github.com/rushairer/gouno-ui" target="_blank" rel="noreferrer">外部链接</ButtonLink>
    <ButtonLink to="/settings" variant="solid" color="primary">路由链接</ButtonLink>
    <ButtonLink to="/locked" disabled>禁用链接</ButtonLink>
  </Space>
</NavigationProvider>`,
        render: () => <NavigationDemo />,
      },
      {
        title: "ChoiceButton 二态选择",
        description: "selected 映射 aria-pressed；选择状态仍由业务持有。",
        code: `function ChoiceDemo() {
  const [selected, setSelected] = useState("preview");
  return (
    <Space wrap>
      <ChoiceButton selected={selected === "preview"} onClick={() => setSelected("preview")}>Preview</ChoiceButton>
      <ChoiceButton selected={selected === "code"} onClick={() => setSelected("code")}>Code</ChoiceButton>
    </Space>
  );
}`,
        render: () => <ChoiceDemo />,
      },
    ],
    api: buttonApi,
    apiSections: [
      {
        title: "ButtonLink API",
        description: "其余原生 anchor 属性继续透传。",
        rows: buttonLinkApi,
      },
      {
        title: "IconButton API",
        rows: [
          { name: "label", description: "必填可访问名称，同时作为 title", type: "string" },
          { name: "icon", description: "纯图标内容", type: "ReactNode" },
          { name: "...ButtonProps", description: "除 children/icon 外继承 Button 能力", type: 'Omit<ButtonProps, "children" | "icon">' },
        ],
      },
      {
        title: "IconButtonLink API",
        rows: [
          { name: "label", description: "必填可访问名称，同时作为 title", type: "string" },
          { name: "icon", description: "纯图标链接内容", type: "ReactNode" },
          { name: "...ButtonLinkProps", description: "继承 ButtonLink 导航能力", type: "ButtonLinkProps" },
        ],
      },
      {
        title: "ChoiceButton API",
        rows: [
          { name: "selected", description: "选中状态，映射 aria-pressed", type: "boolean", defaultValue: "false" },
          { name: "...ButtonProps", description: "继承 Button 操作能力", type: "ButtonProps" },
        ],
      },
      {
        title: "NavigationProvider API",
        rows: [
          { name: "link", description: "接收 to 的路由 Link adapter", type: "ComponentType<LinkAdapterProps>" },
          { name: "children", description: "需要共享路由 adapter 的子树", type: "ReactNode" },
        ],
      },
    ],
  },
};
