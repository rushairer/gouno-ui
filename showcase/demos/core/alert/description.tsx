import { Alert } from "../../../../src/core";

export default function DescriptionAlerts() {
  return (
    <div className="grid w-full gap-3">
      <Alert
        type="success"
        showIcon
        title="部署完成"
        description="生产环境已经切换到新版本，所有健康检查均通过。"
      />
      <Alert
        type="warning"
        showIcon
        title="需要关注"
        description="当前客户端拥有 admin scope，请确认它只分配给受信任服务。"
      />
    </div>
  );
}
