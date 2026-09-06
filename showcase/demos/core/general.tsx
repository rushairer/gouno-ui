import { LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, Badge, Button, Heading, Icon, Kbd, Space, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
export const generalDocuments: Record<string, ComponentDocument> = {
  button: { title: "Button 按钮", description: "触发操作的基础按钮，支持变体、尺寸、图标和加载状态。", code: '<Button variant="primary">保存</Button>\n<Button loading>提交中</Button>', render: () => <Space wrap><Button variant="primary">主要按钮</Button><Button variant="secondary">次要按钮</Button><Button variant="danger">危险按钮</Button><Button loading>加载中</Button><Button disabled>禁用</Button></Space> },
  icon: { title:"Icon 图标", description:"统一图标尺寸、旋转、加载动画和无障碍标签。", code:'<Icon icon={<LoaderCircle />} spin label="Loading" />', render:()=> <Space><Icon icon={<LoaderCircle/>}/><Icon icon={<LoaderCircle/>} spin label="Loading"/><Icon icon={<LoaderCircle/>} rotate={45}/></Space> },
  typography: { title: "Typography 排版", description: "统一标题、正文、辅助文字和语义色。", code: '<Heading level={2}>页面标题</Heading>\n<Text tone="muted">辅助说明</Text>', render: () => <Space direction="vertical"><Heading level={1}>一级标题</Heading><Heading level={2}>二级标题</Heading><Text size="lg">正文内容</Text><Text tone="muted">辅助说明</Text><Text tone="danger">错误提示</Text></Space> },
  kbd: { title: "Kbd 键盘按键", description: "表达键盘快捷键。", code: '<Kbd>⌘</Kbd><Kbd>K</Kbd>', render: () => <Space><Kbd>⌘</Kbd><Kbd>K</Kbd></Space> },
  badge: { title: "Badge / Tag 标签", description: "状态和分类的紧凑视觉标记。", code: '<Badge tone="success">已发布</Badge>', render: () => <Space wrap><Badge>默认</Badge><Badge tone="brand">品牌</Badge><Badge tone="success">成功</Badge><Badge tone="warning">警告</Badge><Badge tone="danger">危险</Badge></Space> },
  avatar: { title: "Avatar 头像", description: "图片头像和文字回退。", code: '<Avatar><AvatarFallback>GU</AvatarFallback></Avatar>', render: () => <Avatar><AvatarFallback>GU</AvatarFallback></Avatar> }
};
