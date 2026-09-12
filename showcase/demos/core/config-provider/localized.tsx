import { useState } from "react";
import { ConfigProvider, enUS, zhCN, Input, InputNumber, DatePicker, Select, Upload, Pagination, Button } from "../../../../src/core";

export default function LocalizedControlsExample() {
  const [chinese, setChinese] = useState(true);
  return <div className="flex w-full min-w-0 flex-col gap-4">
    <Button onClick={() => setChinese((value) => !value)}>切换语言 / Switch language</Button>
    <ConfigProvider locale={chinese ? zhCN : enUS}>
      <Input aria-label="Title / 标题" defaultValue="Long input text with suffix" suffix="字符" allowClear />
      <Input aria-label="Custom / 自定义" defaultValue="Local override" allowClear locale={{ clearLabel: "重置标题" }} />
      <InputNumber aria-label="Count / 数量" defaultValue={1} />
      <DatePicker aria-label="Date / 日期" defaultValue="2026-09-12" />
      <Select aria-label="Status / 状态" allowClear showSearch defaultValue="draft">
        <option value="draft">Draft / 草稿</option><option value="ready">Ready / 已准备</option>
      </Select>
      <Upload aria-label="Files / 文件"><span>Choose files / 选择文件</span></Upload>
      <Pagination total={200} showQuickJumper showSizeChanger />
    </ConfigProvider>
  </div>;
}
