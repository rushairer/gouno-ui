# Gouno UI 公共 API 规范

状态：生效的目标设计契约；不是当前版本功能清单。制定与资料核查日期：2026-09-07。

本规范约束公共组件、子组件、配置类型、事件、ref、样式槽和文档。适用于正式包入口与子路径公开的所有 API，包括从 primitives 转导出的组件。当前差异见 [合规清单](api-conformance.md)，开发入口见 [AGENTS.md](../AGENTS.md)。本文中的目标 API 示例可能尚未实现，不能直接当作当前版本使用指南。

## 1. 效力与设计方法

### GOV-01：规范来源与优先级【必须】

按以下顺序确定目标设计：HTML/CSS/React/可访问性标准语义 → 多个成熟库共同惯例 → 行业有分歧时参考 Ant Design 高层 API 并结合组合式结构 → 明确登记的 Gouno 选择。现有代码不约束目标命名。资料中的实现技术、版本兼容范围不自动成为本项目要求。

每个新语义必须标注属于“标准语义”“行业惯例”或“Gouno 选择”，并给出来源或理由。行业无统一答案时必须作出一个项目内选择，不能声称存在普遍标准。

- 正例：`captionSide` 对应 CSS `caption-side`；`placement` 的连字符拼写是本项目选择。
- 反例：“行业规定所有位置都叫 position”或“仓库已有 side，所以新增组件也必须用 side”。
- 检查：审查属性词条的语义、来源和适用范围，不只比较字符串。

### GOV-02：规则强度与变更【必须】

“必须/禁止”是合并条件；“应当”是默认做法，偏离时必须写出理由；“可以”是允许而非要求。规则编号永久稳定，删除规则需保留编号和替代指引。

新 API 必须符合本规范。修改旧组件不得新增漂移；旧接口的迁移需在对应任务中明确范围、兼容影响和迁移说明。规范的生效不代表代码已合规，也不自动授权破坏式迁移。

- 正例：记录旧 `position`，在专门迁移中改为 `captionSide`。
- 反例：文档规范提交顺便删除所有旧接口，或为保留旧拼写修改词表。
- 检查：对照变更范围、合规清单和迁移记录。

## 2. 公共属性语义词表

### NAME-01：同义同名、异义有边界【必须】

组件用 PascalCase，属性用 camelCase，保留 HTML/React 标准拼写（`readOnly`、`tabIndex`、`colSpan`、`aria-label`）。禁止拼写错误、缩写和新增同义别名。以下词表是目标命名约束；相同语义共享类型，组件可取明确的适用子集。默认值为“组件指定”的，必须在该组件独立 API 表中写出实际值。

