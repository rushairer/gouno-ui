import { useState, type FormEvent, type ReactNode } from "react";
import {
  Calendar,
  Check,
  Copy,
  Edit2,
  Eye,
  EyeOff,
  Key,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Plus,
  QrCode,
  RefreshCw,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Empty,
  FormField,
  Heading,
  IconButton,
  Input,
  Modal,
  QRCode,
  Segmented,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Tag,
  Text,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";

type AccountSettingsTab = "profile" | "password" | "mfa" | "passkeys" | "sessions";
type MfaPreviewState = "disabled" | "enrolling" | "enabled";

interface SectionProps {
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

interface SettingRowProps {
  label: ReactNode;
  children: ReactNode;
}

interface ConfirmActionProps {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  color?: "primary" | "error";
  icon?: ReactNode;
  onConfirm: () => void;
}

interface PasskeyFixture {
  id: string;
  name: string;
  createdAt: string;
  detail: string;
}

interface SessionFixture {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  current?: boolean;
}

const accountTabs = [
  { key: "profile", label: "个人资料", icon: <User aria-hidden="true" className="size-4" /> },
  { key: "password", label: "修改密码", icon: <Lock aria-hidden="true" className="size-4" /> },
  { key: "mfa", label: "多因素认证 (MFA)", icon: <Shield aria-hidden="true" className="size-4" /> },
  { key: "passkeys", label: "通行密钥 (FIDO2)", icon: <Key aria-hidden="true" className="size-4" /> },
  { key: "sessions", label: "活跃会话", icon: <Laptop aria-hidden="true" className="size-4" /> },
] as const;

const mfaPreviewOptions = [
  { label: "未启用", value: "disabled" },
  { label: "配置中", value: "enrolling" },
  { label: "已启用", value: "enabled" },
] as const;

const initialPasskeys: readonly PasskeyFixture[] = [
  { id: "pk-macbook", name: "MacBook Pro", createdAt: "2026-08-18 21:42", detail: "Touch ID · 平台认证器" },
  { id: "pk-iphone", name: "iPhone", createdAt: "2026-08-27 08:15", detail: "Face ID · iCloud 钥匙串" },
];

const initialSessions: readonly SessionFixture[] = [
  { id: "session-current", device: "macOS · Chrome", ip: "203.0.113.42", lastActive: "刚刚", current: true },
  { id: "session-mobile", device: "iPhone · Safari", ip: "198.51.100.17", lastActive: "18 分钟前" },
  { id: "session-office", device: "Windows · Edge", ip: "192.0.2.64", lastActive: "昨天 22:08" },
];

const backupCodes = ["7HT2-MQ9R", "C4PK-8XLM", "V2JD-6NWF", "K9RA-3TQY", "M5ZX-4HCE", "P8LU-7BGV"] as const;

function Section({ title, description, actions, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <PageHeader title={title} description={description} actions={actions} />
      <Card padding="lg" className="overflow-hidden">{children}</Card>
    </section>
  );
}

function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div className="grid gap-2 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="m-0 min-w-0 text-sm">{children}</dd>
    </div>
  );
}

function StatusMessage({ message, type = "success" }: { message: ReactNode; type?: "success" | "error" | "info" }) {
  return <Alert type={type} showIcon title={message} />;
}

function ConfirmAction({ triggerLabel, title, description, confirmLabel, color = "error", icon, onConfirm }: ConfirmActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="small" variant={color === "error" ? "solid" : "outline"} color={color} icon={icon} onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Modal
        open={open}
        title={title}
        description={description}
        onOpenChange={setOpen}
        onOk={() => { onConfirm(); setOpen(false); }}
        okText={confirmLabel}
        cancelText="取消"
        okButtonProps={{ variant: "solid", color }}
      >
        <Text size="sm" tone="muted">这是静态 Showcase fixture；确认后只会更新当前预览状态，不会调用真实身份服务。</Text>
      </Modal>
    </>
  );
}

