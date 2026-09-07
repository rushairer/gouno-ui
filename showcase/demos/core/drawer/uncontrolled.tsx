import { useState } from "react";
import { Button, Drawer, Space, Text } from "../../../../src/core";

export default function UncontrolledDrawer() {
  const [mounted, setMounted] = useState(false);
  return (
    <Space orientation="vertical">
      <Button onClick={() => setMounted(true)}>非受控抽屉</Button>
      {mounted && (
        <Drawer
          defaultOpen
          title="非受控模式"
          placement="bottom"
          height={320}
          onClose={() => setMounted(false)}
        >
          <Text>由 defaultOpen 打开，Escape 或遮罩关闭。</Text>
        </Drawer>
      )}
    </Space>
  );
}