| 概念 | 名称、值域或类型 | 默认与边界 | 依据 |
| --- | --- | --- | --- |
| 浮层相对锚点的期望位置 | `placement`: 四侧及各侧的 `-start/-end`，如 `bottom-start` | 各浮层指定默认；不是 CSS 定位模式 | 行业惯例 [S3][S4]；拼写为 Gouno 选择 |
| 抽屉所在边缘 | `placement`: `top/right/bottom/left` | `right`；不需要浮层对齐后缀 | Ant Design 惯例 [S5] |
| 表格说明所在侧 | `captionSide`: `top/bottom` | `top`；不缩写为 `side`，不改写为 `position` | 标准语义 [S1]、组件实践 [S2] |
| CSS 定位方式 | `style.position`: `React.CSSProperties['position']` | 由样式决定 | CSS 标准语义 |
| 组件水平/垂直轴向 | `orientation`: `horizontal/vertical` | 组件指定；不得用 `vertical` 布尔值或 `direction=horizontal` 替代 | 行业惯例 [S8] |
| CSS Flex 排列方向 | `direction`: `row/column/row-reverse/column-reverse` | Flex 默认 `row`；Stack 默认 `column` | CSS 语义、MUI 惯例 [S7] |
| 阅读方向 | `dir`: `ltr/rtl/auto` | 默认继承，不强行写死 `ltr` | HTML/React 标准语义 [S10] |
| 内容或单元格对齐 | `align`: `start/center/end/left/right` 的适用子集 | 明确是文字还是内容；逻辑方向与物理方向不得混淆 | 行业惯例；具体子集为 Gouno 选择 |
| Flex 对齐 | `align`: `start/center/end/stretch/baseline`；`justify`: `start/center/end/space-between/space-around/space-evenly` | 交叉轴默认 `stretch`，主轴默认 `start` | CSS 语义；短属性名为 Gouno 选择 |
| 常规控件尺寸 | `size`: `small/middle/large` | `middle`；子集如 `small/middle` 必须注明 | Ant Design 约定 [S9]，非全行业统一拼写 |
| 相邻元素间距 | `gap`: 非负 number（CSS px）或具名间距 token | 组件指定；token 必须来自共享间距表 | CSS 语义、Gouno 单位选择 |
| 数据密度 | `density`: `default/compact/touch` | `default`；不是尺寸别名 | Gouno 选择 |
| 视觉形态 | `variant`: 有限联合类型 | 组件指定；不得包含颜色、尺寸或业务状态 | 行业惯例 [S9][S11] |
| 轮廓 | `shape`: 有限联合类型，如 `default/round/circle` | 组件指定；`icon` 不是尺寸 | 行业惯例 [S9] |
| 颜色或语义色 | `color`: 组件声明的语义 token 子集；确需任意颜色时另声明 CSS 颜色能力 | 组件指定；不能用 `tone` 再提供同义入口 | 成熟库实践 [S9]；统一入口为 Gouno 选择 |
| 状态 | `status`: 组件状态的有限联合，如 `error/warning` | 未设置表示无额外状态；不是纯颜色 | 行业惯例 [S12] |
| 主体与说明 | `children/title/description/extra`: `ReactNode` | 未设置不渲染额外内容；禁止按真假判断丢掉数字 0 | React 组合惯例 [S11] |
| 可选值集合 | `options`: 只读选项数组，明确 label、value、disabled | 默认及空集合行为由组件定义 | Ant Design 惯例 |
| 结构条目集合 | `items`: 只读条目数组，明确 key 与结构字段 | 用于导航、步骤等，不作为所有数据的泛称 | Ant Design 惯例 [S13] |
| 记录集合 | `dataSource`: `readonly T[]` | 数据列表默认空数组 | Ant Design Table 惯例 [S13] |

- 正例：`TableCaption.captionSide` 与 `Drawer.placement` 描述不同关系，允许名称不同。
- 反例：Tooltip 用 `placement`，另一个同类浮层用 `postion`；Space 用 `size` 表示间距。
- 检查：对照概念、值域、单位、默认与适用子集；不能把行业分歧当作违规证据。

### NAME-02：定位、逻辑方向与轴向【必须】

Gouno 浮层统一采用 `top/right/bottom/left` 及各自 `-start/-end` 的十二种位置。`topLeft` 等拼写不作为第二套公开值域；也不同时暴露独立 `side + align` 控制同一个 placement。Radix 的拆分接口是合理的底层设计，但在正式公开层必须适配为选定接口。内部第三方属性与用于动画的 `data-side` 不要求重命名。

`placement` 表示偏好，不保证碰撞后仍在同一侧。文档需说明 flip、shift、边界及实际位置的观察方式；若支持自动定位，应作为另行定义的能力，不能悄悄增加 `auto` 值。`top/bottom` 浮层的 `start/end` 在常用水平书写模式下跟随阅读方向；侧边浮层的对齐按定位引擎交叉轴定义。不能宣称所有轴都仅通过 RTL 反转。需支持其他 writing-mode 时必须补充契约和测试。

`captionSide` 保留 CSS 术语及书写模式语义，不把 caption 当作浮层。`orientation` 描述组件操作轴或布局轴，必须说明是哪一条轴；Splitter 的布局轴与分隔条自身的 `aria-orientation` 可能相反。Flex/Stack 的 `direction` 映射 CSS flex-direction，不应机械改成 orientation。同一组件不得同时提供两套等价轴向控制。

- 正例：`PopoverContent placement="bottom-start"`；`Stack direction="row-reverse"`。
- 反例：以 `position="fixed"` 和 `position="bottom"` 混用定位模式与方位；认为所有 direction 都是漂移。
- 检查：默认位置、边界避让、LTR/RTL、反向排列和轴向无障碍属性。

### NAME-03：尺寸、颜色与布尔能力【必须】

