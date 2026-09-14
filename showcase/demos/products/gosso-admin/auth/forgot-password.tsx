import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Alert, Button, FormField, Input, Segmented, Spinner, Text } from "../../../../../src/core";
import { AuthSurface } from "./shared";

type ForgotScenario = "form" | "submitting" | "submitted" | "error";

const scenarios = [
  { label: "填写", value: "form" },
  { label: "提交中", value: "submitting" },
  { label: "已提交", value: "submitted" },
  { label: "失败", value: "error" },
] as const;

export function GossoForgotPasswordDemo() {
  const [email, setEmail] = useState("");
  const [scenario, setScenario] = useState<ForgotScenario>("form");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setScenario("submitted");
  };

  return (
    <AuthSurface
      route="/forgot-password"
      title="忘记密码"
      description="输入账户邮箱，我们会发送一次性密码重置链接。"
      fixtureControl={<Segmented<ForgotScenario> value={scenario} options={scenarios} onChange={setScenario} aria-label="忘记密码场景 Fixture" />}
    >
      {scenario === "submitted" ? <Alert type="success" showIcon title="重置请求已受理" description="如果该邮箱对应有效账户，重置链接已经发送（Showcase 模拟）。" className="mb-5" /> : null}
      {scenario === "error" ? <Alert type="error" showIcon title="重置请求暂时失败" description="身份服务暂时无法处理请求，请稍后重试。该错误不会暴露账户是否存在。" className="mb-5" /> : null}
      {scenario === "submitting" ? (
        <div role="status" className="flex flex-col items-center gap-4 py-6">
          <Spinner className="size-6" />
          <Text size="sm" tone="muted">正在提交密码重置请求…</Text>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <FormField label="邮箱" hint="为避免账户枚举，真实服务端无论账户是否存在都会返回一致响应。" required>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" prefix={<Mail />} />
          </FormField>
          <Button type="submit" variant="solid" color="primary" disabled={!email.trim()} className="w-full">发送重置链接</Button>
        </form>
      )}
      <div className="mt-5 text-center"><a href="#gosso-login" className="text-sm font-medium text-primary hover:underline">返回登录</a></div>
    </AuthSurface>
  );
}
