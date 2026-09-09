import {
  Button,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "../../../../src/core";

export default function PopoverExample() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <Popover>
        <PopoverAnchor asChild>
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
            <Text size="sm" tone="muted">
              定位锚点
            </Text>
            <PopoverTrigger asChild>
              <Button>打开 Popover</Button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent placement="bottom-start" offset={8}>
          <Text className="font-medium">批量操作说明</Text>
          <Text size="sm" tone="muted">
            Popover 只承载轻量上下文，不替代 Modal 或 Drawer。
          </Text>
        </PopoverContent>
      </Popover>
    </div>
  );
}