常规控件 size 不得新增 `sm/md/lg/default/regular/base/compact` 同义值。图像/二维码的像素尺寸、Typography 字号与弹窗宽度属于不同概念，允许专用值域但必须注明单位，不能宣称它们等于 ControlSize。间距 token 的像素映射只能由共享 token 定义，数值 gap 不得在不同组件分别表示 px 与 token 索引。

颜色、形态和轮廓分别建模。标准语义色词采用 `default/primary/success/warning/error/info` 的适用子集；这是 Gouno 选择，不要求所有组件支持每种颜色。外观词表不接受 `danger/destructive/primary` 这类颜色或意图混入。状态必须来自显式 API，Core 不得根据业务字符串猜测颜色。

布尔状态采用 `disabled/readOnly/loading/open`；显示开关采用 `showX`，能力可采用 `Xable`，动作策略可采用 `closeOnX`。禁止 `enabled` 与 `disabled` 同时存在，也禁止组合互斥布尔值模拟可扩展枚举。合理默认可以为 true，必须记录。

- 正例：颜色与 variant 分开；`showCloseButton` 明确默认 true。
- 反例：`size="icon"`、`variant="danger"`、`horizontal` 与 `vertical` 同时传入。
- 检查：值域是否混合不同维度，默认值和单位是否一致。

## 3. 属性归属、组合和公开边界

### COMP-01：自身属性与子模块前缀【必须】

独立组件通常使用自身语境的短名称，但不得拆散标准术语。`TableCaption.captionSide` 保留完整名称；`DataTable.captionSide` 不写成 `captionCaptionSide`。父组件自身使用 `loading/density`，内部图标方位使用 `iconPlacement`，图标的 `start/end` 参照内容阅读方向而非套用浮层十二种值域。

子模块事件使用 `on` + 模块名 + 事件名，如 `onPaginationChange`。内容槽用 `caption/footer`，子组件扩展用 `captionProps/footerProps`，成组功能配置用 `pagination`。命名基于公开功能，不能随内部换用 Radix 或其他实现而变化。

- 正例：独立 `Pagination.onChange`，父组件转发接口 `onPaginationChange`。
- 反例：`DataTable.position` 暗指 caption；`DataTable.tableLoading`；`radixContentProps`。
- 检查：逐个指出属性拥有者；同一业务语义跨层转发能直接读懂。

### COMP-02：单一权威入口【必须】

一个配置只拥有一个公开写入口。主接口已经有 `captionSide` 时，`captionProps` 必须排除 captionSide；有 caption 内容槽时也排除 children。禁止用 spread 顺序隐式决定优先级。事件、ref 合并必须显式说明调用顺序和取消机制，不能覆盖组件必须执行的无障碍逻辑。

完整功能配置对象内部已有语境，不重复前缀，例如 `pagination.pageSize`；父级没有展开该配置时，其回调可放在 `pagination.onChange`。不得再同时增加同义的顶层 `onPaginationChange`。

以下为目标类型示意，不是当前已经导出的接口：

```tsx
type CaptionSide = "top" | "bottom";
interface TableCaptionProps extends React.ComponentProps<"caption"> {
  captionSide?: CaptionSide;
}
interface CaptionOptions {
  caption?: React.ReactNode;
  captionSide?: CaptionSide;
  captionProps?: Omit<TableCaptionProps, "children" | "captionSide">;
}
```

- 正例：类型排除重复的子模块字段。
- 反例：`captionSide="top"` 与 `captionProps={{ captionSide: "bottom" }}` 均合法。
- 检查：用类型负例和运行行为验证重复入口、ref 与事件组合。

### COMP-03：组合模式与第三方边界【必须】

自由结构用 children；固定具名内容用内容槽；依赖记录生成内容用具名渲染回调；替换实现组件仅在确有需求时提供具名组件插槽。禁止同一需求出现多套等价接口。渲染函数必须纯粹，不修改输入、不隐式发请求。

支持 children 模式和 dataSource 模式的组件必须分别声明合法输入和能力，冲突应通过互斥类型约束；不能静默丢弃 caption、loading 等已声明通用属性。数据模式特有能力不得假装在 children 模式也可用。

任何从正式入口可访问的组件，无论文件目录名称，都需审查继承、转导出的完整类型。内部允许第三方名称，公开层不能任由依赖升级增加或改变 API。禁止把内部路径作为用户导入示例。

