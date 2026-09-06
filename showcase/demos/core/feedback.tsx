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
import { useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  Empty,
  Input,
  MessageProvider,
  Modal,
  NotificationProvider,
  Popconfirm,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Result,
  Skeleton,
  Space,
  Spin,
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tour,
  useMessage,
  useNotification,
  type DrawerPlacement,
} from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

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
  { name: "isOpen", description: "受控显示状态的兼容别名", type: "boolean" },
  {
    name: "defaultOpen",
    description: "非受控初始打开状态",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "title", description: "标题", type: "ReactNode" },
  { name: "description", description: "辅助描述", type: "ReactNode" },
  { name: "children", description: "对话框主体内容", type: "ReactNode" },
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
    name: "ariaLabel",
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
    description: "无数据时的说明和操作入口。",
    code: '<Empty title="暂无数据" description="创建第一条记录" />',
    render: () => (
      <Empty
        title="暂无数据"
        description="创建第一条记录后会显示在这里。"
        action={<Button variant="primary">新建</Button>}
      />
    ),
  },
  result: {
    title: "Result 结果",
    description: "操作结果和下一步入口。",
    code: '<Result status="success" title="操作成功" />',
    render: () => (
      <Result
        status="success"
        title="操作成功"
        subTitle="数据已经保存"
        extra={<Button>返回列表</Button>}
      />
    ),
  },
  spin: {
    title: "Spin 加载",
    description: "局部内容加载遮罩。",
    code: '<Spin spinning tip="加载中"><Card /></Spin>',
    render: () => (
      <Spin spinning tip="加载中">
        <div className="h-32 rounded border" />
      </Spin>
    ),
  },
  alert: {
    title: "Alert 警告提示",
    description: "页面内持续可见的重要信息。",
    code: "<Alert>这是一条提示</Alert>",
    render: () => <Alert>这是一条需要关注的信息。</Alert>,
  },
  progress: {
    title: "Progress 进度条",
    description: "展示任务完成进度。",
    code: "<Progress value={60} />",
    render: () => (
      <Space direction="vertical">
        <Progress value={60} />
        <Progress value={100} />
      </Space>
    ),
  },
  skeleton: {
    title: "Skeleton 骨架屏",
    description: "内容加载前的结构占位。",
    code: '<Skeleton className="h-8 w-full" />',
    render: () => (
      <Space direction="vertical">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </Space>
    ),
  },
  modal: {
    apiSections: modalApiSections,
    title: "Modal 对话框",
    description: "焦点锁定、Escape 关闭、焦点回收、受控/非受控状态和加载状态。",
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
  popover: {
    title: "Popover 气泡卡片",
    description: "由触发器打开的轻量内容面板。",
    code: "<Popover><PopoverTrigger>打开</PopoverTrigger><PopoverContent>内容</PopoverContent></Popover>",
    render: () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button>打开 Popover</Button>
        </PopoverTrigger>
        <PopoverContent>可放置说明和操作。</PopoverContent>
      </Popover>
    ),
  },
  tooltip: {
    title: "Tooltip 文字提示",
    description: "悬停或聚焦时解释控件。",
    code: "<TooltipProvider><Tooltip><TooltipTrigger asChild><Button>聚焦或悬停</Button></TooltipTrigger><TooltipContent>补充说明</TooltipContent></Tooltip></TooltipProvider>",
    render: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>聚焦或悬停</Button>
          </TooltipTrigger>
          <TooltipContent>补充说明</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  popconfirm: {
    title: "Popconfirm 气泡确认",
    description: "在危险或不可逆操作前请求确认。",
    code: '<Popconfirm title="确认删除？"><Button>删除</Button></Popconfirm>',
    render: () => (
      <Popconfirm title="确认删除？" description="删除后无法恢复。" danger>
        <Button variant="danger">删除</Button>
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
