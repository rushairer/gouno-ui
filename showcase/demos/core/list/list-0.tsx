import { List, Tag } from "../../../../src/core";

const tasks = [
  {
    id: "api",
    title: "公共 API 收敛",
    description: "逐项核对命名、默认值、受控状态与 DOM 透传。",
    status: "进行中",
  },
  {
    id: "demo",
    title: "Showcase 同源示例",
    description: "Preview 与展示代码来自同一份可执行 TSX。",
    status: "已完成",
  },
  {
    id: "a11y",
    title: "可访问性回归",
    description: "键盘、语义、ARIA 与禁用态进入自动化测试。",
    status: "已完成",
  },
] as const;

export default function ListBasicExample() {
  return (
    <div className="max-w-2xl">
      <List
        dataSource={tasks}
        rowKey="id"
        bordered
        header="Core 收尾清单"
        footer="3 个工作项"
        renderItem={(item) => (
          <div className="flex w-full min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium">{item.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </div>
            </div>
            <Tag color={item.status === "已完成" ? "success" : "info"}>
              {item.status}
            </Tag>
          </div>
        )}
      />
    </div>
  );
}
