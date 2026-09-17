# Blog Admin AI Operations Canonical Redesign

> 状态：Implementation Spec
>
> 适用范围：`showcase/demos/products/blog-admin/ai/operations/*` 与 `showcase/demos/products/blog-admin/ai/settings/*`
>
> 目标：先在 Gouno UI Showcase 建立可复用、可验证、可反迁移的 AI 运营产品模型与 Canonical Composition，再由 Blog Admin 绑定真实 API、权限、版本、运行、审批、Token、媒体与错误状态。

---

## 1. 设计目标

AI 运营不是后台记录查看器，也不是组件陈列页。它是一个围绕以下闭环工作的运营工作台：

```text
观察信号
  ↓
发现需要处理的事情
  ↓
人工判断 / AI 自动执行
  ↓
运行追踪与证据留存
  ↓
形成后续动作或治理调整
```

Showcase 必须同时满足：

1. **业务真实性**：Fixture 代表真实内容运营任务，不为展示组件而编造无意义数据。
2. **对象一致性**：同一个 Workflow / Run / Approval / Interaction 在不同页面使用同一信息语法。
3. **布局一致性**：列表 item、主从布局、详情摘要、状态、动作、空白距离有稳定设计语义。
4. **操作清晰**：用户一眼能分辨“看什么、决定什么、执行什么、追踪什么”。
5. **可反迁移**：Showcase 只拥有结构、设计语言和通用交互；真实业务状态继续属于 Blog Admin。
6. **可自动验收**：关键状态必须进入 contract test、Playwright、visual evidence 与 consumer parity。

---

## 2. 信息架构

保持当前一级 IA，不新增第二层持久 Tabs：

```text
AI 运营
├─ 概览 Overview
├─ 待我处理 Inbox
├─ 自动化 Automation
└─ 运行中心 Run Center

AI 设置
├─ Agents
├─ Skills
├─ Tools
├─ 知识库
├─ 模型连接
└─ Sandbox 连接器
```

页面职责严格分离：

| 页面 | 用户问题 | 页面只负责 |
| --- | --- | --- |
| 概览 | 现在 AI 运营健康吗？ | 健康度、待处理量、异常与最近重要信号 |
| 待我处理 | 现在有什么需要我决定？ | Approval、Choice、Confirm、补充输入、失败恢复 |
| 自动化 | 哪些 Workflow 在持续工作？ | Workflow 资产、调度、版本、范围、执行入口 |
| 运行中心 | 某次运行到底发生了什么？ | Run 证据链、Steps、Resources、Interactions、Events、Tool Calls |
| AI 设置 | AI 能力与边界如何治理？ | Agent / Skill / Tool / Provider / Connector 与治理约束 |

---

## 3. Canonical 业务对象

### 3.1 Workflow

Workflow 是“持续执行的自动化资产”，不是 Run 的容器卡片。

必须显示的核心属性：

- 名称
- 一句话目标
- enabled / paused
- 当前版本
- Trigger / Schedule
- 下一次运行
- Scope / Discovery tools
- 最近运行摘要
- 累计 runs / failures / tokens
- Step definition preview

当前 Fixture 作为首批真实业务样本：

- `#42 旧文维护`
- `#43 AI 每日资讯`
- `#44 运营周报`

后续新增第 4 类 Workflow：

- `封面候选生成`
  - 输入文章/单页
  - 生成视觉方向候选
  - 人工选择
  - 生成媒体候选

新增第 5 类 Workflow：

- `SEO / 分类修正`
  - 低风险规则类
  - 可展示“建议 → 审批 → 应用”的轻量路径

### 3.2 Run

Run 是“不可变的执行证据单元”。

必须统一：

- Run ID
- Parent Workflow / Agent
- 主状态
- Dry-run / formal mode
- startedAt / finishedAt / duration
- tokenUsage
- steps
- resources
- human interactions
- events
- outputs / media candidates
- failure evidence

当前 Fixture 保留并强化：

- `Run #245`：等待用户选择封面方向
- `Run #244`：旧文维护 Dry-run 成功
- `Run #241`：等待审批
- Agent Run：成功 / provider 或 tool 失败

### 3.3 Human Decision Task

统一将以下对象视为“待我处理”的 Decision Task：

- Approval
- Choice
- Preview confirm
- Missing input
- Failure recovery

