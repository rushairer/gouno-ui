import { useState } from "react";
import { ArrowRight, Download, LoaderCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, Button, ButtonLink, Heading, Icon, IconButton, Kbd, Space, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

function ButtonTypesDemo() { const [action, setAction] = useState("尚未操作"); return <Space direction="vertical"><Space wrap><Button variant="primary" onClick={() => setAction("主要按钮")}>主要按钮</Button><Button variant="secondary" onClick={() => setAction("次要按钮")}>次要按钮</Button><Button variant="dashed" onClick={() => setAction("虚线按钮")}>虚线按钮</Button><Button variant="text" onClick={() => setAction("文本按钮")}>文本按钮</Button><Button variant="link" onClick={() => setAction("链接样式按钮")}>链接样式按钮</Button></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function DangerDemo() { const [action, setAction] = useState("尚未操作"); return <Space direction="vertical"><Space wrap><Button variant="danger" onClick={() => setAction("删除")}>删除</Button><Button variant="danger" disabled onClick={() => setAction("不应触发")}>危险禁用</Button><Button variant="ghost" onClick={() => setAction("取消")}>取消</Button></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function SizeDemo() { const [action, setAction] = useState("尚未操作"); return <Space direction="vertical"><Space wrap className="items-center"><Button size="small" onClick={() => setAction("Small")}>Small</Button><Button size="middle" onClick={() => setAction("Middle")}>Middle</Button><Button size="large" onClick={() => setAction("Large")}>Large</Button></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function IconDemo() { const [action, setAction] = useState("尚未操作"); return <Space direction="vertical"><Space wrap><Button variant="primary" icon={<Plus />} onClick={() => setAction("新建")}>新建</Button><Button icon={<ArrowRight />} iconPosition="right" onClick={() => setAction("下一步")}>下一步</Button><IconButton label="下载" icon={<Download />} onClick={() => setAction("下载")} /></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function LoadingDemo() { const [loading, setLoading] = useState(false); return <Space wrap><Button variant="primary" loading={loading} loadingText="保存中" onClick={() => setLoading(true)}>保存</Button><Button onClick={() => setLoading((value) => !value)}>{loading ? "停止加载" : "模拟加载"}</Button><Button disabled onClick={() => setLoading(true)}>禁用</Button></Space>; }
function ShapeDemo() { const [action, setAction] = useState("尚未操作"); return <Space direction="vertical" className="w-full"><Space wrap><Button shape="round" onClick={() => setAction("圆角按钮")}>圆角按钮</Button><IconButton shape="circle" label="新建" icon={<Plus />} onClick={() => setAction("单图标新建")} /></Space><Button variant="primary" block onClick={() => setAction("块级主要按钮")}>块级主要按钮</Button><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function LinkDemo() { const [action, setAction] = useState("尚未操作"); return <Space direction="vertical"><Space wrap><Button variant="link" onClick={() => setAction("打开帮助")}>操作型链接</Button><ButtonLink href="https://github.com/rushairer/gouno-ui" target="_blank" rel="noreferrer" onClick={() => setAction("访问 Gouno UI")}>访问 Gouno UI</ButtonLink><ButtonLink to="#core-typography" variant="primary" icon={<ArrowRight />} iconPosition="right" onClick={() => setAction("查看排版")}>查看排版</ButtonLink><ButtonLink to="#" disabled onClick={() => setAction("不应触发")}>禁用链接</ButtonLink></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }

export const generalDocuments: Record<string, ComponentDocument> = {
  button: {
    title: "Button 按钮",
    description: "触发操作或导航。支持类型、尺寸、图标、加载、形状、块级布局和真实链接语义。",
    code: `function ButtonTypesDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space direction="vertical">
    <Space wrap>
      <Button variant="primary" onClick={() => setAction("主要按钮")}>主要按钮</Button>
      <Button variant="secondary" onClick={() => setAction("次要按钮")}>次要按钮</Button>
      <Button variant="dashed" onClick={() => setAction("虚线按钮")}>虚线按钮</Button>
      <Button variant="text" onClick={() => setAction("文本按钮")}>文本按钮</Button>
      <Button variant="link" onClick={() => setAction("链接样式按钮")}>链接样式按钮</Button>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`,
    render: () => <ButtonTypesDemo />,
    demos: [
      { title: "危险与幽灵按钮", description: "危险操作使用 danger；低层级工具操作可使用 ghost。", code: `function DangerDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space direction="vertical">
    <Space wrap>
      <Button variant="danger" onClick={() => setAction("删除")}>删除</Button>
      <Button variant="danger" disabled onClick={() => setAction("不应触发")}>危险禁用</Button>
      <Button variant="ghost" onClick={() => setAction("取消")}>取消</Button>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <DangerDemo /> },
      { title: "三种尺寸", code: `function SizeDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space direction="vertical">
    <Space wrap className="items-center">
      <Button size="small" onClick={() => setAction("Small")}>Small</Button>
      <Button size="middle" onClick={() => setAction("Middle")}>Middle</Button>
      <Button size="large" onClick={() => setAction("Large")}>Large</Button>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <SizeDemo /> },
      { title: "图标与位置", description: "图标作为装饰时自动隐藏于辅助技术；纯图标按钮必须提供 label。", code: `function IconDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space direction="vertical">
    <Space wrap>
      <Button variant="primary" icon={<Plus />} onClick={() => setAction("新建")}>新建</Button>
      <Button icon={<ArrowRight />} iconPosition="right" onClick={() => setAction("下一步")}>下一步</Button>
      <IconButton label="下载" icon={<Download />} onClick={() => setAction("下载")} />
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <IconDemo /> },
      { title: "加载与禁用", code: `function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  return <Space wrap>
    <Button variant="primary" loading={loading} loadingText="保存中" onClick={() => setLoading(true)}>保存</Button>
    <Button onClick={() => setLoading(value => !value)}>{loading ? "停止加载" : "模拟加载"}</Button>
    <Button disabled onClick={() => setLoading(true)}>禁用</Button>
  </Space>;
}`, render: () => <LoadingDemo /> },
      { title: "形状与块级按钮", code: `function ShapeDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space direction="vertical" className="w-full">
    <Space wrap>
      <Button shape="round" onClick={() => setAction("圆角按钮")}>圆角按钮</Button>
      <IconButton shape="circle" label="新建" icon={<Plus />} onClick={() => setAction("单图标新建")} />
    </Space>
    <Button variant="primary" block onClick={() => setAction("块级主要按钮")}>块级主要按钮</Button>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <ShapeDemo /> },
      { title: "Link 模式", description: "Button variant=link 仍是操作按钮；页面导航应使用 ButtonLink，它会渲染真实链接并支持路由适配。", code: `function LinkDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space direction="vertical">
    <Space wrap>
      <Button variant="link" onClick={() => setAction("打开帮助")}>操作型链接</Button>
      <ButtonLink href="https://github.com/rushairer/gouno-ui" target="_blank" rel="noreferrer" onClick={() => setAction("访问 Gouno UI")}>访问 Gouno UI</ButtonLink>
      <ButtonLink to="#core-typography" variant="primary" icon={<ArrowRight />} iconPosition="right" onClick={() => setAction("查看排版")}>查看排版</ButtonLink>
      <ButtonLink to="#" disabled onClick={() => setAction("不应触发")}>禁用链接</ButtonLink>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <LinkDemo /> },
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
      { name: "onClick", description: "点击回调；禁用或加载时不会触发", type: "MouseEventHandler" },
    ],
  },
  icon: { title:"Icon 图标", description:"统一图标尺寸、旋转、加载动画和无障碍标签。", code:'<Icon icon={<LoaderCircle />} spin label="Loading" />', render:()=> <Space><Icon icon={<LoaderCircle/>}/><Icon icon={<LoaderCircle/>} spin label="Loading"/><Icon icon={<LoaderCircle/>} rotate={45}/></Space> },
  typography: { title: "Typography 排版", description: "统一标题、正文、辅助文字和语义色。", code: '<Heading level={2}>页面标题</Heading>\n<Text tone="muted">辅助说明</Text>', render: () => <Space direction="vertical"><Heading level={1}>一级标题</Heading><Heading level={2}>二级标题</Heading><Text size="lg">正文内容</Text><Text tone="muted">辅助说明</Text><Text tone="danger">错误提示</Text></Space> },
  kbd: { title: "Kbd 键盘按键", description: "表达键盘快捷键。", code: '<Kbd>⌘</Kbd><Kbd>K</Kbd>', render: () => <Space><Kbd>⌘</Kbd><Kbd>K</Kbd></Space> },
  avatar: { title: "Avatar 头像", description: "图片头像和文字回退。", code: '<Avatar><AvatarFallback>GU</AvatarFallback></Avatar>', render: () => <Avatar><AvatarFallback>GU</AvatarFallback></Avatar> }
};
