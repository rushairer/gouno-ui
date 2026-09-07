import { useState } from "react";
import { ArrowRight, Download, LoaderCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, Button, ButtonLink, Icon, IconButton, Kbd, Space, Spinner, Text, Typography } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import CardExample from "./card/card-0";
import CardExampleSource from "./card/card-0.tsx?raw";
import TypographyExample from "./typography/typography-0";
import TypographyExampleSource from "./typography/typography-0.tsx?raw";

function ButtonTypesDemo() { const [action, setAction] = useState("尚未操作"); return <Space orientation="vertical"><Space wrap><Button variant="solid" color="primary" onClick={() => setAction("主要按钮")}>主要按钮</Button><Button variant="outline" onClick={() => setAction("次要按钮")}>次要按钮</Button><Button variant="dashed" onClick={() => setAction("虚线按钮")}>虚线按钮</Button><Button variant="text" onClick={() => setAction("文本按钮")}>文本按钮</Button><Button variant="link" onClick={() => setAction("链接样式按钮")}>链接样式按钮</Button></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function DangerDemo() { const [action, setAction] = useState("尚未操作"); return <Space orientation="vertical"><Space wrap><Button variant="solid" color="error" onClick={() => setAction("删除")}>删除</Button><Button variant="solid" color="error" disabled onClick={() => setAction("不应触发")}>危险禁用</Button><Button variant="ghost" onClick={() => setAction("取消")}>取消</Button></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function SizeDemo() { const [action, setAction] = useState("尚未操作"); return <Space orientation="vertical"><Space wrap className="items-center"><Button size="small" onClick={() => setAction("Small")}>Small</Button><Button size="middle" onClick={() => setAction("Middle")}>Middle</Button><Button size="large" onClick={() => setAction("Large")}>Large</Button></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function IconDemo() { const [action, setAction] = useState("尚未操作"); return <Space orientation="vertical"><Space wrap><Button variant="solid" color="primary" icon={<Plus />} onClick={() => setAction("新建")}>新建</Button><Button icon={<ArrowRight />} iconPlacement="end" onClick={() => setAction("下一步")}>下一步</Button><IconButton label="下载" icon={<Download />} onClick={() => setAction("下载")} /></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function LoadingDemo() { const [loading, setLoading] = useState(false); return <Space wrap><Button variant="solid" color="primary" loading={loading} loadingText="保存中" onClick={() => setLoading(true)}>保存</Button><Button onClick={() => setLoading((value) => !value)}>{loading ? "停止加载" : "模拟加载"}</Button><Button disabled onClick={() => setLoading(true)}>禁用</Button></Space>; }
function ShapeDemo() { const [action, setAction] = useState("尚未操作"); return <Space orientation="vertical" className="w-full"><Space wrap><Button shape="round" onClick={() => setAction("圆角按钮")}>圆角按钮</Button><IconButton shape="circle" label="新建" icon={<Plus />} onClick={() => setAction("单图标新建")} /></Space><Button variant="solid" color="primary" block onClick={() => setAction("块级主要按钮")}>块级主要按钮</Button><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }
function LinkDemo() { const [action, setAction] = useState("尚未操作"); return <Space orientation="vertical"><Space wrap><Button variant="link" onClick={() => setAction("打开帮助")}>操作型链接</Button><ButtonLink href="https://github.com/rushairer/gouno-ui" target="_blank" rel="noreferrer" onClick={() => setAction("访问 Gouno UI")}>访问 Gouno UI</ButtonLink><ButtonLink to="#core-typography" variant="solid" color="primary" icon={<ArrowRight />} iconPlacement="end" onClick={() => setAction("查看排版")}>查看排版</ButtonLink><ButtonLink to="#" disabled onClick={() => setAction("不应触发")}>禁用链接</ButtonLink></Space><Text tone="muted" aria-live="polite">最近操作：{action}</Text></Space>; }

export const generalDocuments: Record<string, ComponentDocument> = {
  button: {
    title: "Button 按钮",
    description: "触发操作或导航。支持类型、尺寸、图标、加载、形状、块级布局和真实链接语义。",
    code: `function ButtonTypesDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space orientation="vertical">
    <Space wrap>
      <Button variant="solid" color="primary" onClick={() => setAction("主要按钮")}>主要按钮</Button>
      <Button variant="outline" onClick={() => setAction("次要按钮")}>次要按钮</Button>
      <Button variant="dashed" onClick={() => setAction("虚线按钮")}>虚线按钮</Button>
      <Button variant="text" onClick={() => setAction("文本按钮")}>文本按钮</Button>
      <Button variant="link" onClick={() => setAction("链接样式按钮")}>链接样式按钮</Button>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`,
    render: () => <ButtonTypesDemo />,
    demos: [
      { title: "危险与幽灵按钮", description: "危险操作使用 color=error；低层级工具操作可使用 ghost。", code: `function DangerDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space orientation="vertical">
    <Space wrap>
      <Button variant="solid" color="error" onClick={() => setAction("删除")}>删除</Button>
      <Button variant="solid" color="error" disabled onClick={() => setAction("不应触发")}>危险禁用</Button>
      <Button variant="ghost" onClick={() => setAction("取消")}>取消</Button>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <DangerDemo /> },
      { title: "三种尺寸", code: `function SizeDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space orientation="vertical">
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
  return <Space orientation="vertical">
    <Space wrap>
      <Button variant="solid" color="primary" icon={<Plus />} onClick={() => setAction("新建")}>新建</Button>
      <Button icon={<ArrowRight />} iconPlacement="end" onClick={() => setAction("下一步")}>下一步</Button>
      <IconButton label="下载" icon={<Download />} onClick={() => setAction("下载")} />
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <IconDemo /> },
      { title: "加载与禁用", code: `function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  return <Space wrap>
    <Button variant="solid" color="primary" loading={loading} loadingText="保存中" onClick={() => setLoading(true)}>保存</Button>
    <Button onClick={() => setLoading(value => !value)}>{loading ? "停止加载" : "模拟加载"}</Button>
    <Button disabled onClick={() => setLoading(true)}>禁用</Button>
  </Space>;
}`, render: () => <LoadingDemo /> },
      { title: "形状与块级按钮", code: `function ShapeDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space orientation="vertical" className="w-full">
    <Space wrap>
      <Button shape="round" onClick={() => setAction("圆角按钮")}>圆角按钮</Button>
      <IconButton shape="circle" label="新建" icon={<Plus />} onClick={() => setAction("单图标新建")} />
    </Space>
    <Button variant="solid" color="primary" block onClick={() => setAction("块级主要按钮")}>块级主要按钮</Button>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <ShapeDemo /> },
      { title: "Link 模式", description: "Button variant=link 仍是操作按钮；页面导航应使用 ButtonLink，它会渲染真实链接并支持路由适配。", code: `function LinkDemo() {
  const [action, setAction] = useState("尚未操作");
  return <Space orientation="vertical">
    <Space wrap>
      <Button variant="link" onClick={() => setAction("打开帮助")}>操作型链接</Button>
      <ButtonLink href="https://github.com/rushairer/gouno-ui" target="_blank" rel="noreferrer" onClick={() => setAction("访问 Gouno UI")}>访问 Gouno UI</ButtonLink>
      <ButtonLink to="#core-typography" variant="solid" color="primary" icon={<ArrowRight />} iconPlacement="end" onClick={() => setAction("查看排版")}>查看排版</ButtonLink>
      <ButtonLink to="#" disabled onClick={() => setAction("不应触发")}>禁用链接</ButtonLink>
    </Space>
    <Text tone="muted" aria-live="polite">最近操作：{action}</Text>
  </Space>;
}`, render: () => <LinkDemo /> },
    ],
    api: [
      { name: "variant", description: "视觉形态", type: '"solid" | "outline" | "ghost" | "link" | "text" | "dashed"', defaultValue: '"outline"' },
      { name: "color", description: "语义色", type: '"default" | "primary" | "success" | "warning" | "error" | "info"', defaultValue: '"default"' },
      { name: "size", description: "按钮尺寸", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
      { name: "loading", description: "显示加载图标并禁止重复操作", type: "boolean", defaultValue: "false" },
      { name: "loadingText", description: "加载状态文案", type: "ReactNode" },
      { name: "icon", description: "按钮图标", type: "ReactNode" },
      { name: "iconPlacement", description: "图标逻辑位置", type: '"start" | "end"', defaultValue: '"start"' },
      { name: "shape", description: "按钮形状", type: '"default" | "round" | "circle"', defaultValue: '"default"' },
      { name: "block", description: "撑满父容器宽度", type: "boolean", defaultValue: "false" },
      { name: "disabled", description: "禁用操作", type: "boolean", defaultValue: "false" },
      { name: "type", description: "原生按钮类型", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
      { name: "href", description: "ButtonLink 的外部链接目标", type: "string" },
      { name: "to", description: "ButtonLink 的路由目标", type: "string" },
      { name: "onClick", description: "点击回调；禁用或加载时不会触发", type: "MouseEventHandler" },
    ],
  },
  icon: { title:"Icon 图标", description:"统一图标尺寸、旋转、加载动画和无障碍标签。", code:'<Icon icon={<LoaderCircle />} spin label="Loading" />', render:()=> <Space><Icon icon={<LoaderCircle/>}/><Icon icon={<LoaderCircle/>} spin label="Loading"/><Icon icon={<LoaderCircle/>} rotate={45}/></Space> },
  typography: { title: "Typography 排版", description: "统一标题、正文、辅助文字和语义色；as 只改变宿主语义，不改变视觉 token。", code: TypographyExampleSource.replaceAll("../../../../src/core", "@gouno/ui/core"), render: () => <TypographyExample />, apiSections: [{ title: "Heading API", rows: [{ name: "level", description: "标题级别，映射 h1-h6", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "2" }, { name: "children", description: "标题内容", type: "ReactNode" }, { name: "className", description: "h1-h6 样式类", type: "string" }] }, { title: "Text API", rows: [{ name: "as", description: "宿主元素或组件", type: "ElementType", defaultValue: '"p"' }, { name: "size", description: "文字尺寸", type: '"xs" | "sm" | "md" | "lg"', defaultValue: '"md"' }, { name: "tone", description: "语义色调", type: '"default" | "muted" | "danger" | "success"', defaultValue: '"default"' }, { name: "children", description: "文本内容", type: "ReactNode" }, { name: "className", description: "宿主样式类", type: "string" }] }] },
  kbd: { title: "Kbd 键盘按键", description: "表达键盘快捷键，宿主为原生 kbd。", code: '<Space><Kbd>⌘</Kbd><Kbd>K</Kbd></Space>', render: () => <Space><Kbd>⌘</Kbd><Kbd>K</Kbd></Space>, api: [{ name: "children", description: "按键标签", type: "ReactNode" }, { name: "className", description: "kbd 样式类", type: "string" }] },
  card: { title: "Card 卡片", description: "用 header、content、footer 组合内容分组；间距在 Card 内部统一管理。", code: CardExampleSource.replaceAll("../../../../src/core", "@gouno/ui/core"), render: () => <CardExample />, api: [{ name: "as", description: "Card 宿主元素；交互行为应使用语义元素", type: "ElementType", defaultValue: '"div"' }, { name: "variant", description: "视觉形态", type: '"default" | "subtle" | "elevated"', defaultValue: '"default"' }, { name: "padding", description: "内边距 token", type: '"none" | "sm" | "base" | "lg"', defaultValue: '"base"' }, { name: "interactive", description: "增加悬停提示样式，不自动提供键盘动作", type: "boolean", defaultValue: "false" }, { name: "className", description: "Card 主体样式类", type: "string" }], apiSections: [{ title: "CardHeader API", rows: [{ name: "title", description: "标题内容；0 和空字符串均会渲染", type: "ReactNode" }, { name: "description", description: "说明内容；0 和空字符串均会渲染", type: "ReactNode" }, { name: "action", description: "右侧操作槽", type: "ReactNode" }, { name: "children", description: "自定义 header 内容；设置后优先于 title/description/action", type: "ReactNode" }] }, { title: "CardTitle API", rows: [{ name: "children", description: "标题内容", type: "ReactNode" }, { name: "className", description: "h3 样式类", type: "string" }] }, { title: "CardDescription API", rows: [{ name: "children", description: "说明内容", type: "ReactNode" }, { name: "className", description: "p 样式类", type: "string" }] }, { title: "CardContent API", rows: [{ name: "flush", description: "兼容字段；组件不自行添加内边距", type: "boolean" }, { name: "children", description: "正文内容", type: "ReactNode" }, { name: "className", description: "正文样式类", type: "string" }] }, { title: "CardFooter API", rows: [{ name: "children", description: "底部内容", type: "ReactNode" }, { name: "className", description: "footer 样式类", type: "string" }] }] },
  avatar: { title: "Avatar 头像", description: "图片头像和文字回退。", code: '<Avatar><AvatarFallback>GU</AvatarFallback></Avatar>', render: () => <Avatar><AvatarFallback>GU</AvatarFallback></Avatar> },
  spinner: { title: "Spinner 加载指示器", description: "表达进行中的等待状态；默认 role=status 和 Loading 名称。", code: '<Spinner aria-label="正在保存" />', render: () => <Space><Spinner aria-label="正在保存" /><Text>正在保存</Text></Space>, api: [{ name: "aria-label", description: "可访问名称；未提供时为 Loading", type: "string", defaultValue: '"Loading"' }, { name: "className", description: "span 样式类", type: "string" }] },
  "typography-primitive": { title: "Typography 原语", description: "轻量文本原语，默认渲染为 p。", code: '<Typography as="span">辅助文本</Typography>', render: () => <Typography as="span">辅助文本</Typography>, api: [{ name: "as", description: "宿主元素或组件", type: "ElementType", defaultValue: '"p"' }, { name: "children", description: "文本内容", type: "ReactNode" }, { name: "className", description: "宿主样式类", type: "string" }] }
};
