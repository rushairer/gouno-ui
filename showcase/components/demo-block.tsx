import type { ReactNode } from "react";
export function DemoBlock({children}:{children:ReactNode}){
  return <div className="demo-block min-h-40 rounded-md border bg-background p-6"><div className="demo-block__content">{children}</div></div>;
}
