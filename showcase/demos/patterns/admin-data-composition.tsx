import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Search, ShieldCheck } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Field,
  FormActions,
  FormGrid,
  Heading,
  Input,
  Pagination,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
  Textarea,
} from "../../../src/core";
import {
  CollectionComposition,
  CompositionContractLead,
  DataSummaryComposition,
  MasterDetailComposition,
  RecordDetailComposition,
  SettingsComposition,
  SettingsSection,
} from "../../components/patterns/admin-data-composition";

function PatternIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Heading level={1}>{title}</Heading>
        <Tag color="success">Canonical</Tag>
        <Tag>Showcase-only</Tag>
      </div>
      <Text tone="muted" className="max-w-4xl leading-relaxed">
        {description}
      </Text>
    </header>
  );
}

const collectionRows = [
  { id: "A-104", name: "内容维护", status: "active", owner: "运营组", updatedAt: "09-18 10:32" },
  { id: "A-103", name: "安全巡检", status: "attention", owner: "平台组", updatedAt: "09-18 09:20" },
  { id: "A-102", name: "SEO Review", status: "paused", owner: "内容组", updatedAt: "09-17 18:04" },
];

export function PatternCollectionCompositionDemo() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visible = useMemo(
    () => collectionRows.filter((row) => {
      const matchesQuery = !query || row.name.toLowerCase().includes(query.toLowerCase()) || row.id.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || row.status === status;
      return matchesQuery && matchesStatus;
    }),
    [query, status],
  );

  return (
    <div className="flex flex-col gap-6">
      <PatternIntro
        title="Collection 数据集合"
        description="Collection Contract 统一搜索、筛选、摘要、数据视图、分页和选择上下文之间的语义顺序。Table/List/Grid 可以替换，但外层 ownership 不漂移。"
      />

      <CompositionContractLead
        title="自动化资产"
        description="管理持续运行的版本化资产，并快速定位需要关注的对象。"
        actions={<Button variant="solid" color="primary" icon={<Plus />}>创建资产</Button>}
      />

      <CollectionComposition
        summary={(
          <DataSummaryComposition
            items={[
              { label: "全部资产", value: "24", detail: "跨 4 个业务域" },
              { label: "运行中", value: "18", detail: "75% 已启用" },
              { label: "待关注", value: "3", detail: "失败或等待人工" },
              { label: "今日变更", value: "7", detail: "最近 24 小时" },
            ]}
          />
        )}
        toolbar={(
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/[0.08] p-4 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <Input
                aria-label="搜索资产"
                prefix={<Search className="size-4" />}
                placeholder="搜索名称或 ID"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="lg:w-44">
              <Select aria-label="筛选资产状态" value={status} onChange={(value) => setStatus(String(value))}>
                <option value="all">全部状态</option>
                <option value="active">运行中</option>
                <option value="attention">待关注</option>
                <option value="paused">已暂停</option>
              </Select>
            </div>
            <Text size="xs" tone="muted" className="shrink-0">
              {visible.length} / {collectionRows.length}
            </Text>
          </div>
        )}
        data={visible.length ? (
          <div className="overflow-hidden rounded-xl border">
            <Table density="compact">
              <TableHeader>
                <TableRow>
                  <TableHead>资产</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="min-w-56 whitespace-normal">
                      <strong>{row.name}</strong>
                      <Text size="xs" tone="muted" className="mt-1 font-mono">{row.id}</Text>
                    </TableCell>
                    <TableCell>
                      <Tag color={row.status === "active" ? "success" : row.status === "attention" ? "warning" : undefined}>
                        {row.status === "active" ? "运行中" : row.status === "attention" ? "待关注" : "已暂停"}
                      </Tag>
                    </TableCell>
                    <TableCell>{row.owner}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.updatedAt}</TableCell>
                    <TableCell className="text-right"><Button size="small">查看</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card padding="lg">
            <Empty title="没有符合条件的资产" description="调整搜索或筛选条件后重试。" />
          </Card>
        )}
        pagination={(
          <Pagination
            page={1}
            pageSize={20}
            total={24}
            onChange={() => undefined}
            showTotal={(total) => String(total) + " 个资产"}
          />
        )}
      />
    </div>
  );
}

