import { useState } from "react";
import { Button, Drawer, Input } from "../../../../src/core";
function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开 Drawer</Button>
      <Drawer open={open} title="筛选条件" onClose={() => setOpen(false)}>
        <Input placeholder="搜索" />
      </Drawer>
    </>
  );
}
export default function Example4() {
  return <DrawerDemo />;
}
