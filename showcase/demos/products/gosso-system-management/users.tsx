import { useMemo, useState, type FormEvent } from "react";
import { KeyRound, Lock, Plus, Trash2, Unlock, UserRoundCog } from "lucide-react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormField,
  IconButton,
  Input,
  Modal,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
} from "../../../../src/core";
import { ConfirmAction, ManagementSectionHeader, StatusNotice } from "./shared";

type UserStatus = "active" | "suspended";
type UserFixture = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  status: UserStatus;
  roles: string[];
  current?: boolean;
};

const initialUsers: UserFixture[] = [
  { id: "usr-admin", username: "admin", displayName: "Administrator", email: "admin@example.com", status: "active", roles: ["admin"], current: true },
  { id: "usr-editor", username: "editor", displayName: "Content Editor", email: "editor@example.com", status: "active", roles: ["editor"] },
  { id: "usr-auditor", username: "auditor", displayName: "Security Auditor", email: "audit@example.com", status: "active", roles: ["auditor"] },
  { id: "usr-demo", username: "demo-user", displayName: "Demo User", email: "demo@example.com", status: "suspended", roles: ["user"] },
  { id: "usr-ops", username: "ops", displayName: "Operations", email: "ops@example.com", status: "active", roles: ["admin", "auditor"] },
];

const assignableRoles = ["admin", "auditor", "editor", "user"] as const;
const pageSize = 3;

