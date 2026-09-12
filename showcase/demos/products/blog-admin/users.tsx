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
} from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type SecurityState = "unlocked" | "locked" | "expire-on-action";
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
type PendingAction =
  | { type: "save"; memberId: string; displayName: string; role: MemberRole }
  | { type: "confirm"; target: Exclude<ConfirmTarget, null> }
  | null;

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
  { value: "expire-on-action", label: "操作时过期" },
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

const roleDescriptions: Record<Exclude<MemberRole, "owner">, string> = {
  admin: "管理后台成员、站点设置及全站内容",
  editor: "创建、编辑、审核与发布全站内容",
  author: "撰写、发布与管理本人创建的内容",
  moderator: "审核与管理读者评论、互动和举报",
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
  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const editing = members.find((member) => member.id === editingId) ?? null;
  const confirmMember = confirmTarget ? members.find((member) => member.id === confirmTarget.memberId) ?? null : null;

  const openEditor = (member: MemberFixture) => {
    setEditingId(member.id);
    setDraftName(member.displayName);
    setDraftRole(member.role === "owner" ? "admin" : member.role);
  };

  const applyMemberSave = (memberId: string, displayName: string, role: MemberRole) => {
    setMembers((current) => current.map((member) => member.id === memberId
      ? { ...member, displayName, role: member.role === "owner" ? "owner" : role }
      : member));
    setNotice(`成员“${displayName}”的信息与权限已更新（Showcase 模拟）。`);
    setEditingId(null);
  };

  const saveMember = () => {
    if (!editing) return;
    const nextName = draftName.trim() || editing.displayName;
    const nextRole = editing.role === "owner" ? "owner" : draftRole;

    if (security === "expire-on-action") {
      setPendingAction({ type: "save", memberId: editing.id, displayName: nextName, role: nextRole });
      setStepUpOpen(true);
      setEditingId(null);
      setNotice("近期 MFA 已过期；待保存成员变更已保留，完成 Step-Up 后会自动继续。");
      return;
    }

    applyMemberSave(editing.id, nextName, nextRole);
  };

  const applyConfirm = (target: Exclude<ConfirmTarget, null>) => {
    const member = members.find((item) => item.id === target.memberId);
    if (!member) return;

    if (target.action === "transfer") {
      setMembers((current) => current.map((item) => {
        if (item.role === "owner") return { ...item, role: "admin" };
        if (item.id === member.id) return { ...item, role: "owner" };
        return item;
      }));
      setNotice(`Blog 所有权已移交给“${member.displayName}”（Showcase 模拟）。`);
    } else {
      const nextStatus: MembershipStatus = target.action === "suspend" ? "suspended" : "active";
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, status: nextStatus } : item));
      setNotice(`成员“${member.displayName}”已${target.action === "suspend" ? "暂停" : "恢复"}（Showcase 模拟）。`);
    }
    setConfirmTarget(null);
  };

  const executeConfirm = () => {
    if (!confirmTarget || !confirmMember) return;

    if (security === "expire-on-action") {
      setPendingAction({ type: "confirm", target: confirmTarget });
      setStepUpOpen(true);
      setNotice("近期 MFA 已过期；高权限操作已保留，完成 Step-Up 后会自动继续。");
      return;
    }

    applyConfirm(confirmTarget);
  };

  const completeStepUp = () => {
    const pending = pendingAction;
    setSecurity("unlocked");
    setStepUpOpen(false);
    setPendingAction(null);

    if (!pending) {
      setNotice("近期 MFA 已完成（Showcase 模拟）。");
      return;
    }

    if (pending.type === "save") {
      applyMemberSave(pending.memberId, pending.displayName, pending.role);
      return;
    }

    applyConfirm(pending.target);
  };

  const memberActions = (member: MemberFixture) => (
    <div className="flex min-w-max flex-nowrap items-center justify-end gap-1">
      <IconButton
        label={`复制 ${member.displayName} Subject ID`}
        icon={<Copy />}
        variant="ghost"
        onClick={() => setNotice(`已复制 Subject ID：${member.subject}（Showcase 模拟）。`)}
      />
      <IconButton
        label={`编辑 ${member.displayName} 成员与权限`}
        icon={<KeyRound />}
        variant="ghost"
        onClick={() => openEditor(member)}
      />
      {!member.current && member.status === "active" ? (
        <IconButton
          label={`暂停 ${member.displayName}`}
          icon={<Ban />}
          variant="ghost"
          color="error"
          onClick={() => setConfirmTarget({ memberId: member.id, action: "suspend" })}
        />
      ) : null}
      {!member.current && member.status === "suspended" ? (
        <IconButton
          label={`恢复 ${member.displayName}`}
          icon={<RotateCcw />}
          variant="ghost"
          onClick={() => setConfirmTarget({ memberId: member.id, action: "restore" })}
        />
      ) : null}
      {!member.current && member.status === "active" && member.role !== "owner" ? (
        <IconButton
          label={`移交所有权给 ${member.displayName}`}
          icon={<Crown />}
          variant="ghost"
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
        {security === "expire-on-action" ? (
          <Alert
            type="warning"
            showIcon
            title="近期 MFA 将在下一次高权限写操作时过期"
            description="用于复现真实产品在保存成员、暂停/恢复或移交所有权过程中收到 recent_mfa_required 后的 Step-Up 重试链路。"
          />
        ) : (
          <Alert
            type="success"
            showIcon
            title="高权限操作已解锁"
            description="当前 Showcase 模拟近期 MFA 已完成；真实产品会在约 10 分钟后重新要求验证。"
            action={<Button size="small" onClick={() => setSecurity("locked")}>重新锁定</Button>}
          />
        )}

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
        note="真实 Blog Admin 成员与权限页面；Fixture 模拟成员目录、Sudo/MFA 入口状态与写操作过程中 recent_mfa_required 的 Step-Up 重试，不连接真实 GOSSO 或 Blog API。"
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
              onChange={(value) => {
                setSecurity(value);
                setNotice(null);
                setPendingAction(null);
                setStepUpOpen(false);
              }}
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
          <FormField label="Blog 角色" hint={editing?.role === "owner" ? "当前所有者角色只能通过所有权移交流程变更。" : "每次只保留一个主角色；下方说明与真实产品的角色权限文案一致。"}>
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
          {editing?.role === "owner" ? (
            <Text size="xs" tone="muted">拥有 Blog 最高管理权限；所有权仅可通过“移交所有权”操作转让。</Text>
          ) : (
            <Text size="xs" tone="muted">{roleDescriptions[draftRole as Exclude<MemberRole, "owner">]}</Text>
          )}
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

      <Modal
        open={stepUpOpen}
        title="需要近期 MFA 验证"
        description="身份服务返回 recent_mfa_required；原高权限动作已经保留，验证成功后会自动重试。"
        onOpenChange={(open) => {
          setStepUpOpen(open);
          if (!open) setPendingAction(null);
        }}
        onOk={completeStepUp}
        okText="完成 MFA 并继续"
      >
        <Alert
          type="info"
          showIcon
          title="Step-Up MFA"
          description="Showcase 不调用真实身份服务；此确认只用于验证真实产品的动作恢复链路。"
        />
      </Modal>
    </div>
  );
}
