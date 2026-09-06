import type { ComponentDocument } from "../../../components/component-page";

export const overlayStyleApi: ComponentDocument["apiSections"] = [
  {
    title: "styles 分区样式",
    rows: [
      {
        name: "header",
        type: "CSSProperties",
        description: "标题与描述区域的内联样式",
      },
      {
        name: "body",
        type: "CSSProperties",
        description: "主体区域（包括 loading 占位）的内联样式",
      },
      {
        name: "footer",
        type: "CSSProperties",
        description: "底部操作区内联样式；没有 footer 时不渲染区域",
      },
      {
        name: "mask",
        type: "CSSProperties",
        description: "遮罩内联样式；mask=false 时不渲染遮罩",
      },
    ],
  },
];

export const modalApiSections: ComponentDocument["apiSections"] = [
  ...overlayStyleApi,
  {
    title: "okButtonProps / cancelButtonProps",
    description:
      "完整类型为公共 ButtonProps，可使用 Button 页列出的属性及原生按钮属性。以下为 Modal 的组合规则。",
    rows: [
      {
        name: "onClick",
        type: "MouseEventHandler<HTMLButtonElement>",
        description:
          "先执行按钮事件；调用 event.preventDefault() 可阻止后续 onOk 或取消关闭",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "禁用对应按钮；confirmLoading 期间取消按钮强制禁用",
      },
      {
        name: "loading",
        type: "boolean",
        description: "按钮加载状态；确认按钮与 confirmLoading 合并",
      },
      {
        name: "variant",
        type: "ButtonProps['variant']",
        description: "确认按钮默认为 primary，取消按钮使用 Button 默认变体",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "按钮文案由 okText / cancelText 提供，覆盖此字段",
      },
    ],
  },
];
