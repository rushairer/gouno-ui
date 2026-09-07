import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button, CheckableTag, Space, Tag, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

function BasicTagDemo() {
  return <Space wrap>
    <Tag>Default</Tag>
    <Tag color="primary">Brand</Tag>
    <Tag color="success">Success</Tag>
    <Tag color="warning">Warning</Tag>
    <Tag color="error">Danger</Tag>
    <Tag color="info">Info</Tag>
  </Space>;
}

function ColorTagDemo() {
  return <Space wrap>
    <Tag color="#1677ff">Blue</Tag>
    <Tag color="#722ed1">Purple</Tag>
    <Tag color="#eb2f96">Magenta</Tag>
    <Tag color="#fa8c16">Orange</Tag>
  </Space>;
}

function IconTagDemo() {
  return <Space wrap>
    <Tag icon={<Check />} color="success">Verified</Tag>
    <Tag icon={<Plus />} color="primary">New</Tag>
    <Tag color="warning" bordered={false}>Borderless</Tag>
  </Space>;
}

function ClosableTagDemo() {
  const [visible, setVisible] = useState(true);
  const [action, setAction] = useState("尚未关闭");
  return <Space orientation="vertical">
    <Space wrap>
      {visible ? <Tag closable onClose={() => { setVisible(false); setAction("已关闭 Release 标签"); }}>Release</Tag> : <Button size="small" onClick={() => { setVisible(true); setAction("已恢复 Release 标签"); }}>恢复标签</Button>}
      <Tag closable closeIcon={<span aria-hidden="true">×</span>} onClose={() => setAction("点击了自定义关闭按钮")}>Custom close icon</Tag>
      <Tag closable disabled onClose={() => setAction("不应触发")}>Disabled</Tag>
    </Space>
    <Text tone="muted" aria-live="polite">{action}</Text>
  </Space>;
}

const topicOptions = ["Movies", "Books", "Music"];
function CheckableTagDemo() {
  const [selected, setSelected] = useState(["Movies"]);
  return <Space orientation="vertical">
    <Space wrap>
      {topicOptions.map((topic) => <CheckableTag key={topic} checked={selected.includes(topic)} onChange={(checked) => setSelected((current) => checked ? [...current, topic] : current.filter((item) => item !== topic))}>{topic}</CheckableTag>)}
      <CheckableTag disabled defaultChecked>Disabled</CheckableTag>
    </Space>
    <Text tone="muted" aria-live="polite">已选择：{selected.join("、") || "无"}</Text>
  </Space>;
}

function UncontrolledTagDemo() {
  const [action, setAction] = useState("点击标签切换状态");
  return <Space orientation="vertical">
    <CheckableTag defaultChecked onChange={(checked) => setAction(checked ? "已选中 TypeScript" : "已取消 TypeScript")}>TypeScript</CheckableTag>
    <Text tone="muted" aria-live="polite">{action}</Text>
  </Space>;
}

