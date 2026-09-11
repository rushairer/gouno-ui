import { useState } from "react";
import { Cascader } from "../../../../src/core";

const options = [
  {
    value: "china",
    label: "中国",
    children: [
      {
        value: "beijing",
        label: "北京",
        children: [
          { value: "chaoyang", label: "朝阳" },
          { value: "haidian", label: "海淀" },
        ],
      },
      {
        value: "shanghai",
        label: "上海",
        children: [{ value: "pudong", label: "浦东" }],
      },
    ],
  },
  {
    value: "other",
    label: "其他",
    disabled: true,
  },
] as const;

export default function CascaderDemo() {
  const [value, setValue] = useState<string[]>(["china", "beijing"]);

  return (
    <div className="space-y-3">
      <Cascader
        aria-label="地区"
        options={options}
        value={value}
        placeholder="请选择"
        onChange={(next) => setValue(next)}
      />
      <p className="text-sm text-muted-foreground">
        当前路径：{value.length ? value.join(" / ") : "未选择"}
      </p>
    </div>
  );
}
