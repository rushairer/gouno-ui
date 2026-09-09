import { useState } from "react";
import { Radio, Space, Text } from "../../../../src/core";

export default function RadioDemo() {
  const [plan, setPlan] = useState("basic");

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">套餐</legend>
      <Space orientation="vertical" align="start">
        <Radio
          name="plan"
          value="basic"
          label="基础版"
          checked={plan === "basic"}
          onChange={(event) => event.currentTarget.checked && setPlan("basic")}
        />
        <Radio
          name="plan"
          value="pro"
          label="专业版"
          checked={plan === "pro"}
          onChange={(event) => event.currentTarget.checked && setPlan("pro")}
        />
        <Radio name="plan" value="legacy" label="旧套餐" disabled />
        <Text size="sm" tone="muted" aria-live="polite">
          当前：{plan === "basic" ? "基础版" : "专业版"}
        </Text>
      </Space>
    </fieldset>
  );
}