- 正例：从 `@gouno/ui/core` 导入，明确组合和数据模式的能力。
- 反例：直接继承第三方所有 props 后只记录手写字段；没有 columns 时静默忽略 caption。
- 检查：从公共入口检查类型、继承图、两种模式和真实 DOM。

## 4. 状态、事件与行为

### STATE-01：受控与非受控【必须】

主要输入值使用 `value/defaultValue/onChange`，布尔选择使用 `checked/defaultChecked/onChange`，浮层使用 `open/defaultOpen/onOpenChange`。领域状态可以使用 `selectedKeys/defaultSelectedKeys` 等具名状态组，不为统一而强行叫 value。纯展示组件不必增加默认状态或回调。

受控状态以属性为准；非受控初值只读取一次。状态属性为 undefined 表示未受控；若允许 null，则 null 是一个明确的受控空值。组件生命周期内禁止无意切换模式。defaultX 不覆盖受控 X，文档需说明同时提供时 defaultX 不生效，推荐只使用一种模式。

用户操作可请求父级变更，但不得在受控值不变时擅自提交新状态。挂载、父级回填或同步内部缓存不得伪造用户 onChange。

- 正例：受控 open=false 时关闭状态不受内部状态覆盖。
- 反例：`value || innerValue`；每次渲染重新应用 defaultValue。
- 检查：非受控交互、受控父级拒绝更新、重渲染、初值与空值。

### STATE-02：回调签名与时机【必须】

原生 Input/Select/Checkbox 包装组件保留 React onChange 事件；复合值组件的主 onChange 接收类型化值，可附带有明确字段的上下文。不能把两类参数伪装为兼容，也不为所有自定义控件添加 onValueChange 别名。原生事件透传与值事件冲突时使用 Omit 排除并明确重定义。

每个回调必须说明参数、返回值、触发条件、是否可取消、一次操作的调用次数。次级状态采用 onXChange；onClose 表示关闭请求时不能等同于动画已经结束。动画完成可采用 afterOpenChange，并记录时机。既有 Ant Design 惯例中的 onChange(value) 是有效参考，不属于命名漂移。

- 正例：Input 的 `(event: React.ChangeEvent<HTMLInputElement>) => void`；InputNumber 的 `(value: number | null) => void`。
- 反例：同类 InputNumber 有时回 number、有时伪造 event.target.value；父级更新也触发 onChange。
- 检查：精确事件参数、键鼠操作、受控回填、取消和重复触发。

### STATE-03：空值与不可操作状态【必须】

逐组件定义 undefined、null、空字符串、空数组、0、false 的含义；不能采用一个全局空值清洗函数覆盖所有领域。ReactNode 内容不得因数字 0 被隐去。

disabled 表示禁止交互，原生控件保留浏览器焦点与表单提交规则；自定义控件明确 aria-disabled 及焦点策略，并实际阻止操作。readOnly 表示不可编辑但通常仍可聚焦、选择和提交，不能简单转换为 disabled。loading 表示等待，应声明 aria-busy、原内容保留、阻止重复操作及是否仍可取消；不能假定所有 loading 都等价 disabled。只声明有意义且实现完整的状态。

- 正例：只读输入仍包含在 FormData；caption=0 正常展示。
- 反例：以降低透明度实现 disabled；所有 loading 分支丢弃原内容和标签。
- 检查：焦点、键盘、提交、重复点击、空值及重试。

### STATE-04：数字、日期与异步契约【必须】

数值写明单位、整数要求、上下界和越界策略；时间间隔统一用毫秒，CSS 长度 number 用 px，比例类数值说明 0–1 或 0–100。日期明确是日期字符串、本地时间还是时间点，不能默默转换时区或混用 Date/string。

异步回调只有在组件实际等待时才声明 Promise 语义。必须说明 pending 期间重复操作、resolve 后行为、reject 后保留状态及错误展示责任。无数据服务职责的组件不得自行请求业务接口；旧异步结果不得覆盖新选择，卸载后的完成逻辑必须安全。

- 正例：`duration` 文档说明毫秒；日期为空返回 null，并注明不包含时区。
- 反例：文档写 Promise 可用但组件立即关闭；gap 在不同组件中使用不同数值单位。
- 检查：边界值、拒绝、快速重复输入、竞态、卸载与时区案例。

