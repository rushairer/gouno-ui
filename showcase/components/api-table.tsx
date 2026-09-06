import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/core";

export interface ApiRow {
  name: string;
  description: string;
  type: string;
  defaultValue?: string;
}

export function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <Table density="compact" bordered>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Property</TableHead>
          <TableHead scope="col">Description</TableHead>
          <TableHead scope="col">Type</TableHead>
          <TableHead scope="col">Default</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-mono text-primary">{row.name}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell className="font-mono text-xs">{row.type}</TableCell>
            <TableCell className="font-mono text-xs">
              {row.defaultValue ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
