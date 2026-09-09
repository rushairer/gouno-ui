import { ArrowRight, Download, Plus } from "lucide-react";
import {
  Button,
  IconButton,
  IconButtonLink,
  Space,
} from "../../../../src/core";

export default function ButtonIconFamilyDemo() {
  return (
    <Space wrap>
      <Button variant="solid" color="primary" icon={<Plus />}>
        新建
      </Button>
      <Button icon={<ArrowRight />} iconPlacement="end">
        下一步
      </Button>
      <IconButton label="下载" icon={<Download />} />
      <IconButtonLink
        label="查看图标文档"
        icon={<ArrowRight />}
        to="#core-icon"
        variant="outline"
      />
    </Space>
  );
}
