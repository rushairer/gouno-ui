import { Button, Field, Form, Input } from "../../../../src/core";

export default function Example14() {
  return (
    <Form>
      <Field label="站点名称" required>
        <Input name="siteName" />
      </Field>
      <Button type="submit">提交</Button>
    </Form>
  );
}
