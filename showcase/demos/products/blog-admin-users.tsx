import { useState } from "react";
import {
  Ban,
  Copy,
  Crown,
  ExternalLink,
  KeyRound,
  Lock,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Empty,
  FormField,
  IconButton,
  Input,
  Modal,
  Segmented,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { FixtureDock } from "../../components/fixture-dock";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type SecurityState = "unlocked" | "locked";
type MembershipStatus = "active" | "suspended" | "removed";
type MemberRole = "owner" | "admin" | "editor" | "author" | "moderator";

type MemberFixture = {
  id: string;
  subject: string;
  displayName: string;
  email: string;
  status: MembershipStatus;
  role: MemberRole;
  current?: boolean;
};

type ConfirmAction = "suspend" | "restore" | "transfer";
type ConfirmTarget = { memberId: string; action: ConfirmAction } | null;

const initialMembers: readonly MemberFixture[] = [
  {
    id: "member-01",
    subject: "01J7M4D9YQK2G7N9F8C3A6X1PB",
    displayName: "Aben",
    email: "aben@example.com",
    status: "active",
    role: "owner",
    current: true,
  },
  {
    id: "member-02",
    subject: "01J7M5Q2KTE8NR1ZC4P6VM9H3D",
    displayName: "内容编辑",
    email: "editor@example.com",
    status: "active",
    role: "editor",
  },
  {
    id: "member-03",
    subject: "01J7M6AB8PX4D1R3V9TC5W2H7K",
    displayName: "社区审核",
    email: "moderator@example.com",
    status: "active",
    role: "moderator",
  },
  {
    id: "member-04",
    subject: "01J7M71KCQ9N4B2DF6RW8ZT5PX",
    displayName: "暂停作者",
    email: "author@example.com",
    status: "suspended",
    role: "author",
  },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

const securityOptions = [
  { value: "unlocked", label: "已解锁" },
  { value: "locked", label: "已锁定" },
] as const;

const roleOptions: readonly { value: MemberRole; label: string }[] = [
  { value: "admin", label: "管理员" },
  { value: "editor", label: "编辑" },
  { value: "author", label: "作者" },
  { value: "moderator", label: "审核员" },
];

const roleLabels: Record<MemberRole, string> = {
  owner: "所有者",
  admin: "管理员",
  editor: "编辑",
  author: "作者",
  moderator: "审核员",
};

function statusLabel(status: MembershipStatus) {
  if (status === "active") return "已启用";
  if (status === "suspended") return "已暂停";
  return "已移除";
}

function StatusTag({ status }: { status: MembershipStatus }) {
  if (status === "active") return <Tag color="success">{statusLabel(status)}</Tag>;
  return <Tag color="error">{statusLabel(status)}</Tag>;
}

function RoleTag({ role }: { role: MemberRole }) {
  if (role === "owner") return <Tag color="warning">{roleLabels[role]}</Tag>;
  if (role === "admin") return <Tag color="primary">{roleLabels[role]}</Tag>;
  return <Tag>{roleLabels[role]}</Tag>;
}

function LoadingMembers() {
  return (
    <Card padding="base" aria-label="成员加载中">
      <div className="flex flex-col gap-4" role="status" aria-live="polite">
        <Text size="sm" tone="muted">正在同步成员目录…</Text>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid gap-3 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_9rem_8rem]">
            <div className="flex items-center gap-3"><Skeleton className="size-9 rounded-full" /><div className="flex flex-1 flex-col gap-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-52" /></div></div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BlogAdminUsersDemo() {
  const [members, setMembers] = useState<MemberFixture[]>(() => [...initialMembers]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [security, setSecurity] = useState<SecurityState>("unlocked");
  const [notice, setNotice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState<MemberRole>("author");
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null);

  const editing = members.find((member) => member.id === editingId) ?? null;
  const confirmMember = confirmTarget ? members.find((member) => member.id === confirmTarget.memberId) ?? null : null;

  const openEditor = (member: MemberFixture) => {
    setEditingId(member.id);
    setDraftName(member.displayName);
    setDraftRole(member.role === "owner" ? "admin" : member.role);
  };

  const saveMember = () => {
    if (!editing) return;
    const nextName = draftName.trim() || editing.displayName;
    setMembers((current) => current.map((member) => member.id === editing.id
      ? { ...member, displayName: nextName, role: member.role === "owner" ? "owner" : draftRole }
      : member));
    setNotice(`成员“${nextName}”的信息与权限已更新（Showcase 模拟）。`);
    setEditingId(null);
  };

  const executeConfirm = () => {
    if (!confirmTarget || !confirmMember) return;
    const { action } = confirmTarget;
    if (action === "transfer") {
      setMembers((current) => current.map((member) => {
        if (member.role === "owner") return { ...member, role: "admin" };
        if (member.id === confirmMember.id) return { ...member, role: "owner" };
        return member;
      }));
      setNotice(`Blog 所有权已移交给“${confirmMember.displayName}”（Showcase 模拟）。`);
    } else {
      const nextStatus: MembershipStatus = action === "suspend" ? "suspended" : "active";
      setMembers((current) => current.map((member) => member.id === confirmMember.id ? { ...member, status: nextStatus } : member));
      setNotice(`成员“${confirmMember.displayName}”已${action === "suspend" ? "暂停" : "恢复"}（Showcase 模拟）。`);
    }
    setConfirmTarget(null);
  };

  const memberActions = (member: MemberFixture) => (
    <div className="flex flex-wrap items-center justify-end gap-1">
      <IconButton
        label={`复制 ${member.displayName} Subject ID`}
        icon={<Copy />}
        variant="ghost"
        onClick={() => setNotice(`已复制 Subject ID：${member.subject}（Showcase 模拟）。`)}
      />
      <IconButton
        label={`编辑 ${member.displayName} 成员与权限`}
        icon={<KeyRound />}
        onClick={() => openEditor(member)}
      />
      {!member.current && member.status === "active" ? (
        <IconButton
          label={`暂停 ${member.displayName}`}
          icon={<Ban />}
          color="error"
          onClick={() => setConfirmTarget({ memberId: member.id, action: "suspend" })}
        />
      ) : null}
      {!member.current && member.status === "suspended" ? (
        <IconButton
          label={`恢复 ${member.displayName}`}
          icon={<RotateCcw />}
          onClick={() => setConfirmTarget({ memberId: member.id, action: "restore" })}
        />
      ) : null}
      {!member.current && member.status === "active" && member.role !== "owner" ? (
        <IconButton
          label={`移交所有权给 ${member.displayName}`}
          icon={<Crown />}
          onClick={() => setConfirmTarget({ memberId: member.id, action: "transfer" })}
        />
      ) : null}
    </div>
  );

  const body = (() => {
    if (scenario === "error") {
      return (
        <Alert
          type="error"
          showIcon
          title="成员目录加载失败"
          description="无法同步 Blog 成员与角色。真实产品会保留当前权限上下文并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      );
    }

    if (scenario === "loading") return <LoadingMembers />;

    if (scenario === "empty") {
      return (
        <Card padding="lg">
          <Empty
            title="暂未同步到任何登录用户"
            description="成员目录会在用户首次登录 Blog 后建立产品侧成员关系。"
            action={<Button onClick={() => setScenario("data")}>恢复示例成员</Button>}
          />
        </Card>
      );
    }

    if (security === "locked") {
      return (
        <Card padding="base" className="border-primary/20 bg-accent/20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Lock aria-hidden="true" className="size-6" /></div>
            <div className="flex flex-col gap-2">
              <Text className="text-lg font-semibold">成员与权限安全保护</Text>
              <Text size="sm" tone="muted" className="leading-relaxed">修改 Blog 成员角色、移交所有权或暂停成员资格需要近期多因素身份认证。解锁后享有 10 分钟无打扰操作期。</Text>
            </div>
            <Button variant="solid" color="primary" icon={<KeyRound />} onClick={() => setSecurity("unlocked")}>完成 MFA 并解锁</Button>
            <Text size="xs" tone="muted">安全认证由统一身份中心提供；这里仅模拟产品交互状态。</Text>
          </div>
        </Card>
      );
    }

    return (
      <>
        <Alert
          type="success"
          showIcon
          title="高权限操作已解锁"
          description="当前 Showcase 模拟近期 MFA 已完成；真实产品会在约 10 分钟后重新要求验证。"
          action={<Button size="small" onClick={() => setSecurity("locked")}>重新锁定</Button>}
        />

        <div className="hidden md:block">
          <Table density="compact" bordered>
            <TableHeader>
              <TableRow>
                <TableHead>成员</TableHead>
                <TableHead className="w-40">账号 ID</TableHead>
                <TableHead className="w-32">Blog 角色</TableHead>
                <TableHead className="w-28">状态</TableHead>
                <TableHead className="w-56 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="min-w-64 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{member.displayName.slice(0, 2).toUpperCase()}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{member.displayName}</span>{member.current ? <Tag color="primary">当前用户</Tag> : null}</div>
                        <Text size="xs" tone="muted" className="break-all">{member.email}</Text>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><code className="font-mono text-xs text-muted-foreground">{member.subject.slice(0, 8)}</code></TableCell>
                  <TableCell><RoleTag role={member.role} /></TableCell>
                  <TableCell><StatusTag status={member.status} /></TableCell>
                  <TableCell>{memberActions(member)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-3 md:hidden" role="list" aria-label="成员列表">
          {members.map((member) => (
            <Card key={member.id} padding="base" role="listitem">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{member.displayName.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3"><span className="font-semibold">{member.displayName}</span><StatusTag status={member.status} /></div>
                    <Text size="xs" tone="muted" className="mt-1 break-all">{member.email}</Text>
                    <div className="mt-2"><RoleTag role={member.role} /></div>
                  </div>
                </div>
                {memberActions(member)}
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  })();

  const confirmTitle = confirmTarget?.action === "transfer"
    ? "移交 Blog 所有权"
    : confirmTarget?.action === "suspend"
      ? "暂停成员"
      : "恢复成员";
  const confirmDescription = !confirmMember
    ? undefined
    : confirmTarget?.action === "transfer"
      ? `将 Blog 所有者权限移交给“${confirmMember.displayName}”？当前所有者会降为管理员。`
      : confirmTarget?.action === "suspend"
        ? `暂停“${confirmMember.displayName}”后，该成员将无法继续使用需要成员资格的后台能力。`
        : `恢复“${confirmMember.displayName}”的 Blog 成员资格？`;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/users"
        note="真实 Blog Admin 成员与权限页面；Fixture 只模拟成员目录与 Sudo/MFA 状态，不连接真实 GOSSO 或 Blog API。"
        controls={(
          <div className="flex flex-col gap-3">
            <Segmented<FixtureScenario>
              aria-label="成员页 Fixture 状态"
              options={scenarioOptions}
              value={scenario}
              onChange={(value) => { setScenario(value); setNotice(null); }}
              block
            />
            <Segmented<SecurityState>
              aria-label="高权限安全状态"
              options={securityOptions}
              value={security}
              onChange={setSecurity}
              block
            />
          </div>
        )}
      />

      <PageHeader
        title="成员与权限"
        description="管理 Blog 后台成员与角色分配；身份认证与账号安全由 GOSSO 提供。"
        actions={(
          <>
            <Button icon={<RefreshCw />} onClick={() => { setScenario("data"); setNotice("成员目录已刷新（Showcase 模拟）。"); }}>刷新</Button>
            <Button icon={<ExternalLink />} onClick={() => setNotice("将在新窗口打开 GOSSO 管理控制台（Showcase 模拟）。")}>前往 GOSSO 管理</Button>
          </>
        )}
      />

      {notice ? <Alert type="success" showIcon title={notice} closable={{ onClose: () => setNotice(null) }} /> : null}
      {body}

      <Modal
        open={editing !== null}
        title={editing ? `编辑 ${editing.displayName} 的成员信息与权限` : "编辑成员"}
        description="Blog 角色决定产品内的内容和运营权限；账号密码与 MFA 仍由 GOSSO 管理。"
        onOpenChange={(open) => { if (!open) setEditingId(null); }}
        onOk={saveMember}
        okText="保存成员"
      >
        <div className="flex flex-col gap-5">
          <FormField label="显示名称" required>
            <Input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
          </FormField>
          <FormField label="Blog 角色" hint={editing?.role === "owner" ? "当前所有者角色只能通过所有权移交流程变更。" : "每次只保留一个主角色用于此 Showcase fixture。"}>
            <Select
              aria-label="Blog 角色"
              value={editing?.role === "owner" ? "owner" : draftRole}
              disabled={editing?.role === "owner"}
              onChange={(value) => setDraftRole(String(value) as MemberRole)}
            >
              {editing?.role === "owner" ? <option value="owner">所有者</option> : null}
              {roleOptions.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            </Select>
          </FormField>
        </div>
      </Modal>

      <Modal
        open={confirmTarget !== null}
        title={confirmTitle}
        description={confirmDescription}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null); }}
        onOk={executeConfirm}
        okText={confirmTarget?.action === "transfer" ? "确认移交" : confirmTarget?.action === "suspend" ? "确认暂停" : "确认恢复"}
        okButtonProps={confirmTarget?.action === "suspend" ? { variant: "solid", color: "error" } : undefined}
      >
        <Alert
          type="warning"
          showIcon
          title="这是高权限操作"
          description="真实产品会要求 Sudo/MFA 最近验证，并由后端再次校验当前操作者权限。"
        />
      </Modal>
    </div>
  );
}
