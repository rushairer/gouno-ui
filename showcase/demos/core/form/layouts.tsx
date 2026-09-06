import { useState } from "react";
import {
  Button,
  Field,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Text,
} from "../../../../src/core";

export default function FormLayoutsDemo() {
  const [layout, setLayout] = useState<"vertical" | "horizontal" | "inline">(
    "vertical",
  );
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "填写邮箱后提交，空值或格式错误会定位到字段。",
  );
  return (
    <Space direction="vertical" align="stretch">
      <Select
        aria-label="表单布局"
        value={layout}
        onChange={(event) => setLayout(event.target.value as typeof layout)}
      >
        <option value="vertical">垂直布局</option>
        <option value="horizontal">水平布局</option>
        <option value="inline">行内布局</option>
      </Select>
      <Space wrap>
        <Switch
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
          aria-label="禁用表单"
        />
        <Text>禁用整个表单</Text>
      </Space>
      <Form
        layout={layout}
        disabled={disabled}
        loading={loading}
        validateMessages={{
          required: "请填写邮箱",
          type: "请输入有效的邮箱地址",
        }}
        onFinishFailed={() => setMessage("校验失败，请检查邮箱字段。")}
        onFinish={(_, values) => {
          setLoading(true);
          setMessage("正在保存…");
          window.setTimeout(() => {
            setLoading(false);
            setMessage(`已保存：${values.email}`);
          }, 600);
        }}
      >
        <Field label="邮箱" required hint="用于接收通知的有效邮箱地址。">
          <Input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </Field>
        <Button type="submit" loading={loading}>
          保存
        </Button>
      </Form>
      <Text role="status">{message}</Text>
    </Space>
  );
}