Decision Task 必须回答：

1. 我现在需要做什么？
2. 为什么需要我？
3. 来自哪个 Run / Workflow / 内容对象？
4. AI 建议了什么？
5. 批准 / 选择后会发生什么？
6. 什么不会发生？
7. 是否存在失败证据或风险提示？

当前 Fixture：

- `Approval #901`：AI 每日资讯候选稿
- `Approval #902`：文章 #103 标题候选，上一轮执行失败
- `Interaction #903`：Run #245 封面方向选择

### 3.4 Governance Object

AI 设置不是配置字段仓库，而是治理控制台。

Agent / Skill / Provider / Connector 统一采用：

- Identity
- Capability binding
- Runtime policy
- Limits / budget
- Security / credential state
- Enabled / disabled

---

## 4. Canonical List Item Anatomy

AI 运营所有主列表必须使用同一“对象行语法”，禁止每个页面自己拼一套。

### 4.1 四层信息结构

```text
┌────────────────────────────────────────────┐
│ Title                         Primary Status│
│ Meta · Parent · Time · Version / Run ID    │
│ One-line Summary / Waiting / Failure reason│
│ Optional metrics / secondary tags          │
└────────────────────────────────────────────┘
```

### 4.2 规则

- Title 只能是一条对象名称，不塞状态文字。
- Primary Status 始终只有一个。
- Meta 行使用统一 muted 小号文本。
- Summary 最多两行，失败时优先失败原因，等待时优先等待原因。
- Secondary tag 最多 2 个，例如 `Dry-run`、`v4`。
- Token / duration / steps 等 metrics 只有在任务判断需要时出现。
- selected 状态使用固定 surface/tone，不允许只靠 hover 或微弱边框。
- 同类型列表 item 统一最小高度与 padding。
- 右侧状态列不允许因为内容长短导致随机漂移。

### 4.3 密度

Desktop：

- Row padding：16px 18px
- Title → Meta：4px
- Meta → Summary：8px
- Summary → Metrics：8px
- Status / tag gap：6px

Narrow / Mobile：

- Row padding：14px 16px
- 状态移到 Title 下方或右上角固定区
- 不允许为了保留 desktop 结构产生横向溢出

---

## 5. Overview Canonical Layout

Overview 不使用“统计卡片墙”。

### 第一屏

```text
Page lead
  ├─ 今日运营状态一句话
  └─ 进入待我处理 / 自动化

Health strip
  ├─ 今日运行
  ├─ 失败
  ├─ 等待人工
  └─ Token / Budget

Attention feed                         Automation health
  ├─ 失败 Run                           ├─ Enabled workflow
  ├─ 等待审批                           ├─ Paused / error
  └─ 等待输入                           └─ Next runs
```

设计原则：

- 用一条 Health Strip 代替多个同质 Statistic Card。
- “待我处理”是第一优先级，不用营销式大卡片。
- 异常信息必须可直接进入对应 Run / Decision Task。
- 空状态时展示“暂无需要人工介入”，而不是留下大片空 Card。

---

## 6. Inbox / Decision Workbench

### 6.1 Desktop

```text
┌────────────── Decision Queue ───────────────┬──────────── Decision Workbench ────────────┐
│ [Task row]                                  │ Context / Primary status                   │
│ [Task row selected]                         │ Why this needs you                         │
│ [Task row]                                  │ What AI proposes                           │
│                                             │ Impact / Won't happen                     │
│                                             │ Diff / Candidate / Choice                 │
│                                             │ Failure evidence (when needed)            │
│                                             │ [Reject] [Approve / Continue]             │
└─────────────────────────────────────────────┴────────────────────────────────────────────┘
```

### 6.2 List row

必须显示：

- Task title
- 类型：审批 / 选择 / 确认 / 补充输入 / 恢复失败
- Parent：Workflow / Run
- Target：Post / Page / Media
- 状态
- waiting age 或 created time
- 一句话 reason

### 6.3 Workbench

右侧禁止直接从 `Tag + H2 + 两张 Card` 开始。

固定顺序：

1. Context line：来源 Workflow / Run / Target
2. Primary title + status
3. Reason：为什么来到人工队列
4. Failure evidence（若存在）
5. Proposal / Candidate / Choice
6. Impact summary
7. Safety boundary / Won't happen
8. Actions
9. 技术详情折叠区