export function UsersPanel() {
  const [users, setUsers] = useState<UserFixture[]>(initialUsers);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<UserFixture | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<UserFixture | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [password, setPassword] = useState("");

  const pageUsers = useMemo(
    () => users.slice((page - 1) * pageSize, page * pageSize),
    [page, users],
  );

  const createUser = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !email.trim()) return;
    const next: UserFixture = {
      id: `usr-${Date.now().toString(36)}`,
      username: username.trim(),
      displayName: displayName.trim() || username.trim(),
      email: email.trim(),
      status: "active",
      roles: ["user"],
    };
    setUsers((items) => [next, ...items]);
    setPage(1);
    setStatus(`用户“${next.displayName}”已创建（Showcase 模拟）。`);
    setUsername("");
    setDisplayName("");
    setEmail("");
    setCreateOpen(false);
  };

  const openRoles = (user: UserFixture) => {
    setRoleTarget(user);
    setDraftRoles([...user.roles]);
  };

  const saveRoles = () => {
    if (!roleTarget) return;
    setUsers((items) => items.map((item) => item.id === roleTarget.id ? { ...item, roles: draftRoles } : item));
    setStatus(`已更新“${roleTarget.displayName}”的角色（Showcase 模拟）。`);
    setRoleTarget(null);
  };

  const toggleRole = (role: string) => {
    setDraftRoles((items) => items.includes(role) ? items.filter((item) => item !== role) : [...items, role]);
  };

  const toggleStatus = (user: UserFixture) => {
    const nextStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    setUsers((items) => items.map((item) => item.id === user.id ? { ...item, status: nextStatus } : item));
    setStatus(`${user.displayName} 已${nextStatus === "active" ? "启用" : "暂停"}（Showcase 模拟）。`);
  };

  return (
    <div className="flex flex-col gap-5">
      <ManagementSectionHeader
        title="用户管理"
        description="管理身份平台账户状态、角色、安全凭据与高风险管理操作。"
        actions={
          <Button variant="solid" color="primary" icon={<Plus />} onClick={() => setCreateOpen(true)}>
            添加用户
          </Button>
        }
      />
      {status ? <StatusNotice>{status}</StatusNotice> : null}

      <Table bordered>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>角色</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="min-w-64 whitespace-normal">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{user.displayName}</span>
                  {user.current ? <Tag color="primary">当前管理员</Tag> : null}
                </div>
                <Text size="xs" tone="muted" className="mt-1 font-mono">
                  {user.username} · {user.id}
                </Text>
                <Text size="xs" tone="muted">{user.email}</Text>
              </TableCell>
              <TableCell>
                <Tag color={user.status === "active" ? "success" : "error"}>
                  {user.status === "active" ? "正常" : "已暂停"}
                </Tag>
              </TableCell>
              <TableCell className="min-w-48 whitespace-normal">
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.length ? user.roles.map((role) => <Tag key={role} color={role === "admin" ? "warning" : "default"}>{role}</Tag>) : <Text size="sm" tone="muted">未分配角色</Text>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex min-w-max flex-nowrap items-center justify-end gap-1">
                  <IconButton label={`管理 ${user.displayName} 角色`} variant="ghost" icon={<UserRoundCog />} onClick={() => openRoles(user)} />
                  <IconButton
                    label={`重置 ${user.displayName} 密码`}
                    variant="ghost"
                    icon={<KeyRound />}
                    disabled={user.current}
                    onClick={() => { setPassword(""); setPasswordTarget(user); }}
                  />
                  <ConfirmAction
                    label={user.status === "active" ? "暂停" : "启用"}
                    icon={user.status === "active" ? <Lock /> : <Unlock />}
                    title={`${user.status === "active" ? "暂停" : "启用"}“${user.displayName}”？`}
                    description={user.status === "active" ? "暂停后该账户不能继续登录。" : "启用后该账户可重新参与认证。"}
                    confirmText={user.status === "active" ? "确认暂停" : "确认启用"}
                    color={user.status === "active" ? "error" : "primary"}
                    disabled={user.current}
                    onConfirm={() => toggleStatus(user)}
                  />
                  <ConfirmAction
                    label="删除"
                    icon={<Trash2 />}
                    title={`删除“${user.displayName}”？`}
                    description="真实产品会要求 Sudo/强认证，并删除或解绑该账户的相关身份数据。"
                    confirmText="确认删除"
                    disabled={user.current}
                    onConfirm={() => {
                      setUsers((items) => items.filter((item) => item.id !== user.id));
                      setStatus(`用户“${user.displayName}”已删除（Showcase 模拟）。`);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        total={users.length}
        pageSize={pageSize}
        onChange={setPage}
        showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} 个用户`}
      />

      <Modal
        open={createOpen}
        title="添加用户"
        description="创建新的本地身份账户。真实产品仍由服务端执行用户名、密码和权限校验。"
        onOpenChange={setCreateOpen}
        footer={
          <>
            <Button onClick={() => setCreateOpen(false)}>取消</Button>
            <Button form="system-create-user" type="submit" variant="solid" color="primary">创建用户</Button>
          </>
        }
      >
        <form id="system-create-user" className="flex flex-col gap-5" onSubmit={createUser}>
          <FormField label="用户名" required><Input value={username} onChange={(event) => setUsername(event.target.value)} /></FormField>
          <FormField label="显示名称"><Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></FormField>
          <FormField label="邮箱" required><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></FormField>
        </form>
      </Modal>

      <Modal
        open={Boolean(roleTarget)}
        title={roleTarget ? `管理 ${roleTarget.displayName} 的角色` : "管理角色"}
        description="角色变更属于高权限操作；真实产品会要求 Sudo/强认证。"
        onOpenChange={(next) => { if (!next) setRoleTarget(null); }}
        onOk={saveRoles}
        okText="保存角色"
      >
        <CheckboxGroup label="可分配角色">
          {assignableRoles.map((role) => (
            <Checkbox key={role} label={role} checked={draftRoles.includes(role)} onChange={() => toggleRole(role)} />
          ))}
        </CheckboxGroup>
      </Modal>

      <Modal
        open={Boolean(passwordTarget)}
        title={passwordTarget ? `重置 ${passwordTarget.displayName} 的密码` : "重置密码"}
        description="真实产品会要求 Sudo/强认证并应用完整密码策略。"
        onOpenChange={(next) => { if (!next) setPasswordTarget(null); }}
        onOk={() => {
          if (!passwordTarget || password.length < 12) return;
          setStatus(`已重置“${passwordTarget.displayName}”的密码（Showcase 模拟）。`);
          setPasswordTarget(null);
        }}
        okText="确认重置"
        okButtonProps={{ disabled: password.length < 12 }}
      >
        <FormField label="新密码" hint="至少 12 个字符" required>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
        </FormField>
      </Modal>
    </div>
  );
}