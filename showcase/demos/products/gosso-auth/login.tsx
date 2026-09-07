import { useState, type FormEvent } from "react";
import { KeyRound, Shield } from "lucide-react";
import { Alert, Button, FormField, Input, Segmented, Text } from "../../../../src/core";
import { AuthSurface, DividerLabel } from "./shared";

type LoginScenario = "password" | "mfa" | "sudo";

const scenarios = [
  { label: "密码登录", value: "password" },
  { label: "MFA", value: "mfa" },
  { label: "Sudo", value: "sudo" },
] as const;

export function GossoLoginDemo() {
  const [scenario, setScenario] = useState<LoginScenario>("password");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const submitPassword = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setMessage("请输入用户名和密码。");
      return;
    }
    setScenario("mfa");
    setMessage("密码验证通过；fixture 模拟服务端要求第二因素。");
  };

  const submitMfa = (event: FormEvent) => {
    event.preventDefault();
    if (code.trim().length < 6) {
      setMessage("请输入 6–8 位动态验证码。");
      return;
    }
    setMessage(scenario === "sudo" ? "强认证已完成（Showcase 模拟）。" : "登录成功（Showcase 模拟）。");
  };

  return (
    <div className="relative min-h-dvh">
      <div className="absolute left-1/2 top-4 z-10 w-[min(92vw,420px)] -translate-x-1/2 rounded-lg border bg-background/90 p-2 shadow-sm backdrop-blur">
        <Segmented<LoginScenario> value={scenario} options={scenarios} onChange={setScenario} ariaLabel="登录场景 Fixture" />
      </div>
      <AuthSurface
        route="/login"
        title={scenario === "sudo" ? "验证敏感操作" : "统一身份中心"}
        description={scenario === "sudo" ? "对当前管理员进行强认证，再继续高风险管理操作。" : "安全登录并继续访问受保护的 Gouno 产品。"}
      >
        {message ? <Alert className="mb-5">{message}</Alert> : null}

        {scenario === "password" ? (
          <form onSubmit={submitPassword} className="flex flex-col gap-4">
            <FormField label="用户名" required>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            </FormField>
            <FormField label="密码" required>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            </FormField>
            <div className="text-right"><a className="text-xs font-medium text-primary hover:underline" href="#gosso-forgot-password">忘记密码？</a></div>
            <Button type="submit" variant="solid" color="primary" className="w-full">登录</Button>
            <DividerLabel>或</DividerLabel>
            <Button type="button" icon={<KeyRound />} className="w-full" onClick={() => setMessage("通行密钥登录成功（Showcase 模拟）。")}>使用通行密钥登录</Button>
          </form>
        ) : (
          <form onSubmit={submitMfa} className="flex flex-col gap-4">
            {scenario === "sudo" ? (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-medium"><Shield aria-hidden="true" className="size-4 text-primary" />Administrator</div>
                <Text size="sm" tone="muted" className="mt-2">当前会话已登录；请输入身份验证器动态码或使用通行密钥完成 step-up。</Text>
              </div>
            ) : <Alert>当前账号已通过密码验证，需要完成多因素认证。</Alert>}
            <FormField label="动态验证码" required>
              <Input inputMode="numeric" maxLength={8} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="text-center text-xl font-semibold tracking-[0.28em]" />
            </FormField>
            <Button type="submit" variant="solid" color="primary" className="w-full">{scenario === "sudo" ? "完成强认证" : "验证并登录"}</Button>
            <DividerLabel>或</DividerLabel>
            <Button type="button" icon={<KeyRound />} className="w-full" onClick={() => setMessage(scenario === "sudo" ? "通行密钥强认证成功（Showcase 模拟）。" : "通行密钥登录成功（Showcase 模拟）。")}>使用通行密钥</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => { setScenario("password"); setCode(""); setMessage(null); }}>返回密码登录</Button>
          </form>
        )}
      </AuthSurface>
    </div>
  );
}
