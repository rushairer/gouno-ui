import {
  Space,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/core";

export default function Example2() {
  return (
    <Space orientation="vertical" className="w-full">
      <Table density="compact" bordered>
        <TableHeader>
          <TableRow>
            <TableHead>紧凑表格</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>构建任务</TableCell>
            <TableCell>完成</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table density="touch" bordered fixed stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead>触控表格</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>发布任务</TableCell>
            <TableCell>等待</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Space>
  );
}
