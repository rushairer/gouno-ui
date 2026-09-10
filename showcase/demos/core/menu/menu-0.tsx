import { useState, type Key } from "react";
import { Boxes, Home, Settings } from "lucide-react";
import { Menu, type MenuNode } from "../../../../src/core";

const items: readonly MenuNode[] = [
  { key: "home", label: "Overview", icon: <Home aria-hidden="true" /> },
  {
    key: "workspace",
    type: "submenu",
    label: "Workspace",
    icon: <Boxes aria-hidden="true" />,
    children: [
      { key: "members", label: "Members" },
      { key: "roles", label: "Roles" },
      { key: "audit", label: "Audit log", disabled: true },
    ],
  },
  { key: "divider-main", type: "divider" },
  {
    key: "settings-group",
    type: "group",
    label: "Administration",
    children: [
      { key: "settings", label: "Settings", icon: <Settings aria-hidden="true" /> },
    ],
  },
];

export default function MenuControlledExample() {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>(["home"]);
  const [openKeys, setOpenKeys] = useState<Key[]>(["workspace"]);

  return (
    <Menu
      aria-label="Workspace navigation"
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      onSelect={({ selectedKeys: nextSelectedKeys }) => setSelectedKeys(nextSelectedKeys)}
    />
  );
}