export function PatternRecordDetailCompositionDemo() {
  return (
    <div className="flex flex-col gap-6">
      <PatternIntro
        title="Record Detail 记录详情"
        description="Record Detail Contract 用于一个记录成为主要阅读与操作上下文的场景。身份、反馈、摘要、事实与相关数据按稳定顺序组织，但不会自动升级成编辑器。"
      />

      <RecordDetailComposition
        identity={(
          <CompositionContractLead
            title="Run #248 · 内容维护"
            description="查看一次执行的完整证据、资源范围和人工交互，不改变记录本身。"
            actions={(
              <>
                <Button icon={<ArrowLeft />}>返回运行列表</Button>
                <Button variant="solid" color="primary">重新运行</Button>
              </>
            )}
          />
        )}
        feedback={<Alert type="warning" showIcon title="存在 1 个待确认结果" description="该状态作用于整条 Run，因此位于详情 Section 之前。" />}
        summary={(
          <DataSummaryComposition
            items={[
              { label: "状态", value: "等待人工", detail: "Run-wide state" },
              { label: "耗时", value: "18.4s", detail: "端到端执行" },
              { label: "Token", value: "12.8k", detail: "输入 + 输出" },
              { label: "资源", value: "36", detail: "固定运行范围" },
            ]}
          />
        )}
      >
        <div className="grid gap-5 xl:grid-cols-2">
          <Card padding="base">
            <Heading level={3}>执行事实</Heading>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[9rem_1fr]">
              <dt className="text-muted-foreground">Workflow Version</dt><dd>v8</dd>
              <dt className="text-muted-foreground">触发方式</dt><dd>Scheduled</dd>
              <dt className="text-muted-foreground">Actor</dt><dd>system</dd>
              <dt className="text-muted-foreground">Started</dt><dd className="font-mono text-xs">2026-09-18 08:30:00</dd>
            </dl>
          </Card>
          <Card padding="base">
            <Heading level={3}>资源证据</Heading>
            <Text size="sm" tone="muted" className="mt-2">本次运行固定处理 36 个资源，没有在执行中扩张范围。</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag>post:104</Tag><Tag>post:103</Tag><Tag>post:102</Tag><Tag>+33</Tag>
            </div>
          </Card>
        </div>
        <Card padding="base">
          <Heading level={3}>步骤记录</Heading>
          <Text size="sm" tone="muted" className="mt-2">相关证据属于记录本身，不应漂到 PageHeader 或独立 KPI 页面。</Text>
        </Card>
      </RecordDetailComposition>
    </div>
  );
}

const queue = [
  { id: "D-31", title: "确认文章分类", meta: "内容维护 · 2 分钟前" },
  { id: "D-30", title: "批准外部写入", meta: "Connector · 8 分钟前" },
  { id: "D-29", title: "选择封面候选", meta: "媒体生成 · 11 分钟前" },
];

