import { useState } from "react";
import { Cloud, FileCode2 } from "lucide-react";
import { Tree, type TreeNode } from "../../../../src/core";

const initialData: TreeNode[] = [
  {
    key: "remote",
    title: "Remote modules",
    icon: <Cloud />,
    isLeaf: false,
  },
];

export default function TreeAsyncExample() {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);

  return (
    <Tree
      treeData={treeData}
      showIcon
      blockNode
      loadData={async (node) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (node.key !== "remote") return;
        setTreeData([
          {
            ...node,
            children: [
              {
                key: "remote-api",
                title: "api.ts",
                icon: <FileCode2 />,
                isLeaf: true,
              },
              {
                key: "remote-client",
                title: "client.ts",
                icon: <FileCode2 />,
                isLeaf: true,
              },
            ],
          },
        ]);
      }}
    />
  );
}
