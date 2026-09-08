import { useState, type FormEvent } from "react";
import { Check, Copy, Edit2, Mail, X } from "lucide-react";
import { Button, FormField, IconButton, Input, Modal, Tag } from "../../../../src/core";
import { Section, SettingRow, StatusMessage } from "./shared";

export function ProfilePanel() {
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
    <Section description="查看并维护账户基础资料、联系邮箱与身份标识。">
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
              <div className="flex max-w-xl items-center justify-between gap-4">
                <span className="min-w-0 truncate font-medium">{displayName}</span>
                <Button size="small" icon={<Edit2 />} onClick={() => { setDraftName(displayName); setEditingName(true); setStatus(null); }}>编辑</Button>
              </div>
            )}
          </SettingRow>
          <SettingRow label="邮箱">
            <div className="flex max-w-xl items-center justify-between gap-4">
              <span className="flex min-w-0 items-center gap-2"><Mail aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /><span className="truncate font-medium">{email}</span></span>
              <Button size="small" icon={<Edit2 />} onClick={() => { setDraftEmail(email); setEmailOpen(true); setStatus(null); }}>编辑</Button>
            </div>
          </SettingRow>
          <SettingRow label="安全角色"><div className="flex flex-wrap gap-2"><Tag color="primary">user</Tag><Tag>self-service</Tag></div></SettingRow>
          <SettingRow label="Subject ID">
            <div className="flex max-w-xl items-center justify-between gap-4">
              <code className="min-w-0 truncate rounded bg-muted px-2 py-1 font-mono text-xs">01J7M4D9YQK2G7N9F8C3A6X1PB</code>
              <Button size="small" icon={<Copy />} onClick={() => setStatus("Subject ID 已复制（Showcase 模拟）。")}>复制</Button>
            </div>
          </SettingRow>
          <SettingRow label="SSO Issuer">
            <div className="flex max-w-xl items-center justify-between gap-4">
              <code className="min-w-0 truncate rounded bg-muted px-2 py-1 font-mono text-xs">https://sso.io84.com</code>
              <Button size="small" icon={<Copy />} onClick={() => setStatus("SSO Issuer 已复制（Showcase 模拟）。")}>复制</Button>
            </div>
          </SettingRow>
        </dl>
      </div>
      <Modal
        open={emailOpen}
        title="修改邮箱"
        description="更新后，真实产品会按身份平台策略执行邮箱校验与重新认证。"
        onOpenChange={(next) => { setEmailOpen(next); if (!next) setDraftEmail(email); }}
        onOk={() => {
          const next = draftEmail.trim();
          if (!next) return;
          setEmail(next);
          setStatus("邮箱已更新。此变化仅保存在当前 Showcase 预览中。");
          setEmailOpen(false);
        }}
        okText="保存邮箱"
        okButtonProps={{ disabled: !draftEmail.trim() }}
      >
        <FormField label="邮箱地址" required>
          <Input type="email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} autoComplete="email" />
        </FormField>
      </Modal>
    </Section>
  );
}
