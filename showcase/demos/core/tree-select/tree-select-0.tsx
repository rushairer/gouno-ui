import { useState } from "react";
import { TreeSelect } from "../../../../src/core";

const treeData = [
  {
    value: "docs",
    title: "文档",
    children: [
      { value: "guide", title: "指南" },
      { value: "api", title: "API" },
    ],
  },
  {
    value: "admin",
    title: "管理后台",
    children: [{ value: "audit", title: "审计", disabled: true }],
  },
] as const;

export default function TreeSelectDemo() {
  const [section, setSection] = useState("guide");
  const [topics, setTopics] = useState<string[]>(["guide", "api"]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-2 text-sm">
        <span className="font-medium">主分区</span>
        <TreeSelect
          aria-label="主分区"
          treeData={treeData}
          value={section}
          placeholder="请选择"
          onChange={(next) => setSection(String(next))}
        />
      </label>
      <label className="space-y-2 text-sm">
        <span className="font-medium">关联主题</span>
        <TreeSelect
          aria-label="关联主题"
          treeData={treeData}
          multiple
          value={topics}
          onChange={(next) => setTopics(Array.isArray(next) ? next : [next])}
        />
      </label>
    </div>
  );
}
