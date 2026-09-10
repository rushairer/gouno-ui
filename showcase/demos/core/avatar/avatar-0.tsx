import { Avatar, AvatarFallback, AvatarImage, Space, Text } from "../../../../src/core";

export default function AvatarDemo() {
  return (
    <Space align="center">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/rushairer.png" alt="Gouno 用户头像" />
        <AvatarFallback>GU</AvatarFallback>
      </Avatar>
      <div>
        <Text>图片优先</Text>
        <Text tone="muted" size="sm">
          加载失败时显示 AvatarFallback
        </Text>
      </div>
    </Space>
  );
}
