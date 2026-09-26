import{E as e,h as t,l as n,n as r,t as i,w as a}from"./typography-DRwFz_U2.js";import{d as o,p as s,rt as c,u as l}from"./index-WaxCxCeF.js";import{n as u}from"./ai-suggestions-4fkhU94O.js";var d=e(a(),1),f=t(),p=[{key:`slug`,label:`Slug`,value:`agent-workflow-observability`,monospace:!0},{key:`seo-title`,label:`SEO 标题`,value:`Agent 工作流可观测性：运行证据、审批与失败回放`},{key:`seo-description`,label:`SEO 描述`,value:`拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。`}];function m(){let[e,t]=(0,d.useState)(p.map(e=>e.key)),[i,a]=(0,d.useState)([]),[o,s]=(0,d.useState)(!0),c=(0,d.useMemo)(()=>i.length?`最近应用：${i.join(`、`)}`:`尚未应用建议`,[i]);return o?(0,f.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,f.jsx)(u,{"aria-label":`路径与 SEO AI 建议`,heading:`路径与 SEO 建议`,description:`可以取消任意一项，再一次性应用剩余修改。`,groupLabel:`路径与 SEO 建议列表`,items:p,selectedKeys:e,onSelectedKeysChange:t,onCancel:()=>s(!1),onRegenerate:()=>t(p.map(e=>e.key)),onApply:()=>a(e)}),(0,f.jsx)(r,{size:`xs`,tone:`muted`,children:c})]}):(0,f.jsx)(`div`,{className:`flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10`,children:(0,f.jsx)(n,{onClick:()=>{t(p.map(e=>e.key)),s(!0)},children:`重新打开 AI 建议`})})}var h=`import { useMemo, useState } from "react";
import { Button, Text } from "../../../../src/core";
import { AISuggestionReview, type AISuggestionReviewItem } from "../../../../src/patterns";

const suggestions: readonly AISuggestionReviewItem[] = [
  { key: "slug", label: "Slug", value: "agent-workflow-observability", monospace: true },
  { key: "seo-title", label: "SEO 标题", value: "Agent 工作流可观测性：运行证据、审批与失败回放" },
  { key: "seo-description", label: "SEO 描述", value: "拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。" },
];

export default function AISuggestionReviewExample() {
  const [selectedKeys, setSelectedKeys] = useState(suggestions.map((item) => item.key));
  const [appliedKeys, setAppliedKeys] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);

  const appliedLabel = useMemo(
    () => appliedKeys.length ? \`最近应用：\${appliedKeys.join("、")}\` : "尚未应用建议",
    [appliedKeys],
  );

  if (!visible) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <Button
          onClick={() => {
            setSelectedKeys(suggestions.map((item) => item.key));
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
      <AISuggestionReview
        aria-label="路径与 SEO AI 建议"
        heading="路径与 SEO 建议"
        description="可以取消任意一项，再一次性应用剩余修改。"
        groupLabel="路径与 SEO 建议列表"
        items={suggestions}
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
        onCancel={() => setVisible(false)}
        onRegenerate={() => setSelectedKeys(suggestions.map((item) => item.key))}
        onApply={() => setAppliedKeys(selectedKeys)}
      />
      <Text size="xs" tone="muted">{appliedLabel}</Text>
    </div>
  );
}
`,g=[{name:`items`,type:`readonly AISuggestionReviewItem[]`,description:`需要用户审阅的一组关联字段修改。`},{name:`selectedKeys`,type:`readonly string[]`,description:`当前准备应用的建议 key。`},{name:`onSelectedKeysChange`,type:`(keys: string[]) => void`,description:`勾选状态变化回调。`},{name:`onApply`,type:`() => void`,description:`点击“应用 N 项建议”时触发；实际写回由消费者负责。`},{name:`heading`,type:`ReactNode`,description:`建议区标题。`,defaultValue:`"AI 建议"`},{name:`description`,type:`ReactNode`,description:`审阅说明；不传时显示已选择数量。`},{name:`groupLabel`,type:`string`,description:`建议列表 accessible name。`,defaultValue:`"AI 建议选择"`},{name:`onCancel`,type:`() => void`,description:`可选取消入口。`},{name:`onRegenerate`,type:`() => void`,description:`可选重新生成入口；传入后 Header 右上角显示固定 icon-only 操作，并保留 accessible label/title。Pattern 不负责生成逻辑。`},{name:`className`,type:`string`,description:`扩展 Pattern 外层 surface。`}],_=[{name:`key`,type:`string`,description:`稳定建议标识，用于 selectedKeys。`},{name:`label`,type:`string`,description:`字段或修改项标签。`},{name:`value`,type:`ReactNode`,description:`建议的新值或修改摘要。`},{name:`monospace`,type:`boolean`,description:`路径、代码等机器可读内容使用等宽展示。`,defaultValue:`false`}];function v(){let e=l(h);return(0,f.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,f.jsxs)(`header`,{className:`flex flex-col gap-2`,children:[(0,f.jsx)(`div`,{className:`text-xs font-semibold uppercase tracking-[0.14em] text-primary`,children:`Pattern · @gouno/ui/patterns`}),(0,f.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,f.jsx)(i,{level:1,children:`AISuggestionReview AI 建议审阅器`}),(0,f.jsx)(c,{color:`success`,children:`Admitted`})]}),(0,f.jsx)(r,{tone:`muted`,className:`max-w-3xl leading-relaxed`,children:`用于“一次 AI 操作会修改多个相关字段”的场景。Pattern 用 Checkbox 明确哪些修改将被采用，并把提交收敛到一个“应用 N 项建议”动作，避免静默覆盖。重新生成固定使用 icon-only 次级动作，窄容器不再切换文字密度。`})]}),(0,f.jsx)(o,{title:`多字段建议先审阅再提交`,description:`Preview 与 Code 使用同一份示例源码。取消某些建议后，确认动作会实时反映最终应用数量。`,code:e,children:(0,f.jsx)(m,{})}),(0,f.jsx)(o,{title:`窄容器行为`,description:`重新生成始终保持 32×32 icon-only；Header 为内容区 + 固定操作区，说明文字可以换行，底部按钮在空间不足时按按钮粒度换行。`,code:e,children:(0,f.jsx)(`div`,{className:`max-w-72`,children:(0,f.jsx)(m,{})})}),(0,f.jsxs)(`section`,{className:`space-y-4`,children:[(0,f.jsx)(i,{level:3,children:`Props API`}),(0,f.jsx)(s,{rows:g})]}),(0,f.jsxs)(`section`,{className:`space-y-4`,children:[(0,f.jsx)(i,{level:3,children:`AISuggestionReviewItem`}),(0,f.jsx)(s,{rows:_})]})]})}export{v as PatternAISuggestionReviewDemo};