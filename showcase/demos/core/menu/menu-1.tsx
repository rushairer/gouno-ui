import { Bell, FolderKanban, Users } from "lucide-react";
import { Menu, type MenuNode } from "../../../../src/core";

const items: readonly MenuNode[] = [
  {
    key: "projects",
    type: "submenu",
    label: "Projects",
    icon: <FolderKanban aria-hidden="true" />,
    children: [
      { key: "gouno-ui", label: "Gouno UI" },
      { key: "gosso", label: "Gosso" },
    ],
  },
  { key: "members", label: "Members", icon: <Users aria-hidden="true" /> },
  { key: "notifications", label: "Notifications", icon: <Bell aria-hidden="true" /> },
];

export default function MenuModesExample() {
  return (
    <div className="flex flex-col gap-8">
      <Menu
        aria-label="Project sections"
        mode="horizontal"
        defaultSelectedKeys={["members"]}
        defaultOpenKeys={["projects"]}
        items={items}
      />

      <Menu
        aria-label="Notification filters"
        mode="inline"
        multiple
        inlineCollapsed
        defaultSelectedKeys={["members", "notifications"]}
        items={items}
      />
    </div>
  );
}