## 5. 类型、DOM、样式和可访问性

### TYPE-01：精确、可导入的公共类型【必须】

公开组件有具名 ComponentNameProps，公共 ref 或配置有具名类型并从对应正式入口导出。相关泛型保持数据推导，集合输入允许只读数组且不修改调用者对象。有限选项使用联合类型，禁止 any 或任意 string 掩盖枚举；确实开放的输入（如用户文本、CSS 颜色）不受此禁令误伤。

数据标识在排序、过滤、分页中稳定，索引不能代替可变数据身份。组件若允许无 key 静态列表，必须明确限制，不能声称动态排序和选择仍安全。

- 正例：`readonly T[]`、从正式入口导入 Props、稳定 rowKey。
- 反例：`options: any[]`、原地 sort、从私有源码路径导入类型。
- 检查：公共入口类型检查、泛型推导、只读输入和身份保持。

### DOM-01：原生属性、ref 与组件多态【必须】

说明宿主元素、继承类型、明确排除的属性及透传目标。原生事件/aria/data 属性进入正确元素，库配置在 spread 前消费。ref 默认指向语义主体（Table 指向 table，Input 指向 input），不是偶然新增的外包装。不同目标用具名 ref，命令式句柄须定义类型和每个方法；不暴露完整第三方实例。

as/asChild 或组件替换仅在有实际需求时提供，需维护属性类型、ref 类型、键盘和语义标签契约；不能允许任意标签后仍声称具备按钮语义。

- 正例：Table 的 ref 为 HTMLTableElement，container 样式另有槽。
- 反例：aria-label 落在无意义 wrapper；captionSide 被输出成未知 DOM 属性。
- 检查：DOM 与 ref 实际目标、原生属性负例、多态语义。

### STYLE-01：稳定语义槽【必须】

className/style 作用于文档指定的主体节点，不能在同一组件不同模式下改变目标。classNames/styles 使用相同的有限语义键集合，例如 root、container、header、body、footer、caption；声明每个键的元素及是否可能不存在。稳定槽针对公开语义，不承诺内部 DOM 层级。未提供主体别名时不得新增同义 rootClassName。

默认样式使用语义 token；外部 className 合并，style 按声明目标覆盖普通视觉默认，不承诺覆盖结构或可访问性不变量。渲染模式增加包装不应破坏公开槽。不要把所有可能槽一次性加入每个组件。

- 正例：`styles={{ caption: { textAlign: "start" } }}`（仅在声明该槽的组件中）。
- 反例：文档要求 `.wrapper > div:nth-child(2)`；组合模式 className 指 table、数据模式指 wrapper。
- 检查：模式切换、主题切换和语义槽覆盖。

### A11Y-01：适用的交互与环境能力【必须】

采用原生语义；自定义控件按对应 WAI-ARIA 模式定义键盘、角色、名称与焦点。图标按钮必须有可访问名称；表头 scope/headers 与 caption 建立表格语义；错误关联应支持 aria-describedby 等标准属性。禁止仅凭颜色传达状态。

浮层明确初始焦点、Tab 策略、Escape、关闭焦点恢复和非模态行为。表单控件明确 name、id、label、提交值与 reset；日期/数字明确 locale。支持的 RTL、减少动画、触控和 SSR 能力应有证据，不宣称未测试的兼容范围。SSR 不在模块顶层读取 window/document，生成标识避免 hydration 差异。

- 正例：原生按钮配 aria-label，关闭 Dialog 恢复触发点。
- 反例：可点击 div 无键盘支持；每次 render 随机生成关联 id。
- 检查：按组件模式验证键盘/焦点/名称、表单、RTL、SSR；不要求展示型 caption 支持 loading 等无关状态。

## 6. 文档契约

### DOC-01：一个公开标签，一张独立 API 表【必须】

每个可公开使用的 JSX 标签拥有以其名字命名的独立 API 表，可以同页分节，不可合并为“组合组件属性”或“单元格通用属性”。配置对象不是 JSX 标签，应单列配置类型表；父子关系用说明或结构图表达，不把子组件名当作父组件 prop。

每张表列属性、精确类型、必填、默认和行为；有关联时补充版本、废弃及替代。无默认值用 `—`，不能混同 false/null/空字符串；库默认与浏览器默认需区分。继承属性注明具体 React 类型与排除范围，关键原生属性在各自表中列出；无需复制整个 DOM 文档，但禁止笼统“支持全部原生属性”。事件写完整签名，ref 写目标。

