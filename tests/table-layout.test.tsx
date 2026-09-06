import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/core";

describe("Table layout contract", () => {
  afterEach(cleanup);
  it("applies density padding and keeps footer cells vertically aligned", () => {
    render(
      <Table density="touch">
        <TableHeader>
          <TableRow>
            <TableHead>Head</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Body</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    const table = screen.getByRole("table");
    expect(table.className).toContain("[&_tfoot_td]:align-middle");
    expect(table.className).toContain("[&_td]:py-4");
    expect(table.className).toContain("[&_tfoot_tr]:border-t-2");
    expect(table.className).toContain("[&_tfoot_td]:h-14");
  });

  it("does not add vertical cell borders when bordered is false", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>One</TableCell>
            <TableCell>Two</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("table").className).not.toContain("border-r");
  });
});
