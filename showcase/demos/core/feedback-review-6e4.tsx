import type { ComponentDocument } from "../../components/component-page";
import { feedbackDocuments } from "./feedback";
import TourDemo from "./tour/tour-0";
import TourDemoSource from "./tour/tour-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const tourReviewDocuments: Record<string, ComponentDocument> = {
  tour: {
    ...feedbackDocuments.tour,
    description:
      "Tour 是受控显示、可受控/非受控步骤索引的 modal walkthrough。对话框复用 canonical Radix Dialog 的焦点锁定、Escape 关闭与焦点回收；当前步骤标题直接提供 dialog accessible name，不注入 Product tour 英文名称。previousText / nextText / finishText 全部由调用方本地化提供；非受控 current 在关闭后重置到第一步。旧 TourStep.target 因从未被 runtime 实现且没有产品消费者而移除；目标高亮/定位必须作为独立能力重新准入。",
    code: canonicalCoreSource(TourDemoSource),
    render: () => <TourDemo />,
    api: [
      { name: "open", description: "受控显示状态。", type: "boolean" },
      {
        name: "steps",
        description: "只读步骤集合；空集合不渲染 Tour。",
        type: "readonly TourStep[]",
      },
      {
        name: "current",
        description: "可选受控步骤索引；越界值按现有步骤范围归一化。",
        type: "number",
      },
      {
        name: "onChange",
        description: "用户通过前后操作切换步骤时回传归一化索引。",
        type: "(current: number) => void",
      },
      { name: "onClose", description: "Escape 或完成操作请求关闭。", type: "() => void" },
      { name: "previousText", description: "上一步按钮文案，由调用方提供。", type: "string" },
      { name: "nextText", description: "下一步按钮文案，由调用方提供。", type: "string" },
      { name: "finishText", description: "完成按钮文案，由调用方提供。", type: "string" },
      { name: "className", description: "dialog content 附加样式类。", type: "string" },
      { name: "ref", description: "真实 dialog content 引用。", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "TourStep API",
        rows: [
          { name: "title", description: "当前步骤标题，同时提供 dialog 可访问名称。", type: "ReactNode" },
          { name: "description", description: "可选步骤说明。", type: "ReactNode" },
        ],
      },
    ],
  },
};