- 正例：TableCaption 的 captionSide 仅出现在自身表和 DataTable 的对应代理属性表中。
- 反例：在“单元格属性”里列 captionSide；Table API 中列 `TableCell: Component`。
- 检查：枚举所有公开 JSX 导出，逐个对应标题、类型和运行能力。

### DOC-02：文档真实性与示例【必须】

已发布组件文档必须描述当前可用 API；目标规范、提案和尚未实现能力必须显著标记。每个实际 Showcase Code 面板从对应 demo 模块以 ?raw 获取，Preview 使用同一模块；示例使用正式公共导入，不能省略决定行为的状态或回调。文档说明默认、受控、必要变体、空/错误/禁用等适用状态、键盘和至少一个适用交互。纯展示组件不需要虚构交互。

本章下列模板是目标规范样例，未证明当前导出已支持；只展示该规则所需 API，不是 DataTable 全量属性清单。实际组件文档必须展开完整公共能力，不能复制样例后声称 100% 完成。

### Table 家族独立表模板（目标）

统一导入位置：`@gouno/ui/core`。下列 children/style/className 均非必填，未设置即无额外值。style 类型均为 `React.CSSProperties`。表格组合保持 caption、thead、tbody、tfoot、tr、th/td 的合法 HTML 结构。

#### Table API

宿主为 table，外层滚动容器不改变语义主体；继承 `React.ComponentProps<'table'>`，ref 为 `React.Ref<HTMLTableElement>`；新增配置必须在进入 DOM 前消费。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | caption 与表格分组 |
| density | TableDensity | 否 | `"default"` | `default/compact/touch`，共享数据密度 |
| className | string | 否 | — | table 主体 |
| style | React.CSSProperties | 否 | — | table 主体样式 |
| ref | React.Ref<HTMLTableElement> | 否 | — | 原生 table |

#### TableHeader API

继承 `React.ComponentProps<'thead'>`；内容为表头行，所有透传目标为 thead。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | TableRow |
| className | string | 否 | — | thead |
| style | React.CSSProperties | 否 | — | thead 样式 |
| ref | React.Ref<HTMLTableSectionElement> | 否 | — | 原生 thead |

#### TableBody API

继承 `React.ComponentProps<'tbody'>`；内容为数据行，透传目标为 tbody。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | TableRow |
| className | string | 否 | — | tbody |
| style | React.CSSProperties | 否 | — | tbody 样式 |
| ref | React.Ref<HTMLTableSectionElement> | 否 | — | 原生 tbody |

#### TableFooter API

继承 `React.ComponentProps<'tfoot'>`；汇总是表格语义分组，不是浮层 footer。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | 汇总 TableRow |
| className | string | 否 | — | tfoot |
| style | React.CSSProperties | 否 | — | tfoot 样式 |
| ref | React.Ref<HTMLTableSectionElement> | 否 | — | 原生 tfoot |

#### TableRow API

继承 `React.ComponentProps<'tr'>`；原生事件目标为 tr；行点击本身不构成键盘选择功能。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | TableHead 或 TableCell |
| className | string | 否 | — | tr |
| style | React.CSSProperties | 否 | — | tr 样式 |
| onClick | React.MouseEventHandler<HTMLTableRowElement> | 否 | — | 原生行点击 |
| ref | React.Ref<HTMLTableRowElement> | 否 | — | 原生 tr |

#### TableHead API

继承 `React.ComponentProps<'th'>`；关键原生属性独立列出，不与 TableCell 混表。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | 标题内容 |
| colSpan | number | 否 | 浏览器 `1` | HTML 跨列规则 |
| rowSpan | number | 否 | 浏览器 `1` | HTML 跨行规则；0 按原生行组规则处理 |
| scope | `"col" \| "row" \| "colgroup" \| "rowgroup"` | 否 | — | 标题关联范围 |
| headers | string | 否 | — | 空格分隔的标题单元格 id |
| className | string | 否 | — | th |
| style | React.CSSProperties | 否 | — | th 样式 |
| ref | React.Ref<HTMLTableCellElement> | 否 | — | 原生 th |

#### TableCell API

