import { useState, type FormEvent } from "react";
import { Check, Copy, Lock, QrCode, RefreshCw } from "lucide-react";
import {
  Alert,
  Button,
  FormField,
  Heading,
  IconButton,
  Input,
  QRCode,
  Segmented,
  Tag,
  Text,
} from "../../../../src/core";
import { FixtureDock } from "../../../components/fixture-dock";
import { ConfirmAction, Section, StatusMessage } from "./shared";

type MfaPreviewState = "disabled" | "enrolling" | "enabled";

const mfaPreviewOptions = [
  { label: "未启用", value: "disabled" },
  { label: "配置中", value: "enrolling" },
  { label: "已启用", value: "enabled" },
] as const;

const backupCodes = ["7HT2-MQ9R", "C4PK-8XLM", "V2JD-6NWF", "K9RA-3TQY", "M5ZX-4HCE", "P8LU-7BGV"] as const;

export function MfaPanel() {
  const [preview, setPreview] = useState<MfaPreviewState>("enabled");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const activate = (event: FormEvent) => {
    event.preventDefault();
    if (verificationCode.length < 6) {
      setStatus("请输入 6 位动态验证码。");
      return;
    }
    setPreview("enabled");
    setVerificationCode("");
    setShowBackupCodes(true);
    setStatus("TOTP 已启用（Showcase 模拟）。");
  };

  return (
    <Section
      description="绑定 TOTP 身份验证器，并管理恢复备用代码。"
      actions={preview === "enabled" ? <Tag color="success">已启用</Tag> : <Tag>{preview === "enrolling" ? "配置中" : "未启用"}</Tag>}
    >
      <FixtureDock
        route="/account-settings/mfa"
        note="真实页面由身份服务返回 MFA 状态；Showcase 仅用本地状态覆盖关键分支。"
        controls={<Segmented<MfaPreviewState> aria-label="MFA 状态预览" options={mfaPreviewOptions} value={preview} onChange={(value) => { setPreview(value); setStatus(null); }} block />}
      />
      <div className="flex flex-col gap-5">
        {status ? <StatusMessage message={status} type={status.startsWith("请输入") ? "error" : "success"} /> : null}
        {preview === "disabled" ? (
          <div className="flex flex-col items-start gap-4 py-2">
            <Text tone="muted" size="sm" className="max-w-2xl leading-relaxed">当前账户尚未绑定身份验证器。启用后，登录时除密码外还需要一次性动态验证码。</Text>
            <Button variant="solid" color="primary" icon={<QrCode />} onClick={() => setPreview("enrolling")}>配置身份验证器</Button>
          </div>
        ) : null}
        {preview === "enrolling" ? (
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
              <div className="mx-auto rounded-lg border bg-white p-4 shadow-sm">
                <QRCode value="otpauth://totp/GOSSO:demo-user?secret=JBSWY3DPEHPK3PXP&issuer=GOSSO" size={180} ariaLabel="GOSSO MFA 配置二维码" />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <Heading level={2} className="text-base">使用身份验证器扫描二维码</Heading>
                  <Text size="sm" tone="muted" className="mt-1 leading-relaxed">如果无法扫描，可以手动输入下面的密钥。真实产品中的密钥由服务端临时生成。</Text>
                </div>
                <div className="flex max-w-lg items-center justify-between gap-3 rounded-md border bg-muted/30 p-3">
                  <code className="min-w-0 truncate font-mono text-xs">JBSWY3DPEHPK3PXP</code>
                  <IconButton label="复制 MFA 密钥" icon={<Copy />} onClick={() => setStatus("MFA 密钥已复制（Showcase 模拟）。")} />
                </div>
              </div>
            </div>
            <form onSubmit={activate} className="flex max-w-xl flex-col gap-4 border-t pt-5">
              <FormField label="动态验证码" required hint="输入身份验证器当前显示的 6 位数字。">
                <Input inputMode="numeric" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" />
              </FormField>
              <div className="flex flex-wrap justify-end gap-2">
                <Button onClick={() => setPreview("disabled")}>取消</Button>
                <Button type="submit" variant="solid" color="primary" icon={<Check />}>验证并启用</Button>
              </div>
            </form>
          </div>
        ) : null}
        {preview === "enabled" ? (
          <div className="flex flex-col gap-5">
            <Alert type="success" showIcon title="账户已受 TOTP 保护" description="已注册一个身份验证器。备用代码可在主设备不可用时恢复访问。" />
            <div className="flex flex-wrap gap-2">
              <ConfirmAction
                triggerLabel="重新生成备用代码"
                title="重新生成备用代码？"
                description="旧备用代码将立即失效。真实产品会在此步骤要求近期强认证。"
                confirmLabel="重新生成"
                color="primary"
                icon={<RefreshCw />}
                onConfirm={() => { setShowBackupCodes(true); setStatus("已生成一组新的备用代码（Showcase 模拟）。"); }}
              />
              <ConfirmAction
                triggerLabel="停用两步验证"
                title="停用多因素认证？"
                description="停用后账户将只依赖主登录凭据，请确认这是预期操作。"
                confirmLabel="确认停用"
                icon={<Lock />}
                onConfirm={() => { setPreview("disabled"); setShowBackupCodes(false); setStatus("MFA 已停用（Showcase 模拟）。"); }}
              />
            </div>
          </div>
        ) : null}
        {showBackupCodes && preview === "enabled" ? (
          <section className="flex flex-col gap-4 border-t pt-5" aria-labelledby="gosso-backup-codes-heading">
            <Heading id="gosso-backup-codes-heading" level={2} className="text-base">恢复备用代码</Heading>
            <Text size="sm" tone="muted">每个代码只能使用一次。请保存到与主身份验证器分离的安全位置。</Text>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {backupCodes.map((code) => <code key={code} className="rounded-md border bg-muted/30 px-3 py-2 text-center font-mono text-sm">{code}</code>)}
            </div>
            <div><Button size="small" icon={<Copy />} onClick={() => setStatus("备用代码已复制（Showcase 模拟）。")}>复制全部代码</Button></div>
          </section>
        ) : null}
      </div>
    </Section>
  );
}
