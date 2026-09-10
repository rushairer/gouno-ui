import { Clock3 } from "lucide-react";
import { Timeline } from "../../../../src/core";

export default function TimelineBasicExample() {
  return (
    <div className="max-w-2xl">
      <Timeline
        items={[
          {
            key: "created",
            title: "09:00",
            content: "创建发布任务",
            color: "var(--success)",
          },
          {
            key: "review",
            title: "09:12",
            content: "完成 API 与示例代码复核",
            icon: <Clock3 className="size-3" aria-hidden="true" />,
          },
          {
            key: "publishing",
            title: "现在",
            content: "正在发布 Showcase",
            loading: true,
          },
        ]}
      />
    </div>
  );
}