继承 `React.ComponentProps<'td'>`；不为 td 虚构 th 专属 scope 语义。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | 否 | — | 数据内容 |
| colSpan | number | 否 | 浏览器 `1` | HTML 跨列规则 |
| rowSpan | number | 否 | 浏览器 `1` | HTML 跨行规则 |
| headers | string | 否 | — | 空格分隔的标题单元格 id |
| className | string | 否 | — | td |
| style | React.CSSProperties | 否 | — | td 样式 |
| ref | React.Ref<HTMLTableCellElement> | 否 | — | 原生 td |

#### TableCaption API

继承 `React.ComponentProps<'caption'>`；公开具名 TableCaptionProps；captionSide 为库属性，不透传 DOM。说明与主体之间的分隔线属于视觉契约，不使用浮层定位。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| captionSide | `"top" \| "bottom"` | 否 | `"top"` | 映射 CSS caption-side |
| children | React.ReactNode | 否 | — | 可访问表格说明，0 是合法内容 |
| className | string | 否 | — | caption |
| style | React.CSSProperties | 否 | — | caption 样式 |
| ref | React.Ref<HTMLTableCaptionElement> | 否 | — | 原生 caption |

#### DataTable API（目标片段）

从 `@gouno/ui/patterns` 导入；使用具名 `DataTableProps<T>`，不声称继承所有 table 属性。caption 在所有支持它的模式中语义一致；模式互斥按 COMP-03 定义。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| caption | React.ReactNode | 否 | — | 内部 TableCaption 的内容 |
| captionSide | `"top" \| "bottom"` | 否 | `"top"` | 传给 TableCaption.captionSide |
| columns | readonly DataTableColumn<T>[] | 数据模式必填 | — | 列描述 |
| dataSource | readonly T[] | 否 | `[]` | 原始记录，不原地修改 |
| pagination | DataTablePagination \| false | 否 | `false` | 唯一分页配置入口 |

#### DataTableColumn<T>（配置类型片段）

这是 columns 的条目，不是 TableCell 的组件属性表；其类型从 patterns 正式入口导出。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| key | string | 是 | — | 稳定列标识 |
| title | React.ReactNode | 是 | — | 表头内容 |
| dataIndex | keyof T | 否 | — | 原记录字段 |
| render | (value: unknown, record: T, index: number) => React.ReactNode | 否 | — | 纯渲染；index 定义为原始记录索引 |

#### DataTablePagination（配置类型片段）

配置字段已有 pagination 语境，不写 paginationPageSize。完整文档必须独立列出所有继承和排除的 PaginationProps 字段，而非仅写“见 Pagination”。

| 属性 | 类型 | 必填 | 默认 | 行为 |
| --- | --- | --- | --- | --- |
| mode | `"client" \| "server"` | 否 | `"client"` | 客户端切片或接收服务端当前页 |
| pageSize | number | 否 | — | 受控正整数，每页条数 |
| defaultPageSize | number | 否 | `10` | 非受控初值 |
| onChange | (page: number, pageSize: number) => void | 否 | — | 分页请求，页码从 1 开始 |

### 完整组合示例（目标，当前版本不保证可运行）

```tsx
import {
  Table, TableCaption, TableHeader, TableBody,
  TableRow, TableHead, TableCell,
} from "@gouno/ui/core";
import { DataTable } from "@gouno/ui/patterns";

const records = [{ id: "ui", name: "Gouno UI", owner: "Design" }];

export function CaptionExamples() {
  return (
    <>
      <Table>
        <TableCaption captionSide="bottom">组件状态与负责人</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">组件</TableHead>
            <TableHead scope="col">负责人</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Gouno UI</TableCell>
            <TableCell>Design</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DataTable
        rowKey="id"
        columns={[
          { key: "name", title: "组件", dataIndex: "name" },
          { key: "owner", title: "负责人", dataIndex: "owner" },
        ]}
        dataSource={records}
        caption="组件状态与负责人"
        captionSide="bottom"
      />
    </>
  );
}
```

## 7. 审查、例外与迁移

### GOV-03：开发与审查顺序【必须】

