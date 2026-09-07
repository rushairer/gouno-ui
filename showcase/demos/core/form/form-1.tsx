import { useState } from "react";

import { Button, Field, Form, Input, Text } from "../../../../src/core";
function FormValidationDemo() {
  const [message, setMessage] = useState("尚未提交");
  return (
    <Form
      onFinish={(_data, values) => setMessage(`已提交：${values.siteName}`)}
      onFinishFailed={() => setMessage("请检查必填字段")}
    >
      <Field label="站点名称" required>
        <Input name="siteName" defaultValue="Gouno" />
      </Field>
      <Field label="联系邮箱" required>
        <Input name="email" type="email" />
      </Field>
      <Button type="submit" variant="solid" color="primary">
        校验并提交
      </Button>
      <Text tone="muted" aria-live="polite">
        {message}
      </Text>
    </Form>
  );
}
export default function Example15() {
  return <FormValidationDemo />;
}