Mobile：Queue 与 Detail 改成 drill-in，不在一个窄屏并排。

---

## 7. Automation Canonical Layout

Automation 是 Workflow 资产管理，不是 Run Center 的复制。

### 7.1 Workflow List

列表行统一：

- Name + enabled status
- Description
- Schedule + next run
- Latest run status + time
- runs / failures / tokens
- current version

### 7.2 Workflow Detail

```text
Workflow identity + status                    Primary actions
Description                                   Run / Dry-run

Operational strip
Schedule | Next run | Recent result | Token / failures

Definition
Steps timeline / ordered definition

Run boundary
Scope | discovery tools | empty result policy

Input contract
Fields + defaults

Recent runs / Versions
secondary evidence, not primary card wall
```

动作层级：

- Primary：`运行` / `重试`
- Secondary：`Dry-run`、`运行记录`、`编辑`
- Overflow：`版本`、`启用/停用`
- Destructive：`删除`

不再把所有动作平铺成同级按钮。

---

## 8. Run Center Canonical Layout

### 8.1 List + Detail

左侧 Run List 与右侧 Run Evidence Detail 使用固定比例：

- Desktop >= 1280：`280–320px + flexible detail`
- Tablet：stacked master/detail
- Mobile：先列表，再 drill-in 详情

### 8.2 Run row

Title：`Run #245`

Meta：`AI 每日资讯 · 2026-09-08 08:30`

Summary：

- waiting：`等待选择封面方向`
- failed：直接显示错误摘要
- succeeded：显示最终结果摘要

Status：一个主状态

Secondary tag：`Dry-run`

### 8.3 Run Detail

固定为：

```text
Run Header
├─ Run ID + parent
├─ primary status
├─ dry-run / formal
└─ short outcome / waiting reason

Summary Strip
Started | Duration | Token | Steps

Failure / Attention Evidence (conditional)

Execution Timeline

Evidence Area
├─ Resources
├─ Human Interactions
├─ Outputs / Media Candidates
└─ Tool Calls (Agent Run)

Event Log (secondary)
```

### 8.4 Execution Step Row

Step 统一：

- step index
- step name
- status
- duration
- short result
- error / waiting reason

禁止用大面积空白卡片包 2 条 step。

---

## 9. AI Settings Canonical Layout

AI Settings 保留独立 route 与单一 Tabs 层。

列表与编辑器统一设计语义：

### Editor sections

Agent：

1. 基础信息
2. 能力绑定
3. 触发方式
4. 运行治理

Skill：

1. 能力定义
2. Tool 授权
3. 输入契约
4. 执行与发布边界
5. 默认治理限制

Provider / Connector：

1. 连接身份
2. 模型 / 端点
3. 凭据与状态
4. 配额 / 运行约束

### Form rhythm

- field label → helper → control 为一个 Field Unit
- 两个相关 numeric limit 可两列
- 不相关字段禁止为了填满网格强行并排
- section 之间 24px
- field group 内 16px
- Save / Cancel 固定在编辑器末尾或 Drawer footer，不漂在随机位置

---

## 10. Spacing / Surface / Typography Tokens

AI Operations Showcase 在现有 Gouno UI token 上采用固定语义：

### Page rhythm

- Page lead → first content：20–24px
- Major region gap：24px
- Master/detail gap：20px
- Section gap：20px
- List row padding：16px 18px
- Inner label/value gap：4–8px

### Surface ladder

- Canvas：页面背景
- Open region：默认首选，不加 Card
- Rail/List：需要边界时一层 surface
- Evidence panel：只在结构需要时加 Card
- Nested grouping：divider / subtle tone，禁止继续套 Card
- Overlay / Modal / Drawer：只用于临时任务

### Typography

- Page title：现有 `Heading level=2`
- Detail object title：`Heading level=3`
- Row title：14px semibold
- Body：14px
- Meta / helper：12px muted
- Numeric / run id 可用 mono 但不把整行变成技术日志风格

---

## 11. Status Semantics

### Primary status

统一 vocabulary：

- `运行中`
- `成功`
- `失败`
- `等待审批`
- `等待用户`
- `已排队`
- `已暂停`

### Secondary mode tags

- `Dry-run`
- `v4`
- object type：`Post` / `Page` / `Media`（仅在上下文确实需要时）

规则：

