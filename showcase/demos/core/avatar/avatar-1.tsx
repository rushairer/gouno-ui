import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, Space, Text } from "../../../../src/core";

const members = ["AB", "CD", "EF", "GH", "IJ", "KL"];

export default function AvatarGroupDemo() {
  return (
    <Space orientation="vertical" gap="lg" align="start">
      <AvatarGroup max={4} overflowRender={(count) => `+${count}`}>
        {members.map((member) => (
          <Avatar key={member} size="middle"><AvatarFallback>{member}</AvatarFallback></Avatar>
        ))}
      </AvatarGroup>
      <Space align="center">
        <Avatar size="middle"><AvatarFallback>AB</AvatarFallback><AvatarBadge aria-label="在线" /></Avatar>
        <Text tone="muted">Badge 的可访问名称由调用方按业务语义提供。</Text>
      </Space>
    </Space>
  );
}
