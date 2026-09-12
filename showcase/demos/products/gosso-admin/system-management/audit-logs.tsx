import { useMemo, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import {
  Button,
  Card,
  Empty,
  FormField,
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
} from "../../../../../src/core";
import { ManagementPanelLead } from "./shared";

type AuditFixture = {
  id: string;
  time: string;
  action: string;
  actor: string;
  accountId: string;
  ip: string;
  details: string;
};

const logs: AuditFixture[] = [
  { id: "evt-1008", time: "2026-09-07 23:40:12", action: "oauth.client.update", actor: "admin", accountId: "usr-admin", ip: "203.0.113.42", details: "Updated redirect URIs for gouno-blog-bff." },
  { id: "evt-1007", time: "2026-09-07 22:16:03", action: "account.role.assign", actor: "admin", accountId: "usr-editor", ip: "203.0.113.42", details: "Assigned editor role." },
  { id: "evt-1006", time: "2026-09-07 19:05:51", action: "session.revoke", actor: "demo-user", accountId: "usr-demo", ip: "198.51.100.17", details: "Revoked mobile Safari session." },
  { id: "evt-1005", time: "2026-09-07 16:22:08", action: "mfa.reset", actor: "admin", accountId: "usr-auditor", ip: "203.0.113.42", details: "Reset TOTP enrollment after verified support request." },
  { id: "evt-1004", time: "2026-09-07 13:41:39", action: "oauth.secret.rotate", actor: "admin", accountId: "usr-admin", ip: "203.0.113.42", details: "Rotated confidential client secret." },
  { id: "evt-1003", time: "2026-09-07 09:18:25", action: "login.success", actor: "editor", accountId: "usr-editor", ip: "192.0.2.22", details: "Password + TOTP authentication succeeded." },
];
const pageSize = 4;

export function AuditLogsPanel() {
  const [eventType, setEventType] = useState("");
  const [accountId, setAccountId] = useState("");
  const [appliedEvent, setAppliedEvent] = useState("");
  const [appliedAccount, setAppliedAccount] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AuditFixture | null>(null);

  const filtered = useMemo(() => logs.filter((log) => {
    const eventMatch = !appliedEvent || log.action.toLowerCase().includes(appliedEvent.toLowerCase());
    const accountMatch = !appliedAccount || log.accountId.toLowerCase().includes(appliedAccount.toLowerCase());
    return eventMatch && accountMatch;
  }), [appliedAccount, appliedEvent]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const search = (event: FormEvent) => {
    event.preventDefault();
    setAppliedEvent(eventType.trim());
    setAppliedAccount(accountId.trim());
    setPage(1);
  };
  const clear = () => {
    setEventType("");
    setAccountId("");
    setAppliedEvent("");
    setAppliedAccount("");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <ManagementPanelLead description="按事件类型和目标账户查询身份平台安全审计事件，并查看事件上下文。" />

      <Card padding="sm">
        <form onSubmit={search} className="flex flex-col gap-3 md:flex-row md:items-end">
          <FormField label="事件类型" className="min-w-0 flex-1">
            <Input value={eventType} onChange={(event) => setEventType(event.target.value)} placeholder="例如 oauth.client" />
          </FormField>
          <FormField label="Account ID" className="min-w-0 flex-1">
            <Input value={accountId} onChange={(event) => setAccountId(event.target.value)} placeholder="例如 usr-admin" />
          </FormField>
          <div className="flex gap-2 pb-0.5">
            <Button type="submit" variant="solid" color="primary" icon={<Search />}>查询</Button>
            <Button type="button" icon={<X />} onClick={clear}>清除</Button>
          </div>
        </form>
      </Card>

      {visible.length ? (
        <>
          <Table bordered density="compact">
            <TableHeader><TableRow><TableHead>时间</TableHead><TableHead>事件</TableHead><TableHead>Actor</TableHead><TableHead>目标账户</TableHead><TableHead className="text-right">详情</TableHead></TableRow></TableHeader>
            <TableBody>
              {visible.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.time}</TableCell>
                  <TableCell><Tag color={log.action.includes("reset") || log.action.includes("rotate") ? "warning" : "default"}>{log.action}</Tag></TableCell>
                  <TableCell className="font-mono text-xs">{log.actor}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.accountId}</TableCell>
                  <TableCell className="text-right"><Button size="small" onClick={() => setSelected(log)}>查看</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} showTotal={(total) => `${total} 条审计事件`} />
        </>
      ) : (
        <Empty
          title="没有匹配的审计事件"
          description="调整事件类型或目标账户筛选条件后重试。"
          action={<Button size="small" icon={<X />} onClick={clear}>清除筛选</Button>}
        />
      )}

      <Modal open={Boolean(selected)} title="审计事件详情" onOpenChange={(next) => { if (!next) setSelected(null); }} footer={<Button onClick={() => setSelected(null)}>关闭</Button>}>
        {selected ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-[120px_1fr]">
            <dt className="text-muted-foreground">Event ID</dt><dd className="font-mono">{selected.id}</dd>
            <dt className="text-muted-foreground">时间</dt><dd>{selected.time}</dd>
            <dt className="text-muted-foreground">Action</dt><dd className="font-mono">{selected.action}</dd>
            <dt className="text-muted-foreground">Actor</dt><dd className="font-mono">{selected.actor}</dd>
            <dt className="text-muted-foreground">Target</dt><dd className="font-mono">{selected.accountId}</dd>
            <dt className="text-muted-foreground">IP</dt><dd className="font-mono">{selected.ip}</dd>
            <dt className="text-muted-foreground">Details</dt><dd>{selected.details}</dd>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}