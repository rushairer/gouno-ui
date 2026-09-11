import AffixExample from "./affix/affix-0";
import AffixExampleSource from "./affix/affix-0.tsx?raw";
import BackTopExample from "./back-top/back-top-0";
import BackTopExampleSource from "./back-top/back-top-0.tsx?raw";
import FloatButtonExample from "./float-button/float-button-0";
import FloatButtonExampleSource from "./float-button/float-button-0.tsx?raw";
import QRCodeExample from "./qrcode/qrcode-0";
import QRCodeExampleSource from "./qrcode/qrcode-0.tsx?raw";
import WatermarkExample from "./watermark/watermark-0";
import WatermarkExampleSource from "./watermark/watermark-0.tsx?raw";
import type { ComponentDocument } from "../../components/component-page";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const otherDocuments: Record<string, ComponentDocument> = {
  "float-button": {
    title: "FloatButton 悬浮按钮",
    description:
      "通用悬浮快捷操作。icon 由调用方提供，Core 不再把通用 FloatButton 默认成返回顶部箭头；无 href 时渲染 button，有 href 时渲染真实 anchor。标准 DOM/ARIA、事件和真实元素 ref 透传，disabled 在链接模式转为 aria-disabled + 不可聚焦/不可导航。tooltip 现在渲染真实 Tooltip，但可访问名称仍应由 aria-label / aria-labelledby 明确提供。",
    code: canonicalCoreSource(FloatButtonExampleSource),
    render: () => <FloatButtonExample />,
    api: [
      { name: "icon", description: "按钮图标；必填且仅作为装饰图形呈现。", type: "ReactNode" },
      { name: "tooltip", description: "可选可视 Tooltip 内容；不替代标准可访问名称。", type: "ReactNode" },
      { name: "href", description: "提供后切换为真实 anchor 模式。", type: "string" },
      { name: "target", description: "anchor 模式的标准 target。", type: "AnchorHTMLAttributes<HTMLAnchorElement>[\"target\"]" },
      { name: "rel", description: "anchor 模式的标准 rel。", type: "string" },
      { name: "download", description: "anchor 模式的标准 download。", type: "boolean | string" },
      { name: "disabled", description: "button 使用原生 disabled；anchor 使用 aria-disabled、tabIndex=-1 并阻止导航。", type: "boolean", defaultValue: "false" },
      { name: "type", description: "button 模式的原生 type。", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
      { name: "aria-label", description: "图标按钮的标准可访问名称。", type: "string" },
      { name: "aria-labelledby", description: "也可引用页面内可见标签作为可访问名称。", type: "string" },
      { name: "onClick", description: "标准点击事件；anchor disabled 时不会调用。", type: "MouseEventHandler<HTMLElement>" },
      { name: "className", description: "根 button/anchor 的附加样式类，可覆盖默认 fixed 定位。", type: "string" },
      { name: "style", description: "根 button/anchor 的标准内联样式。", type: "CSSProperties" },
      { name: "ref", description: "按当前模式指向真实 button 或 anchor。", type: "Ref<HTMLButtonElement | HTMLAnchorElement>" },
    ],
  },
  qrcode: {
    title: "QRCode 二维码",
    description: "将字符串编码为 canvas 二维码；像素尺寸和纠错级别由组件拥有，可访问名称使用标准 ARIA 属性由调用方提供。",
    code: QRCodeExampleSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <QRCodeExample />,
    api: [
      { name: "value", description: "要编码的字符串", type: "string" },
      { name: "size", description: "canvas 宽高，单位 px", type: "number", defaultValue: "160" },
      { name: "color", description: "二维码前景色", type: "string", defaultValue: '"#000000"' },
      { name: "background", description: "二维码背景色", type: "string", defaultValue: '"#ffffff"' },
      { name: "errorLevel", description: "QR 纠错级别", type: '"L" | "M" | "Q" | "H"', defaultValue: '"M"' },
      { name: "role", description: "canvas 的标准 ARIA role", type: "AriaRole", defaultValue: '"img"' },
      { name: "aria-label", description: "标准可访问名称；与 aria-labelledby 按实际上下文选择", type: "string" },
      { name: "aria-labelledby", description: "引用页面中的可见名称元素", type: "string" },
      { name: "className", description: "透传至 canvas", type: "string" },
      { name: "style", description: "透传至 canvas", type: "CSSProperties" },
      { name: "ref", description: "真实 canvas 元素引用", type: "Ref<HTMLCanvasElement>" },
    ],
  },
  watermark: {
    title: "Watermark 水印",
    description:
      "为内容区域增加重复文字背景。content 由调用方显式提供，Core 不注入 Gouno 或任何产品品牌；文字会先作为 XML text 转义再编码进 SVG data URL。rotate / gap / opacity 对非有限值做稳定回退，gap 保证最小 tile，opacity 限定在 0~1。根节点保留普通 div 语义并透传标准 DOM/ARIA、style、className 与真实 ref。",
    code: canonicalCoreSource(WatermarkExampleSource),
    render: () => <WatermarkExample />,
    api: [
      { name: "content", description: "水印文字；由调用方显式提供。", type: "string" },
      { name: "children", description: "被水印背景承载的内容。", type: "ReactNode" },
      { name: "rotate", description: "水印文字旋转角度；非有限值回退默认。", type: "number", defaultValue: "-22" },
      { name: "gap", description: "重复 SVG tile 边长，单位 px；最小规范化为 32。", type: "number", defaultValue: "120" },
      { name: "opacity", description: "水印文字透明度；规范化到 0~1。", type: "number", defaultValue: "0.12" },
      { name: "aria-label", description: "需要为内容区域命名时使用标准 ARIA。", type: "string" },
      { name: "className", description: "根 div 附加样式类。", type: "string" },
      { name: "style", description: "根 div 内联样式；调用方值可显式覆盖生成的 backgroundImage。", type: "CSSProperties" },
      { name: "ref", description: "真实根 div 引用。", type: "Ref<HTMLDivElement>" },
    ],
  },
  affix: {
    title: "Affix 固钉",
    description:
      "在当前滚动祖先内提供 top-sticky 容器。offsetTop 负责 sticky top，非有限值回退 0；Core 不猜测自定义 scroll container，也不注入监听器。根 div 透传标准 DOM/ARIA/className/style/ref，其中 position: sticky 与 top 属于 Affix 自身布局合同。",
    code: canonicalCoreSource(AffixExampleSource),
    render: () => <AffixExample />,
    api: [
      { name: "offsetTop", description: "sticky top 偏移，单位 px；非有限值回退 0。", type: "number", defaultValue: "0" },
      { name: "children", description: "需要固定的局部内容。", type: "ReactNode" },
      { name: "aria-label", description: "需要为固定区域命名时使用标准 ARIA。", type: "string" },
      { name: "className", description: "根 div 附加样式类。", type: "string" },
      { name: "style", description: "根 div 标准 style；zIndex 可覆盖，position/top 由 Affix 合同拥有。", type: "CSSProperties" },
      { name: "ref", description: "真实根 div 引用。", type: "Ref<HTMLDivElement>" },
    ],
  },
  "back-top": {
    title: "BackTop 回到顶部",
    description:
      "监听页面 window 滚动位置，在 scrollY 达到 visibilityHeight 后才渲染回顶按钮。点击默认平滑滚动到 top=0；调用方 onClick 若 preventDefault 可取消该默认动作。可访问名称由调用方通过标准 aria-label 本地化提供，Core 不再硬编码英文。",
    code: canonicalCoreSource(BackTopExampleSource),
    render: () => <BackTopExample />,
    api: [
      { name: "aria-label", description: "必填的标准可访问名称，由调用方本地化。", type: "string" },
      { name: "visibilityHeight", description: "window.scrollY 达到该阈值后渲染；负值归一到 0，非有限值回退 200。", type: "number", defaultValue: "200" },
      { name: "children", description: "自定义按钮内容；省略时使用装饰性 ArrowUp 图标。", type: "ReactNode" },
      { name: "onClick", description: "标准按钮点击事件；preventDefault 可阻止默认 smooth scroll。", type: "MouseEventHandler<HTMLButtonElement>" },
      { name: "disabled", description: "标准原生 button disabled。", type: "boolean" },
      { name: "type", description: "标准 button type。", type: '"button" | "submit" | "reset"', defaultValue: '"button"' },
      { name: "className", description: "根 button 附加样式类，可覆盖默认 fixed 定位。", type: "string" },
      { name: "style", description: "根 button 标准内联样式。", type: "CSSProperties" },
      { name: "ref", description: "真实 button 引用。", type: "Ref<HTMLButtonElement>" },
    ],
  },
};