export function PatternMasterDetailCompositionDemo() {
  const [selected, setSelected] = useState(queue[0]);

  return (
    <div className="flex flex-col gap-6">
      <PatternIntro
        title="Master-Detail 主从详情"
        description="Master-Detail Contract 只用于连续处理或连续检查同级对象。Master 保留 peer context，Detail 只拥有当前选择；深度管理任务应退出该模式。"
      />

      <CompositionContractLead
        title="待我处理"
        description="连续处理等待人工判断的队列；当前列表上下文在查看详情时仍然重要。"
      />

      <MasterDetailComposition
        master={(
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b p-4">
              <Input aria-label="搜索待处理事项" prefix={<Search className="size-4" />} placeholder="搜索队列" />
            </div>
            <div className="flex flex-1 flex-col">
              {queue.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  block
                  className="h-auto justify-start rounded-none border-b px-4 py-4 text-left"
                  aria-pressed={selected.id === item.id}
                  onClick={() => setSelected(item)}
                >
                  <span className="min-w-0">
                    <strong className="block text-sm">{item.title}</strong>
                    <span className="mt-1 block text-xs text-muted-foreground">{item.meta}</span>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
        detail={(
          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2 border-b pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <Heading level={2}>{selected.title}</Heading>
                <Tag color="warning">等待人工</Tag>
              </div>
              <Text size="sm" tone="muted">{selected.id} · 当前 Detail 只描述所选对象。</Text>
            </div>
            <Alert type="info" showIcon title="需要人工决策" description="这个反馈属于当前 Detail，而不是整个队列。" />
            <Card padding="base">
              <Heading level={3}>决策上下文</Heading>
              <Text size="sm" tone="muted" className="mt-2">保留足够证据完成判断，但不在这里展开成复杂配置编辑器。</Text>
            </Card>
            <FormActions>
              <Button>跳过</Button>
              <Button variant="solid" color="primary">确认并继续</Button>
            </FormActions>
          </div>
        )}
      />
    </div>
  );
}

export function PatternSettingsCompositionDemo() {
  return (
    <div className="flex flex-col gap-6">
      <PatternIntro
        title="Settings 设置组合"
        description="Settings Contract 统一 Active Panel Lead、反馈、设置 Section 与保存边界。Tabs 命名设置域，Panel Lead 只补充上下文，不重复标题。"
      />

      <CompositionContractLead
        title="当前设置域：品牌与访问"
        description="这一 Lead 在真实产品中通常由 TabPanelLead 承担；这里展示它与 Feedback / Sections / Actions 的相对关系。"
      />

      <SettingsComposition
        feedback={<Alert type="info" showIcon title="设置会影响新请求" description="当前已存在的会话不会立即重建。" />}
        actions={(
          <FormActions>
            <Button>重置</Button>
            <Button variant="solid" color="primary">保存设置</Button>
          </FormActions>
        )}
      >
        <SettingsSection title="站点身份" description="一个 Section 自己拥有内部字段间距。">
          <FormGrid columns={2}>
            <Field label="站点名称"><Input defaultValue="Example Admin" /></Field>
            <Field label="公开访问"><Switch defaultChecked label="允许公开访问" /></Field>
          </FormGrid>
        </SettingsSection>

        <SettingsSection title="默认行为" description="Section 之间的 gap 由 Settings Composition 拥有。">
          <div className="flex flex-col gap-5">
            <Field label="默认角色">
              <Select defaultValue="viewer">
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </Select>
            </Field>
            <Field label="说明"><Textarea rows={4} defaultValue="这些字段只是 Canonical composition 示例。" /></Field>
          </div>
        </SettingsSection>
      </SettingsComposition>
    </div>
  );
}

export function PatternDataSummaryCompositionDemo() {
  return (
    <div className="flex flex-col gap-6">
      <PatternIntro
        title="Data Summary 数据摘要"
        description="Data Summary Contract 不是装饰 KPI。每个指标必须回答当前任务中的状态或决策问题，并在它所总结的详细数据之前出现。"
      />

      <CompositionContractLead
        title="运行态势"
        description="摘要回答“规模、健康度、风险、变化”四类问题；不把无关业务指标塞进同一组。"
        actions={<Button icon={<ShieldCheck />}>查看运行证据</Button>}
      />

      <DataSummaryComposition
        items={[
          { label: "今日运行", value: "186", detail: "比昨日 +12%" },
          { label: "成功率", value: "97.8%", detail: "目标 ≥ 97%" },
          { label: "待人工", value: "5", detail: "2 项高优先级" },
          { label: "失败", value: "4", detail: "3 项已自动重试" },
        ]}
      />

      <Card padding="base">
        <Heading level={3}>详细数据区域</Heading>
        <Text size="sm" tone="muted" className="mt-2">
          Summary 位于它所概括的数据之前。这里可以继续是 Table、Chart、Run List 或其他业务视图。
        </Text>
      </Card>
    </div>
  );
}
