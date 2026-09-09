import { Result } from "../../../../src/core";

export default function ResultLiveRegionExample() {
  return (
    <Result
      status="error"
      role="alert"
      title="保存失败"
      description="网络暂时不可用，刚才的修改仍保留在当前页面。"
    />
  );
}
