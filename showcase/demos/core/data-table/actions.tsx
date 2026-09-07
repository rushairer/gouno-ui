import { useState } from "react";
import {
  Button,
  Checkbox,
  Space,
  TableCell,
  TableRow,
  Text,
} from "../../../../src/core";
import { DataTable } from "../../../../src/patterns";

export default function TableActions() {
  const [showScore, setShowScore] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>(["a"]);
  const [message, setMessage] = useState("双击一行查看事件回调。");
  return (
    <Space orientation="vertical" align="stretch">
      <DataTable
        rowKey="id"
        dataSource={[
          { id: "a", name: "组件文档", score: 80 },
          { id: "b", name: "构建任务", score: 100 },
          { id: "c", name: "归档任务", score: 40 },
        ]}
        columns={[
          {
            key: "name",
            title: "任务",
            dataIndex: "name",
            ellipsis: true,
            width: 240,
          },
          {
            key: "score",
            title: "得分",
            dataIndex: "score",
            hidden: !showScore,
            align: "right",
          },
        ]}
        selectable
        selectedRowKeys={selected}
        onSelectionChange={setSelected}
        rowDisabled={(row) => row.id === "c"}
        expandedRowKeys={expanded}
        onExpandedRowsChange={setExpanded}
        expandedRowRender={(row) => <Text>{row.name}的详细说明</Text>}
        onRow={(row) => ({
          onDoubleClick: () => setMessage(`双击：${row.name}`),
        })}
        rowClassName={(row) => (row.id === "b" ? "font-medium" : "")}
        toolbar={
          <Checkbox
            label="显示得分列"
            checked={showScore}
            onChange={(event) => setShowScore(event.target.checked)}
          />
        }
        batchActions={(keys, clear) => (
          <Space wrap>
            <Text>已选择 {keys.length} 项</Text>
            <Button
              onClick={() => {
                setMessage(`已操作 ${keys.length} 项`);
                clear();
              }}
            >
              执行批量操作并清空
            </Button>
          </Space>
        )}
        summary={(rows) => (
          <TableRow>
            <TableCell colSpan={showScore ? 4 : 3}>
              本页合计 {rows.reduce((sum, row) => sum + row.score, 0)} 分
            </TableCell>
          </TableRow>
        )}
        pagination={{ defaultPage: 1, defaultPageSize: 5 }}
      />
      <Text aria-live="polite">{message}</Text>
    </Space>
  );
}
