import { Avatar, AvatarFallback, AvatarImage, Space } from "../../../../src/core";

export default function AvatarDemo() {
  return (
    <Space wrap align="center">
      <Avatar size="small"><AvatarFallback>S</AvatarFallback></Avatar>
      <Avatar size="middle"><AvatarFallback>M</AvatarFallback></Avatar>
      <Avatar size="large" shape="square"><AvatarFallback>L</AvatarFallback></Avatar>
      <Avatar size={48}>
        <AvatarImage src="https://github.com/rushairer.png" alt="Gouno 用户头像" />
        <AvatarFallback>GU</AvatarFallback>
      </Avatar>
    </Space>
  );
}