export const tagDocuments: Record<string, ComponentDocument> = {
  tag: {
    title: "Tag 标签",
    description: "用于分类、属性和可选条件。支持语义色、自定义颜色、图标、关闭、无边框与受控或非受控选择。",
    code: `function BasicTagDemo() {
  return <Space wrap>
    <Tag>Default</Tag>
    <Tag color="primary">Brand</Tag>
    <Tag color="success">Success</Tag>
    <Tag color="warning">Warning</Tag>
    <Tag color="error">Danger</Tag>
    <Tag color="info">Info</Tag>
  </Space>;
}`,
    render: () => <BasicTagDemo />,
    demos: [
      {
        title: "自定义颜色",
        code: `function ColorTagDemo() {
  return <Space wrap>
    <Tag color="#1677ff">Blue</Tag>
    <Tag color="#722ed1">Purple</Tag>
    <Tag color="#eb2f96">Magenta</Tag>
    <Tag color="#fa8c16">Orange</Tag>
  </Space>;
}`,
        render: () => <ColorTagDemo />,
      },
      {
        title: "图标与无边框",
        code: `function IconTagDemo() {
  return <Space wrap>
    <Tag icon={<Check />} color="success">Verified</Tag>
    <Tag icon={<Plus />} color="primary">New</Tag>
    <Tag color="warning" bordered={false}>Borderless</Tag>
  </Space>;
}`,
        render: () => <IconTagDemo />,
      },
      {
        title: "可关闭标签",
        description: "onClose 负责同步业务状态；disabled 会禁止关闭操作。",
        code: `function ClosableTagDemo() {
  const [visible, setVisible] = useState(true);
  const [action, setAction] = useState("尚未关闭");
  return <Space orientation="vertical">
    <Space wrap>
      {visible ? <Tag closable onClose={() => { setVisible(false); setAction("已关闭 Release 标签"); }}>Release</Tag> : <Button size="small" onClick={() => { setVisible(true); setAction("已恢复 Release 标签"); }}>恢复标签</Button>}
      <Tag closable closeIcon={<span aria-hidden="true">×</span>} onClose={() => setAction("点击了自定义关闭按钮")}>Custom close icon</Tag>
      <Tag closable disabled onClose={() => setAction("不应触发")}>Disabled</Tag>
    </Space>
    <Text tone="muted" aria-live="polite">{action}</Text>
  </Space>;
}`,
        render: () => <ClosableTagDemo />,
      },
      {
        title: "受控可选标签",
        description: "CheckableTag 使用 checked 与 onChange 管理筛选条件。",
        code: `const topicOptions = ["Movies", "Books", "Music"];
function CheckableTagDemo() {
  const [selected, setSelected] = useState(["Movies"]);
  return <Space orientation="vertical">
    <Space wrap>
      {topicOptions.map((topic) => <CheckableTag key={topic} checked={selected.includes(topic)} onChange={(checked) => setSelected((current) => checked ? [...current, topic] : current.filter((item) => item !== topic))}>{topic}</CheckableTag>)}
      <CheckableTag disabled defaultChecked>Disabled</CheckableTag>
    </Space>
    <Text tone="muted" aria-live="polite">已选择：{selected.join("、") || "无"}</Text>
  </Space>;
}`,
        render: () => <CheckableTagDemo />,
      },
      {
        title: "非受控可选标签",
        code: `function UncontrolledTagDemo() {
  const [action, setAction] = useState("点击标签切换状态");
  return <Space orientation="vertical">
    <CheckableTag defaultChecked onChange={(checked) => setAction(checked ? "已选中 TypeScript" : "已取消 TypeScript")}>TypeScript</CheckableTag>
    <Text tone="muted" aria-live="polite">{action}</Text>
  </Space>;
}`,
        render: () => <UncontrolledTagDemo />,
      },
    ],
    api: [
      { name: "color", description: "语义色或自定义 CSS 背景色", type: 'TagColor | string', defaultValue: '"default"' },
      { name: "icon", description: "标签前置图标", type: "ReactNode" },
      { name: "bordered", description: "是否显示边框", type: "boolean", defaultValue: "true" },
      { name: "closable", description: "是否显示关闭按钮", type: "boolean", defaultValue: "false" },
      { name: "closeIcon", description: "自定义关闭图标", type: "ReactNode" },
      { name: "onClose", description: "点击关闭按钮时触发", type: "(event: MouseEvent<HTMLButtonElement>) => void" },
      { name: "checkable", description: "启用可选标签行为；也可直接使用 CheckableTag", type: "boolean", defaultValue: "false" },
      { name: "checked", description: "受控选中状态", type: "boolean" },
      { name: "defaultChecked", description: "非受控初始选中状态", type: "boolean", defaultValue: "false" },
      { name: "onChange", description: "可选标签状态变化回调", type: "(checked: boolean) => void" },
      { name: "disabled", description: "禁止选择与关闭", type: "boolean", defaultValue: "false" },
    ],
  },
};
