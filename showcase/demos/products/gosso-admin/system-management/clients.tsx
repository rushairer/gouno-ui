import { useState, type FormEvent } from "react";
import { Copy, Edit2, KeyRound, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Empty,
  FormField,
  IconButton,
  Input,
  Modal,
  Segmented,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
} from "../../../../../src/core";
import { ConfirmAction, FixtureBanner, ManagementPanelLead, StatusNotice } from "./shared";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type ClientFixture = {
  id: string;
  name: string;
  description: string;
  confidential: boolean;
  redirectUris: string[];
  grants: string[];
  scopes: string[];
};

const initialClients: ClientFixture[] = [
  { id: "gosso-admin-spa", name: "GOSSO Admin Console", description: "管理控制台 OAuth 2.0 客户端", confidential: false, redirectUris: ["https://sso.io84.com/admin/callback"], grants: ["authorization_code", "refresh_token"], scopes: ["openid", "profile", "email", "admin"] },
  { id: "gouno-blog-bff", name: "Gouno Blog BFF", description: "Blog confidential BFF client", confidential: true, redirectUris: ["https://blog.io84.com/api/auth/callback"], grants: ["authorization_code", "refresh_token"], scopes: ["openid", "profile", "email"] },
  { id: "device-demo", name: "Device Flow Demo", description: "设备授权流程验证客户端", confidential: false, redirectUris: ["https://example.test/device/complete"], grants: ["device_code"], scopes: ["openid", "profile"] },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;
const grantOptions = ["authorization_code", "client_credentials", "refresh_token", "device_code"] as const;
const scopeOptions = ["openid", "profile", "email", "admin"] as const;

function LoadingClients() {
  return (
    <Card padding="base" role="status" aria-label="OAuth2 客户端加载中">
      <div className="flex flex-col gap-4">
        <Text size="sm" tone="muted">正在加载 OAuth2 客户端…</Text>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="grid gap-3 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1.4fr)]">
            <div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-28" /></div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ClientsPanel() {
  const [clients, setClients] = useState<ClientFixture[]>(initialClients);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [editing, setEditing] = useState<ClientFixture | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [redirectUris, setRedirectUris] = useState("");
  const [confidential, setConfidential] = useState(false);
  const [grants, setGrants] = useState<string[]>(["authorization_code", "refresh_token"]);
  const [scopes, setScopes] = useState<string[]>(["openid", "profile", "email"]);
  const [status, setStatus] = useState<string | null>(null);
  const [secret, setSecret] = useState<{ id: string; value: string } | null>(null);

  const openEditor = (client?: ClientFixture) => {
    setEditing(client ?? null);
    setName(client?.name ?? "");
    setDescription(client?.description ?? "");
    setRedirectUris(client?.redirectUris.join(", ") ?? "");
    setConfidential(client?.confidential ?? false);
    setGrants(client?.grants ?? ["authorization_code", "refresh_token"]);
    setScopes(client?.scopes ?? ["openid", "profile", "email"]);
    setEditorOpen(true);
  };

  const toggle = (collection: string[], value: string, setCollection: (next: string[]) => void) => {
    setCollection(collection.includes(value) ? collection.filter((item) => item !== value) : [...collection, value]);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const parsedRedirects = redirectUris.split(",").map((item) => item.trim()).filter(Boolean);
    if (!name.trim() || parsedRedirects.length === 0) return;
    if (editing) {
      setClients((items) => items.map((item) => item.id === editing.id ? { ...item, name: name.trim(), description: description.trim(), redirectUris: parsedRedirects, grants, scopes } : item));
      setStatus(`客户端“${name.trim()}”已更新（Showcase 模拟）。`);
    } else {
      const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `client-${clients.length + 1}`;
      const next: ClientFixture = { id, name: name.trim(), description: description.trim(), confidential, redirectUris: parsedRedirects, grants, scopes };
      setClients((items) => [next, ...items]);
      setStatus(`客户端“${next.name}”已注册（Showcase 模拟）。`);
      if (confidential) setSecret({ id, value: `gss_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}` });
    }
    setEditorOpen(false);
  };

  const rotateSecret = (client: ClientFixture) => {
    setSecret({ id: client.id, value: `gss_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}` });
    setStatus(`已轮换“${client.name}”的客户端密钥（Showcase 模拟）。`);
  };

  const changeScenario = (value: FixtureScenario) => {
    setScenario(value);
    setStatus(null);
    setEditorOpen(false);
    setEditing(null);
    setSecret(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <FixtureBanner
        route="/system-management/clients"
        note="OAuth2 客户端 Fixture 覆盖数据、加载、空态与读取失败；创建/编辑/删除、密钥轮换与 Sudo 写操作失败在后续业务态层单独建模。"
        controls={<Segmented<FixtureScenario> aria-label="OAuth2 客户端 Fixture 状态" options={scenarioOptions} value={scenario} onChange={changeScenario} block />}
      />
      <ManagementPanelLead description="注册与维护 OAuth 2.0 / OpenID Connect 客户端、回调地址、授权类型和访问范围。" actions={<Button variant="solid" color="primary" icon={<Plus />} onClick={() => openEditor()}>注册客户端</Button>} />
      {status ? <StatusNotice>{status}</StatusNotice> : null}

      {scenario === "error" ? (
        <Alert type="error" showIcon title="OAuth2 客户端加载失败" description="无法读取客户端目录。真实产品会保留当前页面并允许重新请求。" action={<Button size="small" onClick={() => changeScenario("data")}>重新载入</Button>} />
      ) : scenario === "loading" ? (
        <LoadingClients />
      ) : scenario === "empty" ? (
        <Card padding="base"><Empty title="还没有 OAuth2 客户端" description="注册第一个客户端以接入授权流程。" action={<Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={() => openEditor()}>注册客户端</Button>} /></Card>
      ) : (
        <Table bordered>
          <TableHeader><TableRow><TableHead>客户端</TableHead><TableHead>类型</TableHead><TableHead>Redirect URI</TableHead><TableHead>Grant Types</TableHead><TableHead>Scopes</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>{clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="min-w-56 whitespace-normal"><div className="font-semibold">{client.name}</div><code className="mt-1 block text-xs text-muted-foreground">{client.id}</code>{client.description ? <Text size="xs" tone="muted" className="mt-1">{client.description}</Text> : null}</TableCell>
              <TableCell><Tag color={client.confidential ? "warning" : "success"}>{client.confidential ? "Confidential" : "Public"}</Tag></TableCell>
              <TableCell className="min-w-72 whitespace-normal"><div className="flex flex-col gap-2">{client.redirectUris.map((uri) => <div key={uri} className="flex items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5"><code className="min-w-0 flex-1 truncate text-xs">{uri}</code><IconButton label={`复制 ${uri}`} size="small" icon={<Copy />} onClick={() => setStatus(`已复制 ${uri}（Showcase 模拟）。`)} /></div>)}</div></TableCell>
              <TableCell className="min-w-48 whitespace-normal"><div className="flex flex-wrap gap-1.5">{client.grants.map((grant) => <Tag key={grant}>{grant.replace("_", " ")}</Tag>)}</div></TableCell>
              <TableCell className="min-w-40 whitespace-normal"><div className="flex flex-wrap gap-1.5">{client.scopes.map((scope) => <Tag key={scope} color={scope === "admin" ? "warning" : "primary"}>{scope}</Tag>)}</div></TableCell>
              <TableCell><div className="flex min-w-max flex-nowrap items-center justify-end gap-1"><IconButton label={`编辑 ${client.name}`} variant="ghost" icon={<Edit2 />} onClick={() => openEditor(client)} />{client.confidential ? <IconButton label={`轮换 ${client.name} 密钥`} variant="ghost" icon={<RotateCcw />} onClick={() => rotateSecret(client)} /> : null}<ConfirmAction label="删除" icon={<Trash2 />} title={`删除“${client.name}”？`} description="删除客户端会立即阻止新的授权流程；真实产品还会要求 Sudo/强认证。" confirmText="确认删除" onConfirm={() => { setClients((items) => items.filter((item) => item.id !== client.id)); setStatus(`客户端“${client.name}”已删除（Showcase 模拟）。`); }} /></div></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      )}

      <Modal open={editorOpen} title={editing ? "编辑 OAuth2 客户端" : "注册 OAuth2 客户端"} description="配置客户端身份、回调地址、授权类型与访问范围。" onOpenChange={setEditorOpen} footer={<><Button onClick={() => setEditorOpen(false)}>取消</Button><Button form="system-client-editor" type="submit" variant="solid" color="primary">{editing ? "保存修改" : "注册客户端"}</Button></>}>
        <form id="system-client-editor" onSubmit={save} className="flex flex-col gap-5">
          <FormField label="客户端名称" required><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：Gouno Blog BFF" /></FormField>
          <FormField label="描述"><Input value={description} onChange={(event) => setDescription(event.target.value)} /></FormField>
          <FormField label="Redirect URI" hint="多个地址使用逗号分隔" required><Input value={redirectUris} onChange={(event) => setRedirectUris(event.target.value)} placeholder="https://example.com/auth/callback" /></FormField>
          <Checkbox label="Confidential client" checked={confidential} disabled={Boolean(editing)} onChange={(event) => setConfidential(event.target.checked)} />
          <CheckboxGroup label="Grant Types">{grantOptions.map((grant) => <Checkbox key={grant} label={grant.replace("_", " ")} checked={grants.includes(grant)} onChange={() => toggle(grants, grant, setGrants)} />)}</CheckboxGroup>
          <CheckboxGroup label="Scopes">{scopeOptions.map((scope) => <Checkbox key={scope} label={scope} checked={scopes.includes(scope)} onChange={() => toggle(scopes, scope, setScopes)} />)}</CheckboxGroup>
          {scopes.includes("admin") ? <Alert type="warning" showIcon title="高权限 Scope" description="Admin scope 可访问高权限管理 API，应仅分配给受信任客户端。" /> : null}
        </form>
      </Modal>

      <Modal open={Boolean(secret)} title="客户端密钥" description="密钥只在创建或轮换时展示一次。" onOpenChange={(next) => { if (!next) setSecret(null); }} footer={<Button variant="solid" color="primary" onClick={() => setSecret(null)}>完成</Button>}>
        {secret ? <div className="flex flex-col gap-4"><Alert type="warning" showIcon icon={<KeyRound />} title="请立即安全保存该密钥" description="关闭后无法再次查看。" /><FormField label="Client ID"><code className="block rounded-md bg-muted p-3 text-xs">{secret.id}</code></FormField><FormField label="Client Secret"><div className="flex items-center gap-2 rounded-md bg-muted p-3"><code className="min-w-0 flex-1 break-all text-xs">{secret.value}</code><Button size="small" icon={<Copy />} onClick={() => setStatus("客户端密钥已复制（Showcase 模拟）。")}>复制</Button></div></FormField></div> : null}
      </Modal>
    </div>
  );
}