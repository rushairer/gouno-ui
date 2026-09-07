import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Alert, Button, FormField, Input } from "../../../../src/core";
import { AuthSurface } from "./shared";

export function GossoForgotPasswordDemo() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <AuthSurface route="/forgot-password" title="忘记密码" description="输入账户邮箱，我们会发送一次性密码重置链接。">
      {submitted ? <Alert className="mb-5">如果该邮箱对应有效账户，重置链接已经发送（Showcase 模拟）。</Alert> : null}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <FormField label="邮箱" hint="为避免账户枚举，真实服务端无论账户是否存在都会返回一致响应。" required>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" prefix={<Mail />} />
        </FormField>
        <Button type="submit" variant="solid" color="primary" disabled={!email.trim()} className="w-full">发送重置链接</Button>
      </form>
      <div className="mt-5 text-center"><a href="#gosso-login" className="text-sm font-medium text-primary hover:underline">返回登录</a></div>
    </AuthSurface>
  );
}
