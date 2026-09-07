import { useState } from "react";
import { Bell, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, Badge, Button, IconButton, Space, Text } from "../../../../src/core";

export default function BadgeDemo() {
  const [count, setCount] = useState(5);
  return (
    <Space orientation="vertical" gap="lg" className="w-full">
      <Space wrap align="center">
        <Badge count={count} showZero><Avatar><AvatarFallback>GU</AvatarFallback></Avatar></Badge>
        <Badge count={0} showZero><Button>显示零值</Button></Badge>
        <Badge count={100}><Button>默认封顶</Button></Badge>
        <Badge count={1000} overflowCount={999}><Button>自定义封顶</Button></Badge>
        <Badge count="New"><Button>文本角标</Button></Badge>
      </Space>
      <Space wrap align="center">
        <Badge dot><Button>未读</Button></Badge>
        <Badge dot color="#7c3aed"><IconButton label="通知" icon={<Bell />} /></Badge>
        <Badge status="success" text="Success" />
        <Badge status="processing" text="Processing" />
        <Badge status="warning" text="Warning" />
        <Badge status="error" text="Error" />
      </Space>
      <Space wrap align="center">
        <Badge count={8}><Avatar><AvatarFallback>默认</AvatarFallback></Avatar></Badge>
        <Badge count={8} size="small"><Avatar><AvatarFallback>小</AvatarFallback></Avatar></Badge>
        <Badge count={8} offset={[-8, 8]}><Avatar><AvatarFallback>偏移</AvatarFallback></Avatar></Badge>
      </Space>
      <Space align="center">
        <IconButton label="减少计数" icon={<Minus />} onClick={() => setCount((value) => Math.max(0, value - 1))} />
        <IconButton label="增加计数" icon={<Plus />} onClick={() => setCount((value) => value + 1)} />
        <Text tone="muted" aria-live="polite">当前计数：{count}</Text>
      </Space>
    </Space>
  );
}
