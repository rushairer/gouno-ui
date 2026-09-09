import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../src/core";

export default function DropdownExample() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>更多操作</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6}>
          <DropdownMenuLabel>文章操作</DropdownMenuLabel>
          <DropdownMenuItem>编辑</DropdownMenuItem>
          <DropdownMenuItem>复制</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
