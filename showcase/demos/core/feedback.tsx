import { modalApiSections, overlayStyleApi } from "./modal/api-sections";
import ModalActions from "./modal/actions";
import ModalActionsCode from "./modal/actions.tsx?raw";
import ModalRetention from "./modal/retention";
import ModalRetentionCode from "./modal/retention.tsx?raw";
import ModalUncontrolled from "./modal/uncontrolled";
import ModalUncontrolledCode from "./modal/uncontrolled.tsx?raw";
import DrawerRetention from "./drawer/retention";
import DrawerRetentionCode from "./drawer/retention.tsx?raw";
import DrawerUncontrolled from "./drawer/uncontrolled";
import DrawerUncontrolledCode from "./drawer/uncontrolled.tsx?raw";
import Example1 from "./modal/modal-0";
import Example1Source from "./modal/modal-0.tsx?raw";
import Example2 from "./modal/modal-1";
import Example2Source from "./modal/modal-1.tsx?raw";
import Example3 from "./modal/modal-2";
import Example3Source from "./modal/modal-2.tsx?raw";
import Example4 from "./drawer/drawer-0";
import Example4Source from "./drawer/drawer-0.tsx?raw";
import Example5 from "./drawer/drawer-1";
import Example5Source from "./drawer/drawer-1.tsx?raw";
import Example6 from "./drawer/drawer-2";
import Example6Source from "./drawer/drawer-2.tsx?raw";
import EmptyExample from "./empty/empty-0";
import EmptyExampleSource from "./empty/empty-0.tsx?raw";
import EmptyLiveRegionExample from "./empty/empty-1";
import EmptyLiveRegionExampleSource from "./empty/empty-1.tsx?raw";
import ResultExample from "./result/result-0";
import ResultExampleSource from "./result/result-0.tsx?raw";
import ResultPageExample from "./result/result-1";
import ResultPageExampleSource from "./result/result-1.tsx?raw";
import ResultLiveRegionExample from "./result/result-2";
import ResultLiveRegionExampleSource from "./result/result-2.tsx?raw";
import SkeletonExample from "./skeleton/skeleton-0";
import SkeletonExampleSource from "./skeleton/skeleton-0.tsx?raw";
import { useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  Input,
  MessageProvider,
  Modal,
  NotificationProvider,
  Popconfirm,
  Progress,
  Space,
  Spin,
  Spinner,
  Text,
  Tour,
  useMessage,
  useNotification,
  type DrawerPlacement,
} from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import ProgressExample from "./progress/progress-0";
import ProgressExampleSource from "./progress/progress-0.tsx?raw";

function MessageDemo() {
  const api = useMessage();
  return (
    <Space>
      <Button onClick={() => api.success("保存成功")}>Success</Button>
      <Button onClick={() => api.error("保存失败")}>Error</Button>
    </Space>
  );
}
function NotificationDemo() {
  const api = useNotification();
  return (
    <Button
      onClick={() =>
        api.open({ title: "构建完成", description: "Showcase 已成功生成。" })
      }
    >
      打开通知
    </Button>
  );
}
function TourDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>开始引导</Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { title: "欢迎", description: "这是第一步。" },
          { title: "组件目录", description: "从左侧选择组件。" },
        ]}
      />
    </>
  );
}

