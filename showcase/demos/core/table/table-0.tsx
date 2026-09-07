import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from "../../../../src/core";

export default function Example1() {
  return (
    <Table bordered>
      <TableHeader>
        <TableRow>
          <TableHead>名称</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>负责人</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell>Gouno UI</TableCell>
          <TableCell>
            <Tag tone="success">正常</Tag>
          </TableCell>
          <TableCell>Design</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Blog</TableCell>
          <TableCell>
            <Tag tone="info">预览</Tag>
          </TableCell>
          <TableCell>Product</TableCell>
        </TableRow>
        <TableRow aria-disabled="true" className="opacity-60">
          <TableCell>Legacy</TableCell>
          <TableCell>禁用</TableCell>
          <TableCell>Archive</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>总计</TableCell>
          <TableCell colSpan={2}>3 项</TableCell>
        </TableRow>
      </TableFooter>
      <TableCaption side="bottom">组件状态与负责人</TableCaption>
    </Table>
  );
}
