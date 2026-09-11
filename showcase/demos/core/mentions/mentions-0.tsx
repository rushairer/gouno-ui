import { useState } from "react";
import { Mentions } from "../../../../src/core";

export default function MentionsDemo() {
  const [value, setValue] = useState("欢迎 ");
  const [selected, setSelected] = useState<string>();

  return (
    <div className="grid max-w-xl gap-4">
      <div className="grid gap-2">
        <span className="text-sm font-medium">评论内容</span>
        <Mentions
          aria-label="评论内容"
          options={["alice", "aben", "bob"]}
          value={value}
          onChange={setValue}
          onSelect={setSelected}
          placeholder="输入 @ 提及成员"
          showCount
          maxLength={120}
        />
        <p className="text-sm text-muted-foreground">
          {selected ? `最近选择：@${selected}` : "输入 @ 后可用方向键与 Enter 选择"}
        </p>
      </div>

      <Mentions
        aria-label="特殊前缀提及"
        prefix="+"
        options={["alpha", "beta"]}
        defaultValue="通知 +al"
        status="warning"
      />
    </div>
  );
}
