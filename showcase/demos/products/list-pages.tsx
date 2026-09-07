import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import {
  ActionGroup, Button, Card, CardContent, DataTable, Feedback, Field, FilterBar,
  Input, ListPageTemplate, Modal, Panel, PanelHeader, ResponsiveList, Select,
  TableBody, TableCell, TableHead, TableHeader, TableRow, Tag, type TableDensity,
} from "../../../src";
import { gossoUsers, showcaseRecords as records } from "../../fixtures";
import { StateControls, StatePanel, type DemoState } from "../../scenarios";

export function ListDemo({ kind = "posts" }: { kind?: "posts" | "users" | "clients" | "audit" }) {
  const [state, setState] = useState<DemoState>("ready");
  const [density, setDensity] = useState<TableDensity>("default");
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const source = kind === "users"
    ? [["admin@example.com", "管理员", "活跃", "2026-09-06"], ["editor@example.com", "编辑", "活跃", "2026-09-05"], ["suspended@example.com", "审核员", "已停用", "2026-09-02"]]
    : kind === "clients"
      ? [["blog-bff", "Confidential", "https://blog.dev.local/callback", "openid profile"], ["admin-console", "Public", "https://admin.dev.local/callback", "openid admin"]]
      : kind === "audit"
        ? [["登录成功", "admin@example.com", "认证", "2026-09-06 15:24"], ["更新客户端", "admin@example.com", "客户端", "2026-09-06 14:18"], ["撤销会话", "ops@example.com", "会话", "2026-09-06 11:02"]]
        : records;
  const visible = source.filter((row) => row[0].includes(query));
  const copy = kind === "users" ? ["用户管理", "管理用户、角色、MFA 和账户状态。", "用户列表", "创建用户"] : kind === "clients" ? ["客户端管理", "管理 OAuth 客户端、回调地址和授权范围。", "已注册客户端", "注册客户端"] : kind === "audit" ? ["审计日志", "按时间查看认证与系统管理事件。", "最近事件", "导出日志"] : ["Posts 列表模板", "筛选、批量操作、状态 Badge、分页和移动端列表的统一参考。", "全部文章", "新建文章"];
  return (
    <ListPageTemplate
      title={copy[0]}
      description={copy[1]}
      action={
        <Button variant="solid" color="primary" icon={<Plus />}>
          {copy[3]}
        </Button>
      }
      stateControls={<StateControls state={state} setState={setState} />}
    >
      <Panel data-density={density} className="posts-list-surface">
        <PanelHeader
          title={copy[2]}
          description={`${visible.length} 条结果 · 最后同步于刚刚`}
          actions={
            <Select
              aria-label="列表密度"
              value={density}
              onChange={(event) =>
                setDensity(event.target.value as TableDensity)
              }
            >
              <option value="default">默认密度</option>
              <option value="compact">紧凑密度</option>
              <option value="touch">触控密度</option>
            </Select>
          }
        />
        <FilterBar className="posts-filter-bar">
          <Field label="搜索" className="w-full min-w-0 md:max-w-[34rem] md:flex-1" hideLabel>
            <Input
              prefix={<Search />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题"
            />
          </Field>
          <ActionGroup className="w-full md:w-auto">
            <Button className="flex-1 md:flex-none" variant="outline">筛选</Button>
            <Button className="flex-1 md:flex-none" variant="ghost">导出</Button>
          </ActionGroup>
        </FilterBar>
        {selected.length > 0 ? (
          <Feedback type="info">
            已选择 {selected.length} 项。
            <Button
              size="small"
              variant="solid" color="error"
              className="ml-3"
              onClick={() => setState("success")}
            >
              批量归档
            </Button>
          </Feedback>
        ) : null}
        <>
          <StatePanel state={state} onRetry={() => setState("ready")} />
          {state === "ready" || state === "success" ? (
            <>
              <ResponsiveList
                density={density}
                table={
                  <DataTable density={density}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input
                          type="checkbox"
                          aria-label="全选"
                          onChange={(e) =>
                            setSelected(
                              e.target.checked ? visible.map((r) => r[0]) : [],
                            )
                          }
                        />
                      </TableHead>
                      <TableHead>标题</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((row) => (
                      <TableRow key={row[0]}>
                        <TableCell>
                          <input
                            type="checkbox"
                            aria-label={`选择 ${row[0]}`}
                            checked={selected.includes(row[0])}
                            onChange={(e) =>
                              setSelected(
                                e.target.checked
                                  ? [...selected, row[0]]
                                  : selected.filter((x) => x !== row[0]),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{row[0]}</TableCell>
                        <TableCell>
                          <Tag
                            color={row[1] === "已发布" ? "success" : "warning"}
                          >
                            {row[1]}
                          </Tag>
                        </TableCell>
                        <TableCell>{row[3]}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button size="small">编辑</Button>
                            <Button size="small" variant="ghost">
                              更多
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </DataTable>
                }
                mobile={
                  <>
                    {visible.map((row) => (
                      <Card key={row[0]} padding="sm">
                        <CardContent>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">{row[0]}</div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {row[3]}
                              </div>
                            </div>
                            <Tag
                              color={row[1] === "已发布" ? "success" : "warning"}
                            >
                              {row[1]}
                            </Tag>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="small">编辑</Button>
                            <Button size="small" variant="ghost">
                              更多
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                }
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  显示 {visible.length} / {records.length} 条
                </span>
                <ActionGroup>
                  <Button size="small" variant="ghost" icon={<ChevronLeft />}>
                    上一页
                  </Button>
                  <Button
                    size="small"
                    variant="ghost"
                    icon={<ChevronRight />}
                    iconPlacement="end"
                  >
                    下一页
                  </Button>
                </ActionGroup>
              </div>
            </>
          ) : null}
        </>
      </Panel>
    </ListPageTemplate>
  );
}

export function GossoUsersDemo() {
  const [state, setState] = useState<DemoState>("ready");
  const [selected, setSelected] = useState<string[]>([]);
  const [dialog, setDialog] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const visible = gossoUsers.filter(u => `${u.display_name} ${u.username}`.includes(query));
  return <ListPageTemplate title="用户管理" description="管理用户、角色、MFA 和账户状态。" action={<Button variant="solid" color="primary" icon={<Plus />}>添加用户</Button>} stateControls={<StateControls state={state} setState={setState} />}>
    {state !== "ready" ? <Panel><StatePanel state={state} onRetry={() => setState("ready")} /></Panel> : <Panel><PanelHeader title="用户" description={`${visible.length} 个账户`} /><FilterBar><Field label="搜索" hideLabel className="w-full min-w-0 md:max-w-[34rem] md:flex-1"><Input prefix={<Search />} value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索用户名或邮箱" /></Field><ActionGroup className="w-full md:w-auto"><Button className="flex-1 md:flex-none" variant="outline">筛选</Button>{selected.length > 0 ? <Button className="flex-1 md:flex-none" variant="solid" color="error" onClick={() => setDialog(`批量删除 ${selected.length} 个用户`)}>批量操作</Button> : null}</ActionGroup></FilterBar><DataTable><TableHeader><TableRow><TableHead><input type="checkbox" aria-label="全选" onChange={e => setSelected(e.target.checked ? visible.map(u => u.id) : [])} /></TableHead><TableHead>用户</TableHead><TableHead>状态</TableHead><TableHead>角色</TableHead><TableHead>操作</TableHead></TableRow></TableHeader><TableBody>{visible.map(user => <TableRow key={user.id}><TableCell><input type="checkbox" aria-label={`选择 ${user.username}`} checked={selected.includes(user.id)} onChange={e => setSelected(s => e.target.checked ? [...s,user.id] : s.filter(id => id !== user.id))} /></TableCell><TableCell><div className="font-medium">{user.display_name}</div><div className="text-xs text-muted-foreground">{user.username} · {user.id} · {user.created_at}</div></TableCell><TableCell><Tag color={user.status === "active" ? "success" : "error"}>{user.status === "active" ? "活跃" : "已停用"}</Tag></TableCell><TableCell><div className="flex flex-wrap gap-1">{user.roles?.map(r => <Tag key={r.id} color="default" title={r.description}>{r.name}</Tag>)}</div></TableCell><TableCell><ActionGroup className="flex-wrap"><Button size="small" variant="outline" onClick={() => setDialog(`角色管理：${user.display_name}`)}>角色</Button><Button size="small" variant="outline" onClick={() => setDialog(`Consent：${user.display_name}`)}>Consent</Button><Button size="small" variant="outline" disabled={user.id === "acct_01"} onClick={() => setDialog(`修改密码：${user.display_name}`)}>密码</Button><Button size="small" variant="outline" disabled={user.id === "acct_01"} onClick={() => setDialog(`${user.status === "active" ? "停用" : "启用"}：${user.display_name}`)}>{user.status === "active" ? "停用" : "启用"}</Button><Button size="small" variant="outline" disabled={user.id === "acct_01"} onClick={() => setDialog(`解锁账户：${user.display_name}`)}>解锁</Button><Button size="small" variant="outline" disabled={user.id === "acct_01"} onClick={() => setDialog(`重置 MFA：${user.display_name}`)}>重置 MFA</Button><Button size="small" variant="solid" color="error" disabled={user.id === "acct_01"} onClick={() => setDialog(`删除用户：${user.display_name}`)}>删除</Button></ActionGroup></TableCell></TableRow>)}</TableBody></DataTable></Panel>}
    <Modal open={Boolean(dialog)} onClose={() => setDialog(null)} title={dialog ?? "用户操作"}><div className="space-y-4">{dialog?.startsWith("角色") ? <><p>已分配角色</p><label className="flex gap-2"><input type="checkbox" defaultChecked /> admin</label><label className="flex gap-2"><input type="checkbox" /> editor</label></> : dialog?.startsWith("Consent") ? <><p>已授权客户端</p><div className="rounded border p-3 text-sm">Blog BFF · openid profile email</div><Button size="small" variant="outline">撤销 Consent</Button></> : dialog?.startsWith("修改密码") ? <><Field label="新密码"><Input type="password" placeholder="输入新密码" /></Field><Field label="确认密码"><Input type="password" placeholder="再次输入密码" /></Field></> : <p className="text-sm text-muted-foreground">此操作需要确认。Showcase 仅模拟 Gosso Admin 的本地状态变化，不调用 API。</p>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialog(null)}>取消</Button><Button variant="solid" color="primary" onClick={() => { setDialog(null); setState("success"); }}>确认</Button></div></div></Modal>
  </ListPageTemplate>;
}
