import { Alert } from "../../../../src/core";

export default function BasicAlerts() {
  return (
    <div className="grid w-full gap-3">
      <Alert type="success" title="操作成功" />
      <Alert type="info" title="有一条新的系统信息" />
      <Alert type="warning" title="配置即将过期" />
      <Alert type="error" title="保存失败，请检查输入" />
    </div>
  );
}
