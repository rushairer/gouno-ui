import { Alert } from "../../../../src/core";

export default function BannerVariants() {
  return (
    <div className="grid w-full gap-3 overflow-hidden rounded-lg border">
      <Alert banner title="计划维护：今晚 23:00–23:20" />
      <div className="grid gap-3 p-4">
        <Alert
          type="info"
          variant="outlined"
          showIcon
          title="Outlined"
          description="默认保留语义边框与轻量背景。"
        />
        <Alert
          type="warning"
          variant="filled"
          showIcon
          title="Filled"
          description="Filled 使用更明确的语义色背景。"
        />
      </div>
    </div>
  );
}
