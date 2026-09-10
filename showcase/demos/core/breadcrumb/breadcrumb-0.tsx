import { useState } from "react";
import { Breadcrumb } from "../../../../src/core";

export default function BreadcrumbRouteExample() {
  const [selection, setSelection] = useState("none");

  return (
    <div className="grid gap-3">
      <Breadcrumb
        params={{ projectId: "gouno-ui" }}
        items={[
          { key: "home", title: "Home", path: "" },
          {
            key: "projects",
            title: "Projects",
            path: "projects",
            menu: {
              ariaLabel: "Choose project",
              items: [
                {
                  key: "gouno-ui",
                  title: "Gouno UI",
                  onClick: () => setSelection("Gouno UI"),
                },
                {
                  key: "gosso",
                  title: "Gosso",
                  onClick: () => setSelection("Gosso"),
                },
              ],
            },
          },
          {
            key: "project",
            title: "Gouno UI",
            path: ":projectId",
          },
          { key: "components", title: "Components", path: "components" },
        ]}
      />
      <p className="text-xs text-muted-foreground">
        Menu selection: {selection}
      </p>
    </div>
  );
}
