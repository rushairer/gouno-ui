import { Checkbox, CheckboxField, Space, Text } from "../../../../src/core";

export default function CheckboxFieldDemo() {
  return (
    <Space orientation="vertical" align="start">
      <CheckboxField className="text-sm">
        <Checkbox name="reported-only" />
        仅看被举报内容
      </CheckboxField>
      <Text tone="muted" size="sm">
        CheckboxField owns the composite label; keep the nested Checkbox label prop unset.
      </Text>
    </Space>
  );
}
