import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/core";

export default function UnborderedTableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名称</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>负责人</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Gouno UI</TableCell>
          <TableCell>正常</TableCell>
          <TableCell>Design</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Blog</TableCell>
          <TableCell>预览</TableCell>
          <TableCell>Product</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