const modalApi = [
  { name: "open", description: "受控显示状态", type: "boolean" },
  {
    name: "defaultOpen",
    description: "非受控初始打开状态",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "title", description: "标题", type: "ReactNode" },
  { name: "description", description: "辅助描述", type: "ReactNode" },
  {
    name: "children",
    description: "可选的主体内容；仅 title / description / footer 的确认框可省略",
    type: "ReactNode",
  },
  { name: "footer", description: "底部操作区域", type: "ReactNode" },
  {
    name: "size",
    description: "预设宽度",
    type: '"sm" | "md" | "lg" | "xl"',
    defaultValue: '"md"',
  },
  { name: "maxWidth", description: "覆盖预设最大宽度", type: "string" },
  {
    name: "closeOnEsc",
    description: "是否允许 Escape 关闭",
    type: "boolean",
    defaultValue: "true",
  },
  {
    name: "closeOnBackdrop",
    description: "是否允许点击遮罩关闭",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "showCloseButton",
    description: "是否显示右上角关闭按钮",
    type: "boolean",
    defaultValue: "true",
  },
  {
    name: "loading",
    description: "主体加载状态",
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "centered",
    description: "是否垂直居中",
    type: "boolean",
    defaultValue: "true",
  },
  {
    name: "mask",
    description: "是否显示遮罩",
    type: "boolean",
    defaultValue: "true",
  },
  {
    name: "zIndex",
    description: "弹层层级",
    type: "number",
    defaultValue: "50",
  },
  {
    name: "destroyOnClose",
    description: "关闭后销毁内容",
    type: "boolean",
    defaultValue: "true",
  },
  {
    name: "onOk",
    description: "确认操作回调",
    type: "() => void | Promise<void>",
  },
  { name: "onCancel", description: "取消操作回调", type: "() => void" },
  {
    name: "okText",
    description: "确认按钮文案",
    type: "ReactNode",
    defaultValue: '"确定"',
  },
  {
    name: "cancelText",
    description: "取消按钮文案",
    type: "ReactNode",
    defaultValue: '"取消"',
  },
  {
    name: "confirmLoading",
    description: "确认按钮加载状态",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "okButtonProps", description: "确认按钮属性", type: "ButtonProps" },
  {
    name: "cancelButtonProps",
    description: "取消按钮属性",
    type: "ButtonProps",
  },
  {
    name: "styles",
    description: "header/body/footer/mask 样式分区",
    type: "{ header?: CSSProperties; body?: CSSProperties; footer?: CSSProperties; mask?: CSSProperties }",
  },
  {
    name: "aria-label",
    description: "没有可见标题时的可访问名称",
    type: "string",
  },
  { name: "contentStyle", description: "内容内联样式", type: "CSSProperties" },
  { name: "className", description: "附加类名", type: "string" },
  { name: "onClose", description: "关闭回调", type: "() => void" },
  {
    name: "onOpenChange",
    description: "打开状态变化回调",
    type: "(open: boolean) => void",
  },
  {
    name: "afterOpenChange",
    description: "挂载及打开状态提交后回调；不是 CSS 动画结束事件",
    type: "(open: boolean) => void",
  },
];

const drawerApi = [
  ...modalApi
    .filter(
      (row) =>
        ![
          "size",
          "maxWidth",
          "centered",
          "onOk",
          "onCancel",
          "okText",
          "cancelText",
          "confirmLoading",
          "okButtonProps",
          "cancelButtonProps",
        ].includes(row.name),
    )
    .map((row) =>
      row.name === "closeOnBackdrop" ? { ...row, defaultValue: "true" } : row,
    ),
  {
    name: "placement",
    description: "抽屉方向",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"right"',
  },
  {
    name: "width",
    description: "左右抽屉宽度",
    defaultValue: "378",
    type: "number | string",
  },
  {
    name: "height",
    description: "上下抽屉高度",
    defaultValue: "378",
    type: "number | string",
  },
  { name: "extra", description: "标题栏右侧附加内容", type: "ReactNode" },
];

