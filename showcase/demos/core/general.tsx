import { ArrowRight, Download, LoaderCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, Badge, Button, ButtonLink, Heading, Icon, IconButton, Kbd, Space, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
export const generalDocuments: Record<string, ComponentDocument> = {
  button: {
    title: "Button 按钮",
    description: "触发操作或导航。支持类型、尺寸、图标、加载、形状、块级布局和真实链接语义。",
    code: '<Button variant="primary">主要按钮</Button>\n<Button variant="secondary">次要按钮</Button>',
    render: () => <Space wrap><Button variant="primary">主要按钮</Button><Button variant="secondary">次要按钮</Button><Button variant="dashed">虚线按钮</Button><Button variant="text">文本按钮</Button><Button variant="link">链接样式按钮</Button></Space>,
    demos: [
      { title: "危险与幽灵按钮", description: "危险操作使用 danger；低层级工具操作可使用 ghost。", code: '<Button variant="danger">删除</Button>\n<Button variant="ghost">取消</Button>', render: () => <Space wrap><Button variant="danger">删除</Button><Button variant="danger" disabled>危险禁用</Button><Button variant="ghost">幽灵按钮</Button></Space> },
      { title: "三种尺寸", code: '<Button size="small">Small</Button>\n<Button size="middle">Middle</Button>\n<Button size="large">Large</Button>', render: () => <Space wrap className="items-center"><Button size="small">Small</Button><Button size="middle">Middle</Button><Button size="large">Large</Button></Space> },
      { title: "图标与位置", description: "图标作为装饰时自动隐藏于辅助技术；纯图标按钮必须提供 label。", code: '<Button icon={<Plus />}>新建</Button>\n<Button icon={<ArrowRight />} iconPosition="right">下一步</Button>\n<IconButton label="下载" icon={<Download />} />', render: () => <Space wrap><Button variant="primary" icon={<Plus />}>新建</Button><Button icon={<ArrowRight />} iconPosition="right">下一步</Button><IconButton label="下载" icon={<Download />} /></Space> },
      { title: "加载与禁用", code: '<Button loading loadingText="保存中">保存</Button>\n<Button disabled>禁用</Button>', render: () => <Space wrap><Button variant="primary" loading loadingText="保存中">保存</Button><Button loading>加载中</Button><Button disabled>禁用</Button></Space> },
      { title: "形状与块级按钮", code: '<Button shape="round">圆角按钮</Button>\n<Button shape="circle" icon={<Plus />} aria-label="新建" />\n<Button block>块级按钮</Button>', render: () => <Space direction="vertical" className="w-full"><Space wrap><Button shape="round">圆角按钮</Button><IconButton shape="circle" label="新建" icon={<Plus />} /></Space><Button variant="primary" block>块级主要按钮</Button></Space> },
      { title: "Link 模式", description: "Button variant=link 仍是操作按钮；页面导航应使用 ButtonLink，它会渲染真实链接并支持路由适配。", code: '<Button variant="link" onClick={openHelp}>操作型链接</Button>\n<ButtonLink href="https://gouno.com" target="_blank">访问 Gouno</ButtonLink>\n<ButtonLink to="/docs" variant="primary">查看文档</ButtonLink>', render: () => <Space wrap><Button variant="link">操作型链接</Button><ButtonLink href="https://gouno.com" target="_blank" rel="noreferrer">访问 Gouno</ButtonLink><ButtonLink to="#core-typography" variant="primary" icon={<ArrowRight />} iconPosition="right">查看排版</ButtonLink><ButtonLink to="#" disabled>禁用链接</ButtonLink></Space> },
    ],
    api: [
      { name: "variant", description: "视觉类型", type: '"primary" | "secondary" | "dashed" | "danger" | "ghost" | "text" | "link"', defaultValue: '"secondary"' },
      { name: "size", description: "按钮尺寸及兼容别名", type: '"small" | "middle" | "large" | "icon"', defaultValue: '"middle"' },
      { name: "loading", description: "显示加载图标并禁止重复操作", type: "boolean", defaultValue: "false" },
      { name: "loadingText", description: "加载状态文案", type: "ReactNode" },
      { name: "icon", description: "按钮图标", type: "ReactNode" },
      { name: "iconPosition", description: "图标位置", type: '"left" | "right"', defaultValue: '"left"' },
      { name: "shape", description: "按钮形状", type: '"default" | "round" | "circle"', defaultValue: '"default"' },
      { name: "block", description: "撑满父容器宽度", type: "boolean", defaultValue: "false" },
      { name: "disabled", description: "禁用操作", type: "boolean", defaultValue: "false" },
      { name: "type", description: "原生按钮类型", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
      { name: "href / to", description: "ButtonLink 的外部链接或路由目标", type: "string" },
    ],
  },
  icon: { title:"Icon 图标", description:"统一图标尺寸、旋转、加载动画和无障碍标签。", code:'<Icon icon={<LoaderCircle />} spin label="Loading" />', render:()=> <Space><Icon icon={<LoaderCircle/>}/><Icon icon={<LoaderCircle/>} spin label="Loading"/><Icon icon={<LoaderCircle/>} rotate={45}/></Space> },
  typography: { title: "Typography 排版", description: "统一标题、正文、辅助文字和语义色。", code: '<Heading level={2}>页面标题</Heading>\n<Text tone="muted">辅助说明</Text>', render: () => <Space direction="vertical"><Heading level={1}>一级标题</Heading><Heading level={2}>二级标题</Heading><Text size="lg">正文内容</Text><Text tone="muted">辅助说明</Text><Text tone="danger">错误提示</Text></Space> },
  kbd: { title: "Kbd 键盘按键", description: "表达键盘快捷键。", code: '<Kbd>⌘</Kbd><Kbd>K</Kbd>', render: () => <Space><Kbd>⌘</Kbd><Kbd>K</Kbd></Space> },
  badge: { title: "Badge / Tag 标签", description: "状态和分类的紧凑视觉标记。", code: '<Badge tone="success">已发布</Badge>', render: () => <Space wrap><Badge>默认</Badge><Badge tone="brand">品牌</Badge><Badge tone="success">成功</Badge><Badge tone="warning">警告</Badge><Badge tone="danger">危险</Badge></Space> },
  avatar: { title: "Avatar 头像", description: "图片头像和文字回退。", code: '<Avatar><AvatarFallback>GU</AvatarFallback></Avatar>', render: () => <Avatar><AvatarFallback>GU</AvatarFallback></Avatar> }
};
