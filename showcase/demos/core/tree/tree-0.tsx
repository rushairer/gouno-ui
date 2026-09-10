import { useState, type Key } from "react";
import { FileText, Folder } from "lucide-react";
import { Tree, type TreeNode } from "../../../../src/core";

const treeData: TreeNode[] = [
  {
    key: "src",
    title: "src",
    icon: <Folder />,
    children: [
      {
        key: "core",
        title: "core",
        icon: <Folder />,
        children: [
          { key: "button", title: "button.tsx", icon: <FileText />, isLeaf: true },
          { key: "tree", title: "tree.tsx", icon: <FileText />, isLeaf: true },
        ],
      },
      { key: "theme", title: "theme", icon: <Folder />, isLeaf: true },
    ],
  },
];

export default function TreeControlledExample() {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>(["tree"]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>(["button"]);

  return (
    <div className="grid gap-3">
      <Tree
        treeData={treeData}
        defaultExpandedKeys={["src", "core"]}
        selectedKeys={selectedKeys}
        checkedKeys={checkedKeys}
        checkable
        showIcon
        showLine
        blockNode
        onSelect={(keys) => setSelectedKeys(keys)}
        onCheck={(keys) =>
          setCheckedKeys(Array.isArray(keys) ? [...keys] : [...keys.checked])
        }
      />
      <p className="text-xs text-muted-foreground">
        Selected: {selectedKeys.map(String).join(", ") || "none"}
      </p>
    </div>
  );
}
