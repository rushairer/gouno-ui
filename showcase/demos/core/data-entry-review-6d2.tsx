import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import RateDemo from "./rate/rate-0";
import RateDemoSource from "./rate/rate-0.tsx?raw";
import SliderDemo from "./slider/slider-0";
import SliderDemoSource from "./slider/slider-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const sliderRateReviewDocuments: Record<string, ComponentDocument> = {
  slider: {
    ...dataEntryDocuments.slider,
    description:
      "薄封装原生 input[type=range]：浏览器继续拥有范围、步进、键盘与表单值语义，Gouno 只统一视觉、真实 input ref、标准 DOM/ARIA 透传和稳定 slot。",
    code: canonicalCoreSource(SliderDemoSource),
    render: () => <SliderDemo />,
    api: [
      {
        name: "value / defaultValue",
        description: "沿用原生 range input 的受控/非受控值语义。",
        type: "InputHTMLAttributes<HTMLInputElement>[\"value\"]",
      },
      {
        name: "min / max / step",
        description: "沿用原生范围和步进约束。",
        type: "number | string",
        defaultValue: "0 / 100 / 1",
      },
      {
        name: "disabled / required / name / form",
        description: "沿用原生表单能力，不创建第二套状态或提交协议。",
        type: "InputHTMLAttributes<HTMLInputElement>",
      },
      {
        name: "...input props",
        description:
          "除固定 type=range 外透传标准 input 属性、ARIA、data-* 和原生事件。",
        type: "Omit<InputHTMLAttributes<HTMLInputElement>, \"type\">",
      },
      {
        name: "ref",
        description: "指向真实 input[type=range]。",
        type: "Ref<HTMLInputElement>",
      },
    ],
  },
  rate: {
    ...dataEntryDocuments.rate,
    description:
      "离散评分使用 radiogroup/radio 语义；调用方通过标准 aria-label/aria-labelledby 命名整个评分组，各选项使用语言无关的数字可访问名称，并支持 roving focus 与方向键选择。",
    code: canonicalCoreSource(RateDemoSource),
    render: () => <RateDemo />,
    api: [
      {
        name: "value",
        description: "受控评分值；0 表示未选择。",
        type: "number",
      },
      {
        name: "defaultValue",
        description: "非受控初始评分。",
        type: "number",
        defaultValue: "0",
      },
      {
        name: "count",
        description: "评分项数量。",
        type: "number",
        defaultValue: "5",
      },
      {
        name: "allowClear",
        description: "再次点击当前已选项时是否清零；键盘方向移动不会触发清零。",
        type: "boolean",
        defaultValue: "true",
      },
      {
        name: "disabled",
        description: "禁用整组评分并移出 tab 顺序。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "onChange",
        description: "评分变化或清零时回传最终数值。",
        type: "(value: number) => void",
      },
      {
        name: "...div props",
        description:
          "透传标准 className/data-* 与 aria-label/aria-labelledby；radiogroup role 和 aria-disabled 由组件状态拥有。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
      {
        name: "ref",
        description: "指向真实 radiogroup 根 div。",
        type: "Ref<HTMLDivElement>",
      },
    ],
  },
};