function ProfilePanel() {
  const [displayName, setDisplayName] = useState("Demo User");
  const [draftName, setDraftName] = useState(displayName);
  const [email, setEmail] = useState("demo.user@example.com");
  const [draftEmail, setDraftEmail] = useState(email);
  const [editingName, setEditingName] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const saveDisplayName = (event: FormEvent) => {
    event.preventDefault();
    const next = draftName.trim();
    if (!next) return;
    setDisplayName(next);
    setEditingName(false);
    setStatus("显示名称已更新。此变化仅保存在当前 Showcase 预览中。");
  };

  return (
    <Section title="个人资料" description="查看并维护账户基础资料、联系邮箱与身份标识。">
      <div className="flex flex-col gap-4">
        {status ? <StatusMessage message={status} /> : null}
        <dl>
          <SettingRow label="用户名"><span className="font-medium">demo-user</span></SettingRow>
          <SettingRow label="显示名称">
            {editingName ? (
              <form onSubmit={saveDisplayName} className="flex max-w-xl flex-wrap items-center gap-2">
                <Input aria-label="显示名称" value={draftName} onChange={(event) => setDraftName(event.target.value)} className="min-w-52 flex-1" autoFocus />
                <IconButton label="保存显示名称" icon={<Check />} variant="solid" color="primary" type="submit" />
                <IconButton label="取消编辑显示名称" icon={<X />} onClick={() => { setDraftName(displayName); setEditingName(false); }} />
              </form>
            ) : (
              <div className="flex max-w-xl items-center justify-between gap-4"><span className="min-w-0 truncate font-medium">{displayName}</span><Button size="small" icon={<Edit2 />} onClick={() => { setDraftName(displayName); setEditingName(true); setStatus(null); }}>编辑</Button></div>
            )}
          </SettingRow>
          <SettingRow label="邮箱">
            <div className="flex max-w-xl items-center justify-between gap-4"><span className="flex min-w-0 items-center gap-2"><Mail aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /><span className="truncate font-medium">{email}</span></span><Button size="small" icon={<Edit2 />} onClick={() => { setDraftEmail(email); setEmailOpen(true); setStatus(null); }}>编辑</Button></div>
          </SettingRow>
          <SettingRow label="安全角色"><div className="flex flex-wrap gap-2"><Tag color="primary">user</Tag><Tag>self-service</Tag></div></SettingRow>
          <SettingRow label="Subject ID"><div className="flex max-w-xl items-center justify-between gap-4"><code className="min-w-0 truncate rounded bg-muted px-2 py-1 font-mono text-xs">01J7M4D9YQK2G7N9F8C3A6X1PB</code><Button size="small" icon={<Copy />} onClick={() => setStatus("Subject ID 已复制（Showcase 模拟）。")}>复制</Button></div></SettingRow>
          <SettingRow label="SSO Issuer"><div className="flex max-w-xl items-center justify-between gap-4"><code className="min-w-0 truncate rounded bg-muted px-2 py-1 font-mono text-xs">https://sso.io84.com</code><Button size="small" icon={<Copy />} onClick={() => setStatus("SSO Issuer 已复制（Showcase 模拟）。")}>复制</Button></div></SettingRow>
        </dl>
      </div>
      <Modal
        open={emailOpen}
        title="修改邮箱"
        description="更新后，真实产品会按身份平台策略执行邮箱校验与重新认证。"
        onOpenChange={(next) => { setEmailOpen(next); if (!next) setDraftEmail(email); }}
        onOk={() => { const next = draftEmail.trim(); if (!next) return; setEmail(next); setStatus("邮箱已更新。此变化仅保存在当前 Showcase 预览中。"); setEmailOpen(false); }}
        okText="保存邮箱"
        okButtonProps={{ disabled: !draftEmail.trim() }}
      >
        <FormField label="邮箱地址" required><Input type="email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} autoComplete="email" /></FormField>
      </Modal>
    </Section>
  );
}

