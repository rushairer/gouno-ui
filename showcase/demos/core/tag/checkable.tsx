import { useState } from "react";
import { CheckableTag, Space, Text } from "../../../../src/core";

const topicOptions = ["Movies", "Books", "Music"];

export default function CheckableTagDemo() {
  const [selected, setSelected] = useState(["Movies"]);

  return (
    <Space orientation="vertical">
      <Space wrap>
        {topicOptions.map((topic) => (
          <CheckableTag
            key={topic}
            checked={selected.includes(topic)}
            onChange={(checked) =>
              setSelected((current) =>
                checked
                  ? [...current, topic]
                  : current.filter((item) => item !== topic),
              )
            }
          >
            {topic}
          </CheckableTag>
        ))}
        <CheckableTag disabled defaultChecked>
          Disabled
        </CheckableTag>
      </Space>
      <Text tone="muted" aria-live="polite">
        已选择：{selected.join("、") || "无"}
      </Text>
    </Space>
  );
}
