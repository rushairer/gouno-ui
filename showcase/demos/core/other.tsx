import QRCodeExample from "./qrcode/qrcode-0";
import QRCodeExampleSource from "./qrcode/qrcode-0.tsx?raw";
import { Affix, BackTop, Button, FloatButton, Watermark } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
export const otherDocuments: Record<string, ComponentDocument> = {
  "float-button": { title: "FloatButton 悬浮按钮", description: "固定位置的快捷操作。", code: '<FloatButton tooltip="返回顶部" />', render: () => <FloatButton tooltip="返回顶部" className="static" /> },
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
