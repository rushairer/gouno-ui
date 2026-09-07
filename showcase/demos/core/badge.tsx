import BadgeDemo from "./badge/badge-0";
import BadgeDemoSource from "./badge/badge-0.tsx?raw";
import type { ComponentDocument } from "../../components/component-page";

export const badgeDocuments: Record<string, ComponentDocument> = {
  badge: {
    title: "Badge 徽标数",
    description: "用于通知计数、状态红点和运行状态。示例覆盖计数、零值、封顶、红点、状态点、尺寸偏移和动态更新。",
    code: BadgeDemoSource.replaceAll("../../../../src/core", "@gouno/ui/core"),
    render: () => <BadgeDemo />,
    api: [
      { name: "count", description: "角标内容；数字超过 overflowCount 时显示封顶值加号", type: "ReactNode" },
      { name: "dot", description: "显示无数字的状态红点", type: "boolean", defaultValue: "false" },
      { name: "showZero", description: "count 为 0 时仍显示角标", type: "boolean", defaultValue: "false" },
      { name: "overflowCount", description: "数字角标的封顶值；仅数字 count 参与封顶", type: "number", defaultValue: "99" },
      { name: "status", description: "独立状态点的语义状态；无 children/count/dot 时生效", type: '"success" | "processing" | "default" | "error" | "warning"' },
      { name: "text", description: "独立状态点右侧的说明文本", type: "ReactNode" },
      { name: "color", description: "自定义角标或状态点颜色", type: "string" },
      { name: "size", description: "数字角标尺寸", type: '"default" | "small"', defaultValue: '"default"' },
      { name: "offset", description: "角标水平、垂直偏移，单位为 CSS 像素", type: "[number, number]" },
      { name: "children", description: "角标所依附的元素；渲染为相对定位容器", type: "ReactNode" },
      { name: "title", description: "角标原生 title 和辅助名称；未提供时使用显示值", type: "string" },
      { name: "className", description: "宿主 span 样式类", type: "string" },
    ],
  },
};
