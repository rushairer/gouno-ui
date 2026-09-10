import { ChevronRight, Home } from "lucide-react";
import { Breadcrumb } from "../../../../src/core";

export default function BreadcrumbRenderExample() {
  return (
    <Breadcrumb
      separator={<ChevronRight className="size-3.5" aria-hidden="true" />}
      items={[
        { key: "home", title: "Home", href: "/" },
        { key: "section", type: "separator", separator: "·" },
        { key: "library", title: "Library", href: "/library" },
        { key: "detail", title: "Component detail" },
      ]}
      itemRender={({ item, href, isLast }) =>
        href ? (
          <a
            href={href}
            aria-current={isLast ? "page" : undefined}
            className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
          >
            {item.key === "home" ? <Home className="size-3.5" aria-hidden="true" /> : null}
            {item.title}
          </a>
        ) : (
          <span aria-current={isLast ? "page" : undefined}>{item.title}</span>
        )
      }
    />
  );
}
