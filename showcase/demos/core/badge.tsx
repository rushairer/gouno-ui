import { useState } from "react";
import { Bell, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, Badge, Button, IconButton, Space, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

function BasicBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge count={5}><Avatar><AvatarFallback>GU</AvatarFallback></Avatar></Badge>
    <Badge count={0} showZero><Button>消息</Button></Badge>
    <Badge count={100}><IconButton label="通知" icon={<Bell />} /></Badge>
    <Badge count="New"><Button>更新</Button></Badge>
  </Space>;
}

function DotBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge dot><Button>应用</Button></Badge>
    <Badge dot><Bell className="size-5" aria-label="通知" /></Badge>
    <Badge dot color="#7c3aed"><Avatar><AvatarFallback>AB</AvatarFallback></Avatar></Badge>
  </Space>;
}

function OverflowBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge count={99}><Avatar><AvatarFallback>99</AvatarFallback></Avatar></Badge>
    <Badge count={100}><Avatar><AvatarFallback>99+</AvatarFallback></Avatar></Badge>
    <Badge count={1000} overflowCount={999}><Avatar><AvatarFallback>999+</AvatarFallback></Avatar></Badge>
    <Badge count={0}><Button>隐藏零值</Button></Badge>
    <Badge count={0} showZero><Button>显示零值</Button></Badge>
  </Space>;
}

function StatusBadgeDemo() {
  return <Space wrap>
    <Badge status="success" text="Success" />
    <Badge status="processing" text="Processing" />
    <Badge status="default" text="Default" />
    <Badge status="error" text="Error" />
    <Badge status="warning" text="Warning" />
    <Badge color="#7c3aed" text="Custom" />
  </Space>;
}

function SizeAndOffsetBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge count={8}><Avatar><AvatarFallback>默认</AvatarFallback></Avatar></Badge>
    <Badge count={8} size="small"><Avatar><AvatarFallback>小</AvatarFallback></Avatar></Badge>
    <Badge count={8} offset={[-8, 8]}><Avatar><AvatarFallback>偏移</AvatarFallback></Avatar></Badge>
  </Space>;
}

function DynamicBadgeDemo() {
  const [count, setCount] = useState(5);
  return <Space orientation="vertical">
    <Badge count={count} showZero><Avatar><AvatarFallback>GU</AvatarFallback></Avatar></Badge>
    <Space>
      <IconButton label="减少计数" icon={<Minus />} onClick={() => setCount((value) => Math.max(0, value - 1))} />
      <IconButton label="增加计数" icon={<Plus />} onClick={() => setCount((value) => value + 1)} />
      <Button onClick={() => setCount(0)}>清零</Button>
    </Space>
    <Text tone="muted" aria-live="polite">当前计数：{count}</Text>
  </Space>;
}

export const badgeDocuments: Record<string, ComponentDocument> = {
  badge: {
    title: "Badge 徽标数",
    description: "用于通知计数、状态红点和运行状态。Badge 负责叠加提示；分类与状态胶囊请使用 Tag。",
    code: `function BasicBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge count={5}><Avatar><AvatarFallback>GU</AvatarFallback></Avatar></Badge>
    <Badge count={0} showZero><Button>消息</Button></Badge>
    <Badge count={100}><IconButton label="通知" icon={<Bell />} /></Badge>
    <Badge count="New"><Button>更新</Button></Badge>
  </Space>;
}`,
    render: () => <BasicBadgeDemo />,
    demos: [
      {
        title: "红点",
        description: "dot 只表达存在未读内容，不显示具体数量。",
        code: `function DotBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge dot><Button>应用</Button></Badge>
    <Badge dot><Bell className="size-5" aria-label="通知" /></Badge>
    <Badge dot color="#7c3aed"><Avatar><AvatarFallback>AB</AvatarFallback></Avatar></Badge>
  </Space>;
}`,
        render: () => <DotBadgeDemo />,
      },
      {
        title: "封顶数字与零值",
        description: "默认超过 99 显示 99+；overflowCount 可调整上限，showZero 控制是否显示零。",
        code: `function OverflowBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge count={99}><Avatar><AvatarFallback>99</AvatarFallback></Avatar></Badge>
    <Badge count={100}><Avatar><AvatarFallback>99+</AvatarFallback></Avatar></Badge>
    <Badge count={1000} overflowCount={999}><Avatar><AvatarFallback>999+</AvatarFallback></Avatar></Badge>
    <Badge count={0}><Button>隐藏零值</Button></Badge>
    <Badge count={0} showZero><Button>显示零值</Button></Badge>
  </Space>;
}`,
        render: () => <OverflowBadgeDemo />,
      },
      {
        title: "状态点",
        description: "五种语义状态和自定义颜色可独立显示，并可附带文本。",
        code: `function StatusBadgeDemo() {
  return <Space wrap>
    <Badge status="success" text="Success" />
    <Badge status="processing" text="Processing" />
    <Badge status="default" text="Default" />
    <Badge status="error" text="Error" />
    <Badge status="warning" text="Warning" />
    <Badge color="#7c3aed" text="Custom" />
  </Space>;
}`,
        render: () => <StatusBadgeDemo />,
      },
      {
        title: "尺寸与偏移",
        code: `function SizeAndOffsetBadgeDemo() {
  return <Space wrap className="items-center">
    <Badge count={8}><Avatar><AvatarFallback>默认</AvatarFallback></Avatar></Badge>
    <Badge count={8} size="small"><Avatar><AvatarFallback>小</AvatarFallback></Avatar></Badge>
    <Badge count={8} offset={[-8, 8]}><Avatar><AvatarFallback>偏移</AvatarFallback></Avatar></Badge>
  </Space>;
}`,
        render: () => <SizeAndOffsetBadgeDemo />,
      },
      {
        title: "动态计数",
        description: "计数由业务状态控制，更新后通过 aria-live 同步反馈。",
        code: `function DynamicBadgeDemo() {
  const [count, setCount] = useState(5);
  return <Space orientation="vertical">
    <Badge count={count} showZero><Avatar><AvatarFallback>GU</AvatarFallback></Avatar></Badge>
    <Space>
      <IconButton label="减少计数" icon={<Minus />} onClick={() => setCount((value) => Math.max(0, value - 1))} />
      <IconButton label="增加计数" icon={<Plus />} onClick={() => setCount((value) => value + 1)} />
      <Button onClick={() => setCount(0)}>清零</Button>
    </Space>
    <Text tone="muted" aria-live="polite">当前计数：{count}</Text>
  </Space>;
}`,
        render: () => <DynamicBadgeDemo />,
      },
    ],
    api: [
      { name: "count", description: "角标内容，数字超过上限时自动封顶", type: "ReactNode" },
      { name: "dot", description: "显示无数字的状态红点", type: "boolean", defaultValue: "false" },
      { name: "showZero", description: "count 为 0 时仍显示角标", type: "boolean", defaultValue: "false" },
      { name: "overflowCount", description: "数字角标的封顶值", type: "number", defaultValue: "99" },
      { name: "status", description: "独立状态点的语义状态", type: '"success" | "processing" | "default" | "error" | "warning"' },
      { name: "text", description: "状态点右侧的说明文本", type: "ReactNode" },
      { name: "color", description: "自定义角标或状态点颜色", type: "string" },
      { name: "size", description: "数字角标尺寸", type: '"default" | "small"', defaultValue: '"default"' },
      { name: "offset", description: "角标水平、垂直偏移", type: "[number, number]" },
      { name: "children", description: "角标所依附的元素", type: "ReactNode" },
    ],
  },
};
