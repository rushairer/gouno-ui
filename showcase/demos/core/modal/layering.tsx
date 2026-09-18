import { useState } from "react";
import {
  Button,
  Modal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Space,
  Text,
} from "../../../../src/core";

export default function ModalLayeringExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开嵌套层级示例</Button>
      <Modal
        open={open}
        title="Modal 内嵌浮层"
        description="Popup layer 必须稳定高于 Modal surface，而不是依赖 Portal DOM 顺序。"
        onClose={() => setOpen(false)}
        footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
      >
        <Space direction="vertical" size="middle" className="w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button>打开 Modal 内 Popover</Button>
            </PopoverTrigger>
            <PopoverContent placement="bottom-start">
              <Text>Popover 应稳定位于 Modal 之上。</Text>
            </PopoverContent>
          </Popover>

          <Select aria-label="Modal 内 Select" defaultValue="alpha">
            <option value="alpha">Alpha</option>
            <option value="beta">Beta</option>
          </Select>
        </Space>
      </Modal>
    </>
  );
}
