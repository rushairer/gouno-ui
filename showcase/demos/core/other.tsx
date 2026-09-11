import FloatButtonExample from "./float-button/float-button-0";
import FloatButtonExampleSource from "./float-button/float-button-0.tsx?raw";
import QRCodeExample from "./qrcode/qrcode-0";
import QRCodeExampleSource from "./qrcode/qrcode-0.tsx?raw";
import { Affix, BackTop, Button, Watermark } from "../../../src/core";
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
  watermark: { title: "Watermark 水印", description: "为内容区域增加重复文字水印。", code: '<Watermark content="Gouno"><Card /></Watermark>', render: () => <Watermark content="Gouno UI"><div className="h-48 rounded-md border p-6">受保护的内容区域</div></Watermark> },
  affix: { title: "Affix 固钉", description: "通过 sticky 定位固定局部操作。", code: '<Affix offsetTop={16}><Button>固定操作</Button></Affix>', render: () => <Affix offsetTop={16}><Button>固定操作</Button></Affix> },
  "back-top": { title: "BackTop 回到顶部", description: "平滑滚动到页面顶部。", code: '<BackTop />', render: () => <BackTop className="static" /> }
};