1. 读取本规范和合规清单，根据公共导出确定影响面。
2. 查语义词表，确认自身/子模块归属；未覆盖的新概念先补词条及依据。
3. 明确类型、默认、空值、事件、DOM/ref、组合模式和兼容影响。
4. 同步实现、公共类型、每个组件的独立 API 表、同源示例和适用验证。
5. 检查新差异与旧差异，只有实现、文档、验证均完成才将登记项关闭。

例外登记至少包含规则号、组件/API、必要原因、替代方案、影响、负责维护的模块、退出条件与状态。例外须在对应评审明确接受，不因开发者登记就自动豁免。历史差异不是例外许可；未覆盖规则也不是自动违规，应补充设计依据。

- 正例：新组件支持一个尺寸子集并说明；迁移状态保留“待迁移”直到验证完成。
- 反例：删除失败检查来宣布合规；为了提高百分比删掉缺失能力记录。
- 检查：规则编号、证据链接、实施状态和例外评审记录。

### GOV-04：验证与兼容交付【必须】

按风险验证受控/非受控、参数类型、空值、键鼠操作、焦点、模式冲突和实际渲染。类型检查不能替代视觉验证，样式类字符串断言不能证明分隔线可见。不要为文档或无行为变化增加镜像实现的测试。阶段检查遵循 AGENTS.md：typecheck、tests、build、showcase:build；记录未验证能力，不能把这些检查描述为全库 API 合规认证。

API 重命名、删除、默认值、事件参数和 ref 目标变化均须评估兼容影响；迁移交付包含旧/新对照、调用示例、版本策略和适用的废弃周期。只在获授权的迁移范围内暂留明确废弃的兼容入口，不新增永久别名。规范本身不决定某次发布的版本号。

文档验收：链接有效、示例和表格可读、每项差异有源码依据、目标与现状分离、git diff --check 通过。本次未增加自动化门禁；约束依靠 AGENTS.md 与审查执行，不能声称 CI 已自动阻止所有漂移。

## 8. 官方参考与采用边界

以下资料于 2026-09-07 核查；外部文档升级不自动改变本规范。修改词表必须重新记录依据。本文为独立归纳，不复制外部规范的全量要求。

| 编号 | 官方资料 | 采用内容与边界 |
| --- | --- | --- |
| S1 | [CSS caption-side](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/caption-side) | 标准 caption 侧向语义；不是浮层位置 |
| S2 | [Chakra 表格样式属性](https://chakra-ui.com/docs/styling/style-props/tables)、[Mantine Table](https://mantine.dev/core/table/) | captionSide 的组件实践；不要求整个 API 复制这些库 |
| S3 | [Ant Design Tooltip](https://ant.design/components/tooltip/) | placement 命名与相对目标定位；不采用 topLeft 拼写 |
| S4 | [MUI Popper](https://mui.com/material-ui/api/popper/) | placement 与连字符方向值；不自动采用其 auto 等额外能力 |
| S5 | [Ant Design Drawer](https://ant.design/components/drawer/) | 抽屉 placement；不推导所有位置都同名 |
| S6 | [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover) | side/align 是底层合理拆分；公开层选择另一套统一接口 |
| S7 | [MUI Stack](https://mui.com/material-ui/api/stack/) | direction 表达 CSS Flex 方向，不能一律禁止 |
| S8 | [Ant Design Flex](https://ant.design/components/flex/) | orientation 是另一种轴向抽象；Gouno 对 Flex/Stack 选择完整 CSS direction |
| S9 | [Ant Design Button](https://ant.design/components/button/) | 控件尺寸及颜色/形态分离；Gouno 不要求全面兼容其按钮 API |
| S10 | [React 原生属性](https://react.dev/reference/react-dom/components/common)、[React input](https://react.dev/reference/react-dom/components/input) | 原生属性、事件与受控输入语义 |
| S11 | [MUI API 设计原则](https://mui.com/material-ui/guides/api/) | 组合、属性归属、枚举与默认设计原则；ref 目标采用本文明确的语义主体规则 |
| S12 | [Ant Design InputNumber](https://ant.design/components/input-number/) | 值型 onChange 和校验状态；不强制所有组件使用 onValueChange |
| S13 | [Ant Design Table](https://ant.design/components/table/) | 数据源、独立配置表和文档组织；Table 家族独立 JSX 表为 Gouno 的明确要求 |
| S14 | [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) | 按组件模式确定键盘、角色与焦点，不能只加 role 便声称无障碍完成 |

