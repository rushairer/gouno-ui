import { useState } from "react";
import { Button, Space, Tag, Text } from "../../../../src/core";

export default function ClosableTagDemo() {
  const [visible, setVisible] = useState(true);
  const [action, setAction] = useState("尚未关闭");

  return (
    <Space orientation="vertical">
      <Space wrap>
        {visible ? (
          <Tag
            closable
            onClose={() => {
              setVisible(false);
              setAction("已关闭 Release 标签");
            }}
          >
            Release
          </Tag>
        ) : (
          <Button
            size="small"
            onClick={() => {
              setVisible(true);
              setAction("已恢复 Release 标签");
            }}
          >
            恢复标签
          </Button>
        )}
        <Tag
          closable
          closeIcon={<span aria-hidden="true">×</span>}
          onClose={() => setAction("点击了自定义关闭按钮")}
        >
          Custom close icon
        </Tag>
        <Tag closable disabled onClose={() => setAction("不应触发")}>
          Disabled
        </Tag>
      </Space>
      <Text tone="muted" aria-live="polite">
        {action}
      </Text>
    </Space>
  );
}