- 每个对象最多一个 Primary Status。
- Secondary tag 最多两个。
- 不用 Badge 代替正文说明。
- failed / waiting 必须有文字 reason，不能只靠颜色。

---

## 12. Fixture 重构计划

### Workflow Fixtures

保留：

- 旧文维护
- AI 每日资讯
- 运营周报

新增：

- 封面候选生成
- SEO / 分类修正

### Run Fixtures

必须覆盖：

- succeeded formal
- succeeded dry-run
- failed provider timeout
- failed tool call
- awaiting approval
- waiting for user choice
- queued / running
- partially completed but not published

### Inbox Fixtures

必须覆盖：

- approval：应用候选稿
- approval failed：重试执行
- choice：选择封面方向
- confirm：预览确认
- input：补充主题 / 范围
- recovery：provider / tool failure 后人工恢复

### Overview Fixtures

由上述真实对象派生，禁止独立造假数字：

- 今日运行数量从 Run fixture 聚合
- failure count 从 Run status 聚合
- waiting count 从 Decision Task 聚合
- Token 从 Run 聚合
- Workflow health 从 Workflow + latest Run 聚合

---

## 13. Responsive Rules

### >= 1280

- Master/detail 双栏
- List rail 固定窄宽
- Detail 使用剩余空间

### 768–1279

- 先 filters / lead
- list 与 detail 上下布局
- Evidence 两列可退为单列

### < 768

- Queue/List first
- 点击进入 detail
- 不保留强行双栏
- Actions 可 wrap，但主操作保持第一顺序
- 绝不出现 document horizontal overflow

---

## 14. Interaction Rules

- Filter 改变后，detail 必须来自过滤后仍可见的 selection。
- selected row 必须有可辨识的视觉状态与 `aria-pressed` / selection semantics。
- Run / Dry-run / Retry 必须反馈本次动作对应的新 Run 或结果。
- Inbox 决策后，应自动选择下一条 actionable task。
- destructive action 必须有确认。
- technical JSON / raw event 只能存在于 secondary disclosure，不作为主要 UI。

---

## 15. Showcase 实施顺序

### Phase A — Product model and fixtures

1. 建立统一 Decision Task view model。
2. 补齐 Workflow / Run / Inbox fixture coverage。
3. Overview 改为由真实 fixture 聚合，不维护独立展示数字。

### Phase B — Canonical patterns

4. 抽出 AI Ops 内部私有的 `ObjectListRow` / `StatusReason` / `SummaryStrip` / `ExecutionStepRow` composition。
5. 不急于提升到 `src/core` 或 `src/patterns`；先证明跨页面稳定。

### Phase C — Surface redesign

6. Run Center
7. Inbox / Decision Workbench
8. Automation list/detail
9. Overview
10. AI Settings polish

### Phase D — Verification

11. contract tests
12. desktop + mobile Playwright evidence
13. failed / waiting / empty / loading state evidence
14. canonical visual golden
15. Blog / Gosso consumer parity

### Phase E — Reverse migration

Showcase 视觉与交互验收后，再进入 `rushairer/gouno-blog/blog-frontend`：

```text
Canonical composition
  +
real API / permission / version / autosave / Step-Up / run / approval / token / media
```

不得把 Showcase fixture state 搬进真实产品，也不得在 Blog Admin 重新拼一套视觉结构。

---

## 16. Acceptance Gates

完成 Showcase 前必须全部满足：

- 同类型 list item anatomy 一致。
- Overview 数字均可追溯到 fixture aggregation。
- Inbox 中所有人工任务有统一 workbench。
- Workflow 与 Run 在视觉上是两种不同对象，不混用 layout。
- Run failed / waiting / approval / user input 都有明确 reason。
- 页面只有一个持久 Tabs 层。
- 无 tab label → H2 echo。
- 无无意义嵌套 Card。
- Desktop / narrow / mobile 无横向溢出。
- 关键动作可完成并更新本地 Fixture 状态。
- Playwright visual evidence 覆盖 Overview / Inbox / Automation / Run Center / Settings。
- Canonical visual golden 通过。
- Blog Consumer Parity 与 Gosso Consumer Parity 通过。

---

## 17. 设计基线一句话

> AI 运营应该让用户在任何页面都能回答四个问题：**现在发生了什么、为什么需要我、我可以做什么、做完后如何追踪证据。**
