import {
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Text,
} from "../../../../src/core";

export default function FieldAnatomyDemo() {
  return (
    <FieldSet>
      <FieldLegend>通知偏好</FieldLegend>
      <Text size="sm" tone="muted">
        低层 Field anatomy 适合需要原生 fieldset/legend 分组，但不需要高层 FormField 克隆控件能力的场景。
      </Text>
      <FieldGroup>
        <div className="space-y-2">
          <FieldLabel htmlFor="digest-email">摘要邮箱</FieldLabel>
          <Input id="digest-email" type="email" defaultValue="ops@example.com" />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="reply-to">回复地址</FieldLabel>
          <Input id="reply-to" type="email" placeholder="reply@example.com" />
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
