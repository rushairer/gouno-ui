import { useState } from "react";
import { Alert, Button, Segmented, Spinner, Text } from "../../../../src/core";
import { AuthSurface } from "./shared";

type CallbackState = "loading" | "error";
const states = [
  { label: "处理中", value: "loading" },
  { label: "失败", value: "error" },
] as const;

export function GossoCallbackDemo() {
  const [state, setState] = useState<CallbackState>("loading");

  return (
    <AuthSurface
      route="/callback?code=fixture&state=fixture"
      title={state === "loading" ? "正在完成身份验证" : "身份验证失败"}
      description={state === "loading" ? "正在交换授权码并恢复目标会话，请勿关闭页面。" : "授权回调参数无效或授权码交换失败。"}
      fixtureControl={(
        <Segmented<CallbackState>
          value={state}
          options={states}
          onChange={setState}
          aria-label="Callback 场景 Fixture"
        />
      )}
    >
      {state === "loading" ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <Spinner className="size-6" />
          <Text size="sm" tone="muted">正在验证 OAuth 2.0 Authorization Code + PKCE 回调…</Text>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Alert type="error" showIcon title="CALLBACK_PARAMS_MISSING" description="缺少或无效的授权回调参数。" />
          <Button variant="solid" color="primary" className="w-full" onClick={() => setState("loading")}>返回首页并重试</Button>
        </div>
      )}
    </AuthSurface>
  );
}
