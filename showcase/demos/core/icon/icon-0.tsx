import { CircleCheck, LoaderCircle, Navigation } from "lucide-react";
import { Icon, Space, Text } from "../../../../src/core";

export default function IconDemo() {
  return (
    <Space wrap align="center" gap="lg">
      <Space align="center" gap="sm">
        <Icon icon={<CircleCheck />} size="small" />
        <Text size="sm">Decorative</Text>
      </Space>
      <Space align="center" gap="sm">
        <Icon icon={<CircleCheck />} aria-label="Completed" />
        <Text size="sm">Accessible label</Text>
      </Space>
      <Space align="center" gap="sm">
        <Icon icon={<LoaderCircle />} spin size="large" aria-label="Loading" />
        <Text size="sm">Spin</Text>
      </Space>
      <Space align="center" gap="sm">
        <Icon icon={<Navigation />} rotate={45} size={24} aria-label="Direction" />
        <Text size="sm">Rotate + pixels</Text>
      </Space>
    </Space>
  );
}
