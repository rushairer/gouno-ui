import { Affix, BackTop, Button, FloatButton, QRCode, Watermark } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
export const otherDocuments: Record<string, ComponentDocument> = {
  "float-button": { title: "FloatButton 悬浮按钮", description: "固定位置的快捷操作。", code: '<FloatButton tooltip="返回顶部" />', render: () => <FloatButton tooltip="返回顶部" className="static" /> },
  qrcode: { title: "QRCode 二维码", description: "生成可扫描二维码，支持尺寸、颜色和纠错级别。", code: '<QRCode value="https://gouno.com" />', render: () => <QRCode value="https://github.com/rushairer/gouno-ui" ariaLabel="Gouno UI repository QR code" /> },
  watermark: { title: "Watermark 水印", description: "为内容区域增加重复文字水印。", code: '<Watermark content="Gouno"><Card /></Watermark>', render: () => <Watermark content="Gouno UI"><div className="h-48 rounded-md border p-6">受保护的内容区域</div></Watermark> },
  affix: { title: "Affix 固钉", description: "通过 sticky 定位固定局部操作。", code: '<Affix offsetTop={16}><Button>固定操作</Button></Affix>', render: () => <Affix offsetTop={16}><Button>固定操作</Button></Affix> },
  "back-top": { title: "BackTop 回到顶部", description: "平滑滚动到页面顶部。", code: '<BackTop />', render: () => <BackTop className="static" /> }
};
