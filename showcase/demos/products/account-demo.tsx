import { useState } from "react";
import { Button, Field, Input } from "../../../src/core";
import { Feedback } from "../../../src/patterns";
import { ActionGroup, PageHeader, Panel } from "../../../src/gouno";

export function AccountDemo({ login = false }: { login?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="mx-auto w-full max-w-xl">
      <PageHeader
        title={login ? "登录与 MFA" : "账户设置"}
        description={
          login
            ? "OIDC、密码和 MFA 状态的静态参考。"
            : "个人资料、安全设置和会话管理。"
        }
      />
      <Panel>
        {submitted ? (
          <Feedback type="success">操作成功，状态已更新。</Feedback>
        ) : (
          <div className="flex flex-col gap-4">
            <Field label={login ? "邮箱" : "显示名称"} required>
              <Input
                defaultValue={login ? "owner@example.com" : "Gouno Owner"}
              />
            </Field>
            <Field label="密码" required>
              <Input type="password" defaultValue="password" />
            </Field>
            <Feedback type="info">
              这是静态 Demo，不会发送网络请求或读取认证信息。
            </Feedback>
            <ActionGroup>
              <Button variant="solid" color="primary" onClick={() => setSubmitted(true)}>
                {login ? "登录" : "保存设置"}
              </Button>
              <Button variant="ghost">取消</Button>
            </ActionGroup>
          </div>
        )}
      </Panel>
    </div>
  );
}

