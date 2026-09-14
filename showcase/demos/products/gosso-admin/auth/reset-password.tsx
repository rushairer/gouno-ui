import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Alert, Button, FormField, IconButton, Input, Segmented } from "../../../../../src/core";
import { AuthSurface } from "./shared";

type ResetScenario = "valid" | "expired" | "invalid" | "error";

const scenarios = [
  { label: "有效链接", value: "valid" },
  { label: "已过期", value: "expired" },
  { label: "无效链接", value: "invalid" },
  { label: "服务异常", value: "error" },
] as const;

export function GossoResetPasswordDemo() {
  const [scenario, setScenario] = useState<ResetScenario>("valid");
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

  const changeScenario = (next: ResetScenario) => {
    setScenario(next);
    setMessage(null);
    setSuccess(false);
    setPassword("");
    setConfirm("");
  };

  const unavailable = scenario !== "valid";
  const stateAlert = scenario === "expired"
    ? <Alert type="warning" showIcon title="密码重置链接已过期" description="请重新发起密码重置请求以获取新的单次链接。" className="mb-5" />
    : scenario === "invalid"
      ? <Alert type="error" showIcon title="密码重置链接无效" description="链接缺失、已使用或签名无效，无法继续重置密码。" className="mb-5" />
      : scenario === "error"
        ? <Alert type="error" showIcon title="无法验证重置链接" description="身份服务暂时不可用，请稍后重试。" className="mb-5" />
        : null;

  return (
    <AuthSurface
      route="/reset-password#token=fixture"
      title="重置密码"
      description="设置一个新的高强度密码以恢复账户访问。"
      fixtureControl={<Segmented<ResetScenario> value={scenario} options={scenarios} onChange={changeScenario} aria-label="重置密码场景 Fixture" />}
    >
      {stateAlert}
      {message ? <Alert type={success ? "success" : "error"} showIcon title={message} className="mb-5" /> : null}
      {!success && !unavailable ? (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <FormField label="新密码" hint="至少 12 个字符" required>
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              suffix={<IconButton label={show ? "隐藏密码" : "显示密码"} size="small" variant="ghost" icon={show ? <EyeOff /> : <Eye />} onClick={() => setShow((value) => !value)} />}
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
