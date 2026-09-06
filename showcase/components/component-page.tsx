import { useState,type ReactNode } from "react";
import { Heading,Text } from "../../src/core";
import { PageHeader,Panel } from "../../src/gouno";
import { DemoBlock } from "./demo-block";
import { CodeBlock } from "./code-block";
import { ApiTable,type ApiRow } from "./api-table";
export interface ComponentDocument{title:string;description:string;code:string;render:()=>ReactNode;api?:ApiRow[];notes?:ReactNode}
const commonApi:ApiRow[]=[{name:"disabled",description:"禁用交互",type:"boolean",defaultValue:"false"},{name:"className",description:"追加样式类",type:"string"}];
export function ComponentPage({document}:{document:ComponentDocument}){const[tab,setTab]=useState<"preview"|"code">("preview");return <div className="space-y-6"><PageHeader title={document.title} description={document.description}/><Panel><div className="mb-4 flex gap-1 border-b" role="tablist" aria-label="示例视图"><button role="tab" aria-selected={tab==="preview"} className={`border-b-2 px-3 py-2 text-sm ${tab==="preview"?"border-primary text-foreground":"border-transparent text-muted-foreground"}`} onClick={()=>setTab("preview")}>Preview</button><button role="tab" aria-selected={tab==="code"} className={`border-b-2 px-3 py-2 text-sm ${tab==="code"?"border-primary text-foreground":"border-transparent text-muted-foreground"}`} onClick={()=>setTab("code")}>Code</button></div>{tab==="preview"?<DemoBlock>{document.render()}</DemoBlock>:<CodeBlock code={document.code}/>}</Panel><Panel><Heading level={3}>状态与用法</Heading><Text tone="muted">所有 Core 组件使用 semantic tokens，支持键盘焦点、禁用态和表单关联。请优先使用受控模式承载业务状态。</Text>{document.notes}</Panel><Panel><Heading level={3} className="mb-4">API</Heading><ApiTable rows={document.api??commonApi}/></Panel></div>}
