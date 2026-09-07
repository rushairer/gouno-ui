import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Alert, Button, FormField, IconButton, Input } from "../../../../src/core";
import { AuthSurface } from "./shared";

export function GossoResetPasswordDemo() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess(false);
    if (password.length < 12) {
      setMessage("新密码至少需要 12 个字符。");
      return;
    }
    if (password !== confirm) {
      setMessage("两次输入的密码不一致。");
      return;
    }
    setMessage("密码已重置（Showcase 模拟）。");
    setSuccess(true);
    setPassword("");
    setConfirm("");
  };

  return (
    <AuthSurface route="/reset-password#token=fixture" title="重置密码" description="设置一个新的高强度密码以恢复账户访问。">
      {message ? <Alert variant={success ? "default" : "destructive"} className="mb-5">{message}</Alert> : null}
      {!success ? (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <FormField label="新密码" hint="至少 12 个字符" required>
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              suffixIcon={
                <IconButton label={show ? "隐藏密码" : "显示密码"} size="small" variant="ghost" icon={show ? <EyeOff /> : <Eye />} onClick={() => setShow((value) => !value)} />
              }
            />
          </FormField>
          <FormField label="确认密码" required>
            <Input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
          </FormField>
          <Button type="submit" variant="solid" color="primary" icon={<Lock />} className="w-full">重置密码</Button>
        </form>
      ) : null}
      <div className="mt-5 text-center"><a href="#gosso-login" className="text-sm font-medium text-primary hover:underline">返回登录</a></div>
    </AuthSurface>
  );
}
