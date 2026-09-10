import { Button, List } from "../../../../src/core";

export default function ListStatesExample() {
  return (
    <div className="grid max-w-3xl gap-6 md:grid-cols-2">
      <List<{ id: string }>
        dataSource={[]}
        rowKey="id"
        size="small"
        locale={{ emptyText: "暂无待处理项目" }}
        renderItem={(item) => <span>{item.id}</span>}
      />
      <List
        dataSource={[{ id: "build", title: "正在校验构建产物" }]}
        rowKey="id"
        loading
        split={false}
        loadMore={<Button size="small">加载更多</Button>}
        renderItem={(item) => <span>{item.title}</span>}
      />
    </div>
  );
}