function PasswordPanel() {
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
    if (newPassword.length < 12) { setError("新密码至少需要 12 个字符。"); return; }
    if (newPassword !== confirmPassword) { setError("两次输入的新密码不一致。"); return; }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setSuccess("密码更新流程已完成（Showcase 模拟）。");
  };

  return (
    <Section title="修改密码" description="使用当前密码验证身份，并设置新的登录密码。">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="flex max-w-xl flex-col gap-5">
          {error ? <StatusMessage type="error" message={error} /> : null}
          {success ? <StatusMessage message={success} /> : null}
          <FormField label="当前密码" required><Input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" suffix={<IconButton label={showCurrent ? "隐藏当前密码" : "显示当前密码"} icon={showCurrent ? <EyeOff /> : <Eye />} variant="ghost" onClick={() => setShowCurrent((value) => !value)} />} /></FormField>
          <FormField label="新密码" required hint="至少 12 个字符；真实产品仍由服务端执行完整密码策略校验。"><Input type={showNew ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} autoComplete="new-password" suffix={<IconButton label={showNew ? "隐藏新密码" : "显示新密码"} icon={showNew ? <EyeOff /> : <Eye />} variant="ghost" onClick={() => setShowNew((value) => !value)} />} /></FormField>
          <FormField label="确认新密码" required><Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} autoComplete="new-password" /></FormField>
        </div>
        <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"><Text size="sm" tone="muted" aria-live="polite">{dirty ? "存在尚未提交的密码修改。" : "当前没有待提交的修改。"}</Text><Button type="submit" variant="solid" color="primary" icon={<Lock />} disabled={!currentPassword || !newPassword || !confirmPassword}>修改密码</Button></div>
      </form>
    </Section>
  );
}

function MfaPanel() {
  const [preview, setPreview] = useState<MfaPreviewState>("enabled");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const activate = (event: FormEvent) => {
    event.preventDefault();
    if (verificationCode.length < 6) { setStatus("请输入 6 位动态验证码。"); return; }
    setPreview("enabled"); setVerificationCode(""); setShowBackupCodes(true); setStatus("TOTP 已启用（Showcase 模拟）。");
  };

  return (
    <Section
      title="多因素认证 (MFA)"
      description="绑定 TOTP 身份验证器，并管理恢复备用代码。"
      actions={preview === "enabled" ? <Tag color="success">已启用</Tag> : <Tag>{preview === "enrolling" ? "配置中" : "未启用"}</Tag>}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"><div><Text as="div" size="sm" className="font-medium">Showcase 状态预览</Text><Text size="xs" tone="muted">真实页面由身份服务返回的 MFA 状态决定。</Text></div><Segmented<MfaPreviewState> aria-label="MFA 状态预览" options={mfaPreviewOptions} value={preview} onChange={(value) => { setPreview(value); setStatus(null); }} /></div>
        {status ? <StatusMessage message={status} type={status.startsWith("请输入") ? "error" : "success"} /> : null}
        {preview === "disabled" ? <div className="flex flex-col items-start gap-4 py-2"><Text tone="muted" size="sm" className="max-w-2xl leading-relaxed">当前账户尚未绑定身份验证器。启用后，登录时除密码外还需要一次性动态验证码。</Text><Button variant="solid" color="primary" icon={<QrCode />} onClick={() => setPreview("enrolling")}>配置身份验证器</Button></div> : null}
        {preview === "enrolling" ? (
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center"><div className="mx-auto rounded-lg border bg-white p-4 shadow-sm"><QRCode value="otpauth://totp/GOSSO:demo-user?secret=JBSWY3DPEHPK3PXP&issuer=GOSSO" size={180} ariaLabel="GOSSO MFA 配置二维码" /></div><div className="flex flex-col gap-4"><div><Heading level={3} className="text-base">使用身份验证器扫描二维码</Heading><Text size="sm" tone="muted" className="mt-1 leading-relaxed">如果无法扫描，可以手动输入下面的密钥。真实产品中的密钥由服务端临时生成。</Text></div><div className="flex max-w-lg items-center justify-between gap-3 rounded-md border bg-muted/30 p-3"><code className="min-w-0 truncate font-mono text-xs">JBSWY3DPEHPK3PXP</code><IconButton label="复制 MFA 密钥" icon={<Copy />} onClick={() => setStatus("MFA 密钥已复制（Showcase 模拟）。")} /></div></div></div>
            <form onSubmit={activate} className="flex max-w-xl flex-col gap-4 border-t pt-5"><FormField label="动态验证码" required hint="输入身份验证器当前显示的 6 位数字。"><Input inputMode="numeric" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" /></FormField><div className="flex flex-wrap justify-end gap-2"><Button onClick={() => setPreview("disabled")}>取消</Button><Button type="submit" variant="solid" color="primary" icon={<Check />}>验证并启用</Button></div></form>
          </div>
        ) : null}
        {preview === "enabled" ? (
          <div className="flex flex-col gap-5"><Alert type="success" showIcon title="账户已受 TOTP 保护" description="已注册一个身份验证器。备用代码可在主设备不可用时恢复访问。" /><div className="flex flex-wrap gap-2"><ConfirmAction triggerLabel="重新生成备用代码" title="重新生成备用代码？" description="旧备用代码将立即失效。真实产品会在此步骤要求近期强认证。" confirmLabel="重新生成" color="primary" icon={<RefreshCw />} onConfirm={() => { setShowBackupCodes(true); setStatus("已生成一组新的备用代码（Showcase 模拟）。"); }} /><ConfirmAction triggerLabel="停用两步验证" title="停用多因素认证？" description="停用后账户将只依赖主登录凭据，请确认这是预期操作。" confirmLabel="确认停用" icon={<Lock />} onConfirm={() => { setPreview("disabled"); setShowBackupCodes(false); setStatus("MFA 已停用（Showcase 模拟）。"); }} /></div></div>
        ) : null}
        {showBackupCodes && preview === "enabled" ? <section className="flex flex-col gap-4 border-t pt-5" aria-labelledby="gosso-backup-codes-heading"><Heading id="gosso-backup-codes-heading" level={3} className="text-base">恢复备用代码</Heading><Text size="sm" tone="muted">每个代码只能使用一次。请保存到与主身份验证器分离的安全位置。</Text><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{backupCodes.map((code) => <code key={code} className="rounded-md border bg-muted/30 px-3 py-2 text-center font-mono text-sm">{code}</code>)}</div><div><Button size="small" icon={<Copy />} onClick={() => setStatus("备用代码已复制（Showcase 模拟）。")}>复制全部代码</Button></div></section> : null}
      </div>
    </Section>
  );
}

