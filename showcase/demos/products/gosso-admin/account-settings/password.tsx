import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button, FormField, IconButton, Input, Text } from "../../../../../src/core";
import { Section, StatusMessage } from "./shared";

export function PasswordPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dirty = Boolean(currentPassword || newPassword || confirmPassword);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword.length < 12) {
      setError("新密码至少需要 12 个字符。");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("两次输入的新密码不一致。");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("密码更新流程已完成（Showcase 模拟）。");
  };

  return (
    <Section description="使用当前密码验证身份，并设置新的登录密码。">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="flex max-w-xl flex-col gap-5">
          {error ? <StatusMessage type="error" message={error} /> : null}
          {success ? <StatusMessage message={success} /> : null}
          <FormField label="当前密码" required>
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              suffix={<IconButton label={showCurrent ? "隐藏当前密码" : "显示当前密码"} icon={showCurrent ? <EyeOff /> : <Eye />} variant="ghost" onClick={() => setShowCurrent((value) => !value)} />}
            />
          </FormField>
          <FormField label="新密码" required hint="至少 12 个字符；真实产品仍由服务端执行完整密码策略校验。">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={12}
              autoComplete="new-password"
              suffix={<IconButton label={showNew ? "隐藏新密码" : "显示新密码"} icon={showNew ? <EyeOff /> : <Eye />} variant="ghost" onClick={() => setShowNew((value) => !value)} />}
            />
          </FormField>
          <FormField label="确认新密码" required>
            <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} autoComplete="new-password" />
          </FormField>
        </div>
        <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Text size="sm" tone="muted" aria-live="polite">{dirty ? "存在尚未提交的密码修改。" : "当前没有待提交的修改。"}</Text>
          <Button type="submit" variant="solid" color="primary" icon={<Lock />} disabled={!currentPassword || !newPassword || !confirmPassword}>修改密码</Button>
        </div>
      </form>
    </Section>
  );
}
