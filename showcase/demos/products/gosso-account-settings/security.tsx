import { useState } from "react";
import { Calendar, Key, Laptop, LogOut, MapPin, Plus, Trash2 } from "lucide-react";
import {
  Button,
  Empty,
  FormField,
  Input,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
} from "../../../../src/core";
import { ConfirmAction, Section, StatusMessage } from "./shared";

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

const initialPasskeys: readonly PasskeyFixture[] = [
  { id: "pk-macbook", name: "MacBook Pro", createdAt: "2026-08-18 21:42", detail: "Touch ID · 平台认证器" },
  { id: "pk-iphone", name: "iPhone", createdAt: "2026-08-27 08:15", detail: "Face ID · iCloud 钥匙串" },
];

const initialSessions: readonly SessionFixture[] = [
  { id: "session-current", device: "macOS · Chrome", ip: "203.0.113.42", lastActive: "刚刚", current: true },
  { id: "session-mobile", device: "iPhone · Safari", ip: "198.51.100.17", lastActive: "18 分钟前" },
  { id: "session-office", device: "Windows · Edge", ip: "192.0.2.64", lastActive: "昨天 22:08" },
];

export function PasskeysPanel() {
  const [passkeys, setPasskeys] = useState<PasskeyFixture[]>(() => [...initialPasskeys]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const openRegistration = () => {
    setDraftName("");
    setStatus(null);
    setModalOpen(true);
  };

  const addPasskey = () => {
    const name = draftName.trim();
    if (!name) return;
    setPasskeys((items) => [...items, {
      id: `fixture-passkey-${items.length + 1}`,
      name,
      createdAt: "刚刚",
      detail: "WebAuthn · Showcase 模拟设备",
    }]);
    setStatus(`已注册通行密钥“${name}”（Showcase 模拟）。`);
    setDraftName("");
    setModalOpen(false);
  };

  return (
    <Section
      description="使用设备生物识别或安全密钥完成抗钓鱼登录。"
      surface="direct"
      actions={<Button variant="solid" color="primary" icon={<Plus />} onClick={openRegistration}>添加通行密钥</Button>}
    >
      <div className="flex flex-col gap-4">
        {status ? <StatusMessage message={status} /> : null}
        {passkeys.length === 0 ? (
          <Empty
            icon={<Key aria-hidden="true" className="size-6 text-muted-foreground" />}
            title="还没有通行密钥"
            description="添加一台可信设备，使用 WebAuthn 进行安全登录。"
            action={<Button icon={<Plus />} onClick={openRegistration}>添加通行密钥</Button>}
          />
        ) : (
          <ul className="divide-y overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm" aria-label="已注册通行密钥">
            {passkeys.map((passkey) => (
              <li key={passkey.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Key aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <Text as="div" className="truncate font-semibold">{passkey.name}</Text>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{passkey.detail}</span>
                      <span className="flex items-center gap-1"><Calendar aria-hidden="true" className="size-3" />{passkey.createdAt}</span>
                    </div>
                  </div>
                </div>
                <ConfirmAction
                  triggerLabel="移除"
                  title={`移除“${passkey.name}”？`}
                  description="移除后，这台设备将不能再使用此通行密钥登录。"
                  confirmLabel="确认移除"
                  icon={<Trash2 />}
                  onConfirm={() => {
                    setPasskeys((items) => items.filter((item) => item.id !== passkey.id));
                    setStatus(`已移除通行密钥“${passkey.name}”（Showcase 模拟）。`);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <Modal
        open={modalOpen}
        title="注册通行密钥"
        description="先为这台设备命名，真实产品随后会启动浏览器 WebAuthn 注册流程。"
        onOpenChange={(next) => { setModalOpen(next); if (!next) setDraftName(""); }}
        onOk={addPasskey}
        okText="注册设备"
        okButtonProps={{ disabled: !draftName.trim() }}
      >
        <FormField label="设备名称" required>
          <Input value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="例如：办公 MacBook Pro" autoFocus />
        </FormField>
      </Modal>
    </Section>
  );
}

export function SessionsPanel() {
  const [sessions, setSessions] = useState<SessionFixture[]>(() => [...initialSessions]);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <Section description="查看当前登录设备、IP 地址与最后活动时间，并终止异常会话。" surface="direct">
      <div className="flex flex-col gap-4">
        {status ? <StatusMessage message={status} /> : null}
        {sessions.length === 0 ? (
          <Empty title="没有活跃会话" description="身份服务当前没有返回可展示的登录会话。" />
        ) : (
          <Table bordered>
            <TableHeader>
              <TableRow>
                <TableHead>设备 / 浏览器</TableHead>
                <TableHead>IP 地址</TableHead>
                <TableHead>最后活动</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex min-w-52 items-center gap-2">
                      <Laptop aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{session.device}</span>
                      {session.current ? <Tag color="success">当前会话</Tag> : null}
                    </div>
                  </TableCell>
                  <TableCell><span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground"><MapPin aria-hidden="true" className="size-3" />{session.ip}</span></TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {session.current ? (
                      <Button size="small" icon={<LogOut />} onClick={() => setStatus("Showcase 不执行真实登出；生产环境会结束当前会话并离开此页面。")}>退出登录</Button>
                    ) : (
                      <ConfirmAction
                        triggerLabel="终止会话"
                        title={`终止 ${session.device} 会话？`}
                        description="终止后，该设备需要重新进行身份验证。"
                        confirmLabel="确认终止"
                        onConfirm={() => {
                          setSessions((items) => items.filter((item) => item.id !== session.id));
                          setStatus(`${session.device} 会话已终止（Showcase 模拟）。`);
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Section>
  );
}
