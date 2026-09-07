import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/core";

export default function GroupedTableDemo() {
  return (
    <Table bordered>
      <TableCaption side="bottom">
        季度汇总：使用原生表头分组和合并单元格
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" rowSpan={2}>
            团队
          </TableHead>
          <TableHead scope="colgroup" colSpan={2}>
            季度访问量
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead scope="col">第一季度</TableHead>
          <TableHead scope="col">第二季度</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">文档</TableHead>
          <TableCell>1,200</TableCell>
          <TableCell>1,800</TableCell>
        </TableRow>
        <TableRow>
          <TableHead scope="row">社区</TableHead>
          <TableCell>800</TableCell>
          <TableCell>1,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead scope="row">合计</TableHead>
          <TableCell>2,000</TableCell>
          <TableCell>2,800</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
