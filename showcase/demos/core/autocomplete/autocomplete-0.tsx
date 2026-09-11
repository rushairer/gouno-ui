import { useState } from "react";
import { AutoComplete } from "../../../../src/core";

const cityOptions = [
  { value: "Beijing", label: "北京 / Beijing" },
  { value: "Shanghai", label: "上海 / Shanghai" },
  { value: "Shenzhen", label: "深圳 / Shenzhen", disabled: true },
] as const;

export default function AutoCompleteDemo() {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState("尚未选择");

  return (
    <div className="grid max-w-sm gap-3">
      <AutoComplete
        aria-label="城市"
        placeholder="输入城市"
        options={cityOptions}
        value={value}
        onChange={setValue}
        onSelect={(next) => setSelected(next)}
        emptyText="没有匹配城市"
      />
      <AutoComplete
        aria-label="审核状态"
        options={["待审核", "已通过", "已拒绝"]}
        defaultValue="待"
        size="large"
        status="warning"
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        已选择：{selected}
      </p>
    </div>
  );
}
