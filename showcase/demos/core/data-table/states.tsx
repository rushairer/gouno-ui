import { useState } from "react";
import { Button, Select, Space, Text } from "../../../../src/core";
import { DataTable } from "../../../../src/patterns";

export default function TableStates() {
  const [state, setState] = useState("ready");
  const [density, setDensity] = useState<"default" | "compact" | "touch">(
    "default",
  );
  return (
    <Space orientation="vertical" align="stretch">
      <Space wrap>
        {["ready", "loading", "empty", "error"].map((value) => (
          <Button
            key={value}
            onClick={() => setState(value)}
            aria-pressed={state === value}
          >
            {value}
          </Button>
        ))}
        <Select
          aria-label="表格密度"
          value={density}
          onChange={(event) => setDensity(event.target.value as typeof density)}
        >
          <option value="default">默认</option>
          <option value="compact">紧凑</option>
          <option value="touch">触控</option>
        </Select>
      </Space>
      <DataTable
        caption="状态切换保留表头与表格容器"
        captionSide="bottom"
        columns={[
          { key: "name", title: "项目", dataIndex: "name" },
          { key: "owner", title: "负责人", dataIndex: "owner" },
        ]}
        dataSource={[
          { name: "Gouno UI", owner: "Design" },
          { name: "Blog", owner: "Product" },
        ]}
        loading={state === "loading"}
        loadingRows={3}
        loadingCols={2}
        empty={state === "empty"}
        emptyState={<Text>暂无记录，请调整筛选条件。</Text>}
        error={
          state === "error" ? (
            <Button onClick={() => setState("ready")}>
              加载失败，点击重试
            </Button>
          ) : undefined
        }
        density={density}
        bordered
      />
    </Space>
  );
}