export const feedbackDocuments: Record<string, ComponentDocument> = {
  empty: {
    title: "Empty 空状态",
    description: "表达集合或内容为空的状态；业务文案、Surface 边界和 live-region 策略由调用方拥有。",
    code: EmptyExampleSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <EmptyExample />,
    demos: [
      {
        title: "显式动态播报",
        description: "Empty 默认不是 live region；筛选等动态状态确实需要播报时，由调用方显式提供标准 ARIA 属性。",
        code: EmptyLiveRegionExampleSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <EmptyLiveRegionExample />,
      },
    ],
    api: [
      { name: "title", description: "调用方提供的空态标题；无默认业务文案", type: "ReactNode" },
      { name: "description", description: "补充说明", type: "ReactNode" },
      { name: "icon", description: "可选图标或视觉提示", type: "ReactNode" },
      { name: "action", description: "可选操作入口", type: "ReactNode" },
      { name: "className", description: "根 div 附加类名", type: "string" },
      { name: "role", description: "标准 ARIA role；动态空态需要播报时可显式设为 status", type: "AriaRole" },
      { name: "aria-live", description: "标准 live-region 策略；组件不提供默认值", type: '"off" | "assertive" | "polite"' },
    ],
  },
  result: {
    title: "Result 结果",
    description: "表达操作终态、错误恢复或页面级结果；标题层级、外层 Surface 与 live-region 策略由调用方按上下文拥有。",
    code: ResultExampleSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <ResultExample />,
    demos: [
      {
        title: "页面级结果",
        description: "整页 404/终态使用 H1；Result 自己拥有内容节奏，外层 Card 只拥有边界与 elevation，因此关闭 Card padding。",
        code: ResultPageExampleSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <ResultPageExample />,
      },
      {
        title: "显式动态播报",
        description: "Result 默认不是 live region；异步错误或操作终态确实需要播报时使用标准 role/ARIA。",
        code: ResultLiveRegionExampleSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <ResultLiveRegionExample />,
      },
    ],
    api: [
      { name: "status", description: "结果语义状态与默认状态图标", type: '"success" | "error" | "info" | "warning"', defaultValue: '"info"' },
      { name: "title", description: "结果标题", type: "ReactNode" },
      { name: "description", description: "结果补充说明；统一使用 canonical description 命名", type: "ReactNode" },
      { name: "extra", description: "恢复、返回或下一步操作区域", type: "ReactNode" },
      { name: "children", description: "可选结果详情内容", type: "ReactNode" },
      { name: "headingLevel", description: "结果标题语义层级；页面主结果显式使用 1", type: "HeadingLevel", defaultValue: "2" },
      { name: "className", description: "根 section 附加类名", type: "string" },
      { name: "role", description: "标准 ARIA role；动态结果需要播报时按语义选择 status/alert", type: "AriaRole" },
      { name: "aria-live", description: "标准 live-region 策略；组件不提供默认值", type: '"off" | "assertive" | "polite"' },
    ],
  },
  spin: {
    title: "Spin 加载",
    description: "Spin 用于局部内容加载遮罩；Spinner 用于按钮、行内状态等不需要遮罩的轻量等待反馈。",
    code: '<Spin spinning tip="加载中"><Card /></Spin>',
    render: () => (
      <Spin spinning tip="加载中">
        <div className="h-32 rounded border" />
      </Spin>
    ),
    demos: [
      {
        title: "Spinner 行内指示器",
        description: "Spinner 自带 role=status；业务应提供明确的 aria-label。",
        code: '<Spinner aria-label="正在保存" />',
        render: () => (
          <Space>
            <Spinner aria-label="正在保存" />
            <Text>正在保存</Text>
          </Space>
        ),
      },
    ],
    api: [
      { name: "spinning", description: "是否显示加载遮罩", type: "boolean", defaultValue: "true" },
      { name: "tip", description: "加载说明文字", type: "ReactNode" },
      { name: "children", description: "被遮罩的内容", type: "ReactNode" },
    ],
    apiSections: [
      {
        title: "Spinner API",
        rows: [
          { name: "aria-label", description: "可访问名称；未提供时为 Loading", type: "string", defaultValue: '"Loading"' },
          { name: "className", description: "span 样式类", type: "string" },
        ],
      },
    ],
  },
  alert: {
    title: "Alert 警告提示",
    description: "页面内持续可见的重要信息。",
    code: "<Alert>这是一条提示</Alert>",
    render: () => <Alert>这是一条需要关注的信息。</Alert>,
  },
  progress: {
    title: "Progress 进度条",
    description: "确定性进度，value 和 max 为同一数值单位；非法 max 回退为 100，value 会限制在 0 到 max。",
    code: ProgressExampleSource.replaceAll("../../../../src/core", "@gouno/ui/core"),
    render: () => <ProgressExample />,
    api: [
      { name: "value", description: "当前值，超出范围会限制", type: "number", defaultValue: "0" },
      { name: "max", description: "最大值，必须为正数；否则使用 100", type: "number", defaultValue: "100" },
      { name: "aria-label", description: "进度条可访问名称", type: "string" },
      { name: "className", description: "progress 容器样式类", type: "string" },
    ],
  },
  skeleton: {
    title: "Skeleton 骨架屏",
    description: "结构内容加载前的视觉占位；单个 Skeleton 默认对辅助技术隐藏，加载状态与可访问名称由父级 region 拥有。",
    code: SkeletonExampleSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <SkeletonExample />,
    api: [
      {
        name: "aria-hidden",
        description: "单个视觉占位默认从可访问性树隐藏；确有特殊语义时仍可通过标准属性显式覆盖",
        type: 'boolean | "true" | "false"',
        defaultValue: "true",
      },
      {
        name: "className",
        description: "尺寸、形状、间距等视觉结构由调用方组合",
        type: "string",
      },
    ],
  },
  modal: {
    apiSections: modalApiSections,
    title: "Modal 对话框",
    description: "焦点锁定、Escape 关闭、焦点回收、受控/非受控状态、无主体确认框和加载状态。",
    code: Example1Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example1 />,
    demos: [
      {
        title: "四种尺寸",
        code: Example2Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example2 />,
      },
      {
        title: "状态与生命周期",
        code: Example3Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example3 />,
      },
      {
        title: "默认确认操作",
        code: ModalActionsCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <ModalActions />,
      },
      {
        title: "内容保留与样式",
        code: ModalRetentionCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <ModalRetention />,
      },
      {
        title: "非受控模式",
        code: ModalUncontrolledCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <ModalUncontrolled />,
      },
    ],
    api: modalApi,
  },
  drawer: {
    apiSections: overlayStyleApi,
    title: "Drawer 抽屉",
    description:
      "从四个方向承载辅助任务，支持默认 378px 尺寸、遮罩关闭、受控/非受控状态、加载状态和焦点回收。",
    code: Example4Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example4 />,
    demos: [
      {
        title: "弹出方向",
        description: "支持 top、right、bottom、left。",
        code: Example5Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example5 />,
      },
      {
        title: "状态与生命周期",
        code: Example6Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example6 />,
      },
      {
        title: "内容保留与区域插槽",
        code: DrawerRetentionCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <DrawerRetention />,
      },
      {
        title: "非受控模式",
        code: DrawerUncontrolledCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <DrawerUncontrolled />,
      },
    ],
    api: drawerApi,
  },
  popconfirm: {
    title: "Popconfirm 气泡确认",
    description: "在危险或不可逆操作前请求确认。",
    code: '<Popconfirm title="确认删除？"><Button>删除</Button></Popconfirm>',
    render: () => (
      <Popconfirm title="确认删除？" description="删除后无法恢复。" danger>
        <Button variant="solid" color="error">
          删除
        </Button>
      </Popconfirm>
    ),
  },
  message: {
    title: "Message 全局提示",
    description: "短暂反馈操作结果。",
    code: 'const message = useMessage(); message.success("保存成功")',
    render: () => (
      <MessageProvider>
        <MessageDemo />
      </MessageProvider>
    ),
  },
  notification: {
    title: "Notification 通知提醒",
    description: "展示标题和补充描述的全局通知。",
    code: 'notification.open({ title: "构建完成" })',
    render: () => (
      <NotificationProvider>
        <NotificationDemo />
      </NotificationProvider>
    ),
  },
  tour: {
    title: "Tour 漫游式引导",
    description: "分步介绍页面能力。",
    code: "<Tour open={open} steps={steps} onClose={close} />",
    render: () => <TourDemo />,
  },
};
