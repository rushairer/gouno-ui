import { useState } from "react";
import {
  Button,
  Drawer,
  Space,
  Text,
  type DrawerPlacement,
} from "../../../../src/core";
function DrawerPlacementDemo() {
  const [placement, setPlacement] = useState<DrawerPlacement | null>(null);
  return (
    <>
      <Space wrap>
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Button key={side} onClick={() => setPlacement(side)}>
            {side}
          </Button>
        ))}
      </Space>
      <Drawer
        open={placement !== null}
        placement={placement ?? "right"}
        title={`${placement ?? "right"} Drawer`}
        height={320}
        width={420}
        onClose={() => setPlacement(null)}
      >
        <Text>四个方向共用相同的焦点管理和关闭行为。</Text>
      </Drawer>
    </>
  );
}
export default function Example5() {
  return <DrawerPlacementDemo />;
}
