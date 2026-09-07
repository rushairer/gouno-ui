import { useState } from "react";

import { Select, Space, Text } from "../../../../src/core";

const options = [
  { value: "design", label: "设计" },
  { value: "engineering", label: "工程" },
  { value: "product", label: "产品" },
  { value: "research", label: "研究" },
];

export default function SelectTagsDemo() {
  const [values, setValues] = useState<string[]>(["design", "engineering"]);

  return (
    <Space orientation="vertical">
      <Select
        aria-label="负责团队"
        mode="multiple"
        showSearch
        optionFilterProp="label"
        maxTagCount={2}
        value={values}
        onChange={(next) => setValues(Array.isArray(next) ? next : [next])}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Text tone="muted" aria-live="polite">
        已选择：{values.length ? values.join("、") : "暂无团队"}
      </Text>
    </Space>
  );
}
