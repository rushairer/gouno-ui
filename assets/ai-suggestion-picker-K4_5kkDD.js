import{E as e,h as t,l as n,n as r,t as i,w as a}from"./typography-DRwFz_U2.js";import{t as o}from"./field-DUGd6CcQ.js";import{K as s,d as c,p as l,rt as u,u as d}from"./index-BepV8MFb.js";import{t as f}from"./ai-suggestions-CkWGOohn.js";var p=e(a(),1),m=t(),h=[{value:`Agent 工作流可观测性：从运行记录到人工审批`,description:`强调生产化后的运行证据与审批边界。`},{value:`AI 自动化进入生产后，为什么运行证据比生成结果更重要`,description:`更偏观点型标题，突出生产治理判断。`},{value:`从生成到治理：Agent 自动化真正缺的是什么`,description:`更短、更适合首页卡片与社交分享。`}];function g(){let[e,t]=(0,p.useState)(h),[i,a]=(0,p.useState)(h[0]?.value??null),[c,l]=(0,p.useState)(`每日 AI 资讯：Agent 工作流进入可观测阶段`),[u,d]=(0,p.useState)(!0);return u?(0,m.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,m.jsx)(o,{label:`当前标题`,children:(0,m.jsx)(s,{"aria-label":`当前标题`,value:c,readOnly:!0})}),(0,m.jsx)(f,{"aria-label":`标题 AI 建议`,heading:`标题候选`,description:`候选结果先选择，再通过一个明确动作写回业务字段。`,groupLabel:`标题候选列表`,options:e,value:i,onValueChange:a,onDismiss:()=>d(!1),onRegenerate:()=>{let e=[...h].reverse();t(e),a(e[0]?.value??null)},onApply:e=>l(e)}),(0,m.jsx)(r,{size:`xs`,tone:`muted`,children:`Pattern 只拥有候选选择与确认语义；模型调用、字段写入和业务校验仍由消费者负责。`})]}):(0,m.jsx)(`div`,{className:`flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10`,children:(0,m.jsx)(n,{onClick:()=>{t(h),a(h[0]?.value??null),d(!0)},children:`重新打开 AI 建议`})})}var _=`import { useState } from "react";
import { Button, Field, Input, Text } from "../../../../src/core";
import { AISuggestionPicker, type AISuggestionOption } from "../../../../src/patterns";

const primaryOptions: readonly AISuggestionOption[] = [
  {
    value: "Agent 工作流可观测性：从运行记录到人工审批",
    description: "强调生产化后的运行证据与审批边界。",
  },
  {
    value: "AI 自动化进入生产后，为什么运行证据比生成结果更重要",
    description: "更偏观点型标题，突出生产治理判断。",
  },
  {
    value: "从生成到治理：Agent 自动化真正缺的是什么",
    description: "更短、更适合首页卡片与社交分享。",
  },
];

export default function AISuggestionPickerExample() {
  const [options, setOptions] = useState<readonly AISuggestionOption[]>(primaryOptions);
  const [value, setValue] = useState<string | null>(primaryOptions[0]?.value ?? null);
  const [applied, setApplied] = useState("每日 AI 资讯：Agent 工作流进入可观测阶段");
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <Button
          onClick={() => {
            setOptions(primaryOptions);
            setValue(primaryOptions[0]?.value ?? null);
            setVisible(true);
          }}
        >
          重新打开 AI 建议
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="当前标题">
        <Input aria-label="当前标题" value={applied} readOnly />
      </Field>

      <AISuggestionPicker
        aria-label="标题 AI 建议"
        heading="标题候选"
        description="候选结果先选择，再通过一个明确动作写回业务字段。"
        groupLabel="标题候选列表"
        options={options}
        value={value}
        onValueChange={setValue}
        onDismiss={() => setVisible(false)}
        onRegenerate={() => {
          const regenerated = [...primaryOptions].reverse();
          setOptions(regenerated);
          setValue(regenerated[0]?.value ?? null);
        }}
        onApply={(next) => setApplied(next)}
      />

      <Text size="xs" tone="muted">
        Pattern 只拥有候选选择与确认语义；模型调用、字段写入和业务校验仍由消费者负责。
      </Text>
    </div>
  );
}
`,v=[{name:`options`,type:`readonly AISuggestionOption[]`,description:`候选结果列表。Pattern 不负责生成这些内容。`},{name:`value`,type:`string | null`,description:`当前选中的候选值。`},{name:`onValueChange`,type:`(value: string) => void`,description:`用户切换候选时触发。`},{name:`onApply`,type:`(value: string) => void`,description:`点击统一确认动作时触发，由消费者决定如何写回业务字段。`},{name:`heading`,type:`ReactNode`,description:`建议区标题。`,defaultValue:`"AI 建议"`},{name:`description`,type:`ReactNode`,description:`建议区辅助说明；不传时显示候选数量。`},{name:`groupLabel`,type:`string`,description:`RadioGroup accessible name。`,defaultValue:`"AI 建议候选"`},{name:`onDismiss`,type:`() => void`,description:`可选取消 / 关闭入口。`},{name:`onRegenerate`,type:`() => void`,description:`可选重新生成入口；传入后 Header 右上角显示固定 icon-only 操作，并保留 accessible label/title。生成逻辑仍由消费者拥有。`},{name:`applyLabel`,type:`string`,description:`统一确认动作文案。`,defaultValue:`"使用所选"`},{name:`className`,type:`string`,description:`扩展 Pattern 外层 surface。`}],y=[{name:`value`,type:`string`,description:`候选的主文本，同时作为选择值。`},{name:`description`,type:`ReactNode`,description:`可选候选解释或差异说明。`},{name:`monospace`,type:`boolean`,description:`路径、代码等机器可读候选使用等宽展示。`,defaultValue:`false`}];function b(){let e=d(_);return(0,m.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,m.jsxs)(`header`,{className:`flex flex-col gap-2`,children:[(0,m.jsx)(`div`,{className:`text-xs font-semibold uppercase tracking-[0.14em] text-primary`,children:`Pattern · @gouno/ui/patterns`}),(0,m.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,m.jsx)(i,{level:1,children:`AISuggestionPicker AI 候选选择器`}),(0,m.jsx)(u,{color:`success`,children:`Admitted`})]}),(0,m.jsx)(r,{tone:`muted`,className:`max-w-3xl leading-relaxed`,children:`用于“一个业务字段对应多个互斥 AI 候选”的场景。Pattern 提供真实 Radio 选择、重新生成、取消与一个明确的确认动作；它不拥有模型、Prompt、持久化或字段校验。重新生成固定使用 icon-only 次级动作，避免窄容器中与标题、说明争抢横向空间。`})]}),(0,m.jsx)(c,{title:`候选选择后统一应用`,description:`Preview 与 Code 使用同一份示例源码。选择候选只改变选中态，只有点击“使用所选”才把结果写回示例字段。`,code:e,children:(0,m.jsx)(g,{})}),(0,m.jsx)(c,{title:`窄容器行为`,description:`重新生成始终保持 32×32 icon-only；标题与说明获得剩余宽度并自然换行，底部动作在必要时按按钮粒度换行。`,code:e,children:(0,m.jsx)(`div`,{className:`max-w-72`,children:(0,m.jsx)(g,{})})}),(0,m.jsxs)(`section`,{className:`space-y-4`,children:[(0,m.jsx)(i,{level:3,children:`Props API`}),(0,m.jsx)(l,{rows:v})]}),(0,m.jsxs)(`section`,{className:`space-y-4`,children:[(0,m.jsx)(i,{level:3,children:`AISuggestionOption`}),(0,m.jsx)(l,{rows:y})]})]})}export{b as PatternAISuggestionPickerDemo};