function PasskeysPanel() {
  const [passkeys, setPasskeys] = useState<PasskeyFixture[]>(() => [...initialPasskeys]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const openRegistration = () => { setDraftName(""); setStatus(null); setModalOpen(true); };
  const addPasskey = () => {
    const name = draftName.trim(); if (!name) return;
    setPasskeys((items) => [...items, { id: `fixture-passkey-${items.length + 1}`, name, createdAt: "刚刚", detail: "WebAuthn · Showcase 模拟设备" }]);
    setStatus(`已注册通行密钥“${name}”（Showcase 模拟）。`); setDraftName(""); setModalOpen(false);
  };

  return (
    <Section title="通行密钥 (FIDO2)" description="使用设备生物识别或安全密钥完成抗钓鱼登录。" actions={<Button variant="solid" color="primary" icon={<Plus />} onClick={openRegistration}>添加通行密钥</Button>}>
      <div className="flex flex-col gap-4">
        {status ? <StatusMessage message={status} /> : null}
        {passkeys.length === 0 ? <Empty icon={<Key aria-hidden="true" className="size-6 text-muted-foreground" />} title="还没有通行密钥" description="添加一台可信设备，使用 WebAuthn 进行安全登录。" action={<Button icon={<Plus />} onClick={openRegistration}>添加通行密钥</Button>} /> : (
          <ul className="divide-y rounded-lg border" aria-label="已注册通行密钥">{passkeys.map((passkey) => <li key={passkey.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Key aria-hidden="true" className="size-4" /></span><div className="min-w-0"><Text as="div" className="truncate font-semibold">{passkey.name}</Text><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>{passkey.detail}</span><span className="flex items-center gap-1"><Calendar aria-hidden="true" className="size-3" />{passkey.createdAt}</span></div></div></div><ConfirmAction triggerLabel="移除" title={`移除“${passkey.name}”？`} description="移除后，这台设备将不能再使用此通行密钥登录。" confirmLabel="确认移除" icon={<Trash2 />} onConfirm={() => { setPasskeys((items) => items.filter((item) => item.id !== passkey.id)); setStatus(`已移除通行密钥“${passkey.name}”（Showcase 模拟）。`); }} /></li>)}</ul>
        )}
      </div>
      <Modal open={modalOpen} title="注册通行密钥" description="先为这台设备命名，真实产品随后会启动浏览器 WebAuthn 注册流程。" onOpenChange={(next) => { setModalOpen(next); if (!next) setDraftName(""); }} onOk={addPasskey} okText="注册设备" okButtonProps={{ disabled: !draftName.trim() }}><FormField label="设备名称" required><Input value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="例如：办公 MacBook Pro" autoFocus /></FormField></Modal>
    </Section>
  );
}

function SessionsPanel() {
  const [sessions, setSessions] = useState<SessionFixture[]>(() => [...initialSessions]);
  const [status, setStatus] = useState<string | null>(null);
  return (
    <Section title="活跃会话" description="查看当前登录设备、IP 地址与最后活动时间，并终止异常会话。">
      <div className="flex flex-col gap-4">
        {status ? <StatusMessage message={status} /> : null}
        {sessions.length === 0 ? <Empty title="没有活跃会话" description="身份服务当前没有返回可展示的登录会话。" /> : (
          <Table bordered><TableHeader><TableRow><TableHead>设备 / 浏览器</TableHead><TableHead>IP 地址</TableHead><TableHead>最后活动</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader><TableBody>{sessions.map((session) => <TableRow key={session.id}><TableCell><div className="flex min-w-52 items-center gap-2"><Laptop aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /><span className="font-medium">{session.device}</span>{session.current ? <Tag color="success">当前会话</Tag> : null}</div></TableCell><TableCell><span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground"><MapPin aria-hidden="true" className="size-3" />{session.ip}</span></TableCell><TableCell className="whitespace-nowrap text-sm text-muted-foreground">{session.lastActive}</TableCell><TableCell className="text-right">{session.current ? <Button size="small" icon={<LogOut />} onClick={() => setStatus("Showcase 不执行真实登出；生产环境会结束当前会话并离开此页面。")}>退出登录</Button> : <ConfirmAction triggerLabel="终止会话" title={`终止 ${session.device} 会话？`} description="终止后，该设备需要重新进行身份验证。" confirmLabel="确认终止" onConfirm={() => { setSessions((items) => items.filter((item) => item.id !== session.id)); setStatus(`${session.device} 会话已终止（Showcase 模拟）。`); }} />}</TableCell></TableRow>)}</TableBody></Table>
        )}
      </div>
    </Section>
  );
}

function AccountSettingsPanel({ tab }: { tab: AccountSettingsTab }) {
  switch (tab) {
    case "profile": return <ProfilePanel />;
    case "password": return <PasswordPanel />;
    case "mfa": return <MfaPanel />;
    case "passkeys": return <PasskeysPanel />;
    case "sessions": return <SessionsPanel />;
  }
}

export function GossoAccountSettingsDemo() {
  const [activeTab, setActiveTab] = useState<AccountSettingsTab>("profile");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><Text as="div" size="sm" className="font-medium">真实产品路由</Text><Text size="xs" tone="muted" className="mt-0.5"><code className="font-mono">/account-settings/{activeTab}</code> · Showcase 使用本地状态模拟路由 Tab。</Text></div><Tag>静态 Fixture</Tag></div>
      <Tabs<AccountSettingsTab> activeKey={activeTab} items={accountTabs} onChange={setActiveTab} ariaLabel="账户设置栏目" />
      <AccountSettingsPanel tab={activeTab} />
    </div>
  );
}
