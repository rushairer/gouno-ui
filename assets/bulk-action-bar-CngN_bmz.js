import{i as e,n as t,t as n,u as r,v as i,x as a,y as o}from"./typography-CBSSDddg.js";import{t as s}from"./sparkles-BKmpjprY.js";import{t as c}from"./trash-xKvTqS-m.js";import{H as l,a as u,i as d,r as f}from"./index-CjJoisaM.js";import{t as p}from"./bulk-action-bar-Cg_jft24.js";var m=i(`archive`,[[`rect`,{width:`20`,height:`5`,x:`2`,y:`3`,rx:`1`,key:`1wp1u1`}],[`path`,{d:`M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8`,key:`1s80jp`}],[`path`,{d:`M10 12h4`,key:`a56b0p`}]]),h=a(o(),1),g=r(),_=[{key:`a`,label:`文章 A`},{key:`b`,label:`文章 B`},{key:`c`,label:`文章 C`}];function v(){let[n,r]=(0,h.useState)([`a`,`b`,`c`]),[i,a]=(0,h.useState)(`选择三项以显示批量操作。`);return(0,g.jsxs)(`div`,{className:`flex min-h-64 flex-col gap-4`,children:[(0,g.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-3`,children:[(0,g.jsx)(t,{size:`sm`,tone:`muted`,children:i}),n.length===0?(0,g.jsx)(e,{size:`small`,onClick:()=>{r([`a`,`b`,`c`]),a(`已恢复 3 项选择。`)},children:`恢复选择`}):null]}),(0,g.jsx)(`div`,{className:`grid gap-3 sm:grid-cols-3`,children:_.map(e=>(0,g.jsx)(`button`,{type:`button`,"aria-pressed":n.includes(e.key),onClick:()=>r(t=>t.includes(e.key)?t.filter(t=>t!==e.key):[...t,e.key]),className:`rounded-lg border bg-card px-4 py-5 text-left text-sm transition-colors hover:bg-muted aria-pressed:border-primary/40 aria-pressed:bg-accent/30`,children:e.label},e.key))}),n.length>0?(0,g.jsxs)(p,{selectionLabel:`已选择 ${n.length} 项`,onCancel:()=>r([]),children:[(0,g.jsx)(e,{size:`small`,icon:(0,g.jsx)(s,{}),onClick:()=>a(`对 ${n.length} 项执行辅助动作。`),children:`辅助`}),(0,g.jsx)(e,{size:`small`,icon:(0,g.jsx)(m,{}),onClick:()=>a(`已归档 ${n.length} 项。`),children:`归档`}),(0,g.jsx)(e,{size:`small`,color:`error`,icon:(0,g.jsx)(c,{}),onClick:()=>a(`请求删除 ${n.length} 项。`),children:`删除`})]}):null]})}var y=`import { useState } from "react";
import { Archive, Sparkles, Trash2 } from "lucide-react";
import { Button, Text } from "../../../../src/core";
import { BulkActionBar } from "../../../../src/patterns";

const resources = [
  { key: "a", label: "文章 A" },
  { key: "b", label: "文章 B" },
  { key: "c", label: "文章 C" },
] as const;

export default function BulkActionBarExample() {
  const [selected, setSelected] = useState(["a", "b", "c"]);
  const [message, setMessage] = useState("选择三项以显示批量操作。");

  const reset = () => {
    setSelected(["a", "b", "c"]);
    setMessage("已恢复 3 项选择。");
  };

  return (
    <div className="flex min-h-64 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text size="sm" tone="muted">
          {message}
        </Text>
        {selected.length === 0 ? (
          <Button size="small" onClick={reset}>
            恢复选择
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {resources.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={selected.includes(item.key)}
            onClick={() =>
              setSelected((current) =>
                current.includes(item.key)
                  ? current.filter((value) => value !== item.key)
                  : [...current, item.key],
              )
            }
            className="rounded-lg border bg-card px-4 py-5 text-left text-sm transition-colors hover:bg-muted aria-pressed:border-primary/40 aria-pressed:bg-accent/30"
          >
            {item.label}
          </button>
        ))}
      </div>

      {selected.length > 0 ? (
        <BulkActionBar
          selectionLabel={\`已选择 \${selected.length} 项\`}
          onCancel={() => setSelected([])}
        >
          <Button
            size="small"
            icon={<Sparkles />}
            onClick={() => setMessage(\`对 \${selected.length} 项执行辅助动作。\`)}
          >
            辅助
          </Button>
          <Button
            size="small"
            icon={<Archive />}
            onClick={() => setMessage(\`已归档 \${selected.length} 项。\`)}
          >
            归档
          </Button>
          <Button
            size="small"
            color="error"
            icon={<Trash2 />}
            onClick={() => setMessage(\`请求删除 \${selected.length} 项。\`)}
          >
            删除
          </Button>
        </BulkActionBar>
      ) : null}
    </div>
  );
}
`,b=[{name:`selectionLabel`,type:`ReactNode`,description:`当前选择上下文，例如“已选择 3 项”。`},{name:`onCancel`,type:`() => void`,description:`取消当前选择；Pattern 固定提供取消入口。`},{name:`cancelLabel`,type:`ReactNode`,description:`取消入口文案。`,defaultValue:`"取消"`},{name:`children`,type:`ReactNode`,description:`任意产品级批量动作；Pattern 不认识 AI、发布、删除等业务。`},{name:`aria-label`,type:`string`,description:`标准 toolbar accessible name。`,defaultValue:`"批量操作"`},{name:`className`,type:`string`,description:`扩展外层 sticky toolbar surface。`}];function x(){return(0,g.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,g.jsxs)(`header`,{className:`flex flex-col gap-2`,children:[(0,g.jsx)(`div`,{className:`text-xs font-semibold uppercase tracking-[0.14em] text-primary`,children:`Pattern · @gouno/ui/patterns`}),(0,g.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,g.jsx)(n,{level:1,children:`BulkActionBar 批量操作栏`}),(0,g.jsx)(l,{color:`success`,children:`Admitted`})]}),(0,g.jsx)(t,{tone:`muted`,className:`max-w-3xl leading-relaxed`,children:`当用户已经选择一组资源时，统一提供选择上下文、任意批量动作和取消选择入口。它只协调交互与可达性，不拥有资源列表、选择状态或业务动作。`})]}),(0,g.jsx)(d,{title:`批量选择与操作`,description:`Preview 直接渲染下面 Code 所读取的同一份示例源码；选择资源、消息状态以及三个动作都不会再出现两套实现。`,code:f(y),children:(0,g.jsx)(v,{})}),(0,g.jsxs)(`section`,{className:`space-y-4`,children:[(0,g.jsx)(n,{level:3,children:`Public API`}),(0,g.jsx)(u,{rows:b})]})]})}export{x as PatternBulkActionBarDemo};