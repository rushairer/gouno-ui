import { useState } from "react";
import { Transfer } from "../../../../src/core";

const members = [
  { key: "aben", title: "阿笨" },
  { key: "alice", title: "Alice" },
  { key: "readonly", title: "只读成员", disabled: true },
];

export default function TransferDemo() {
  const [targetKeys, setTargetKeys] = useState<string[]>(["alice"]);

  return (
    <div className="max-w-2xl">
      <Transfer
        aria-label="成员分配"
        dataSource={members}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        titles={["可选成员", "已分配成员"]}
        operations={["添加", "移除"]}
      />
    </div>
  );
}
