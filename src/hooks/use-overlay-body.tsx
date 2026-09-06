import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** A detached portal retains form state without keeping a closed focus scope mounted. */
export function useOverlayBody(children: ReactNode, open: boolean, destroyOnClose: boolean) {
  const [host] = useState(() => typeof document === "undefined" ? null : document.createElement("div"));
  const [visited, setVisited] = useState(open);
  useEffect(() => { if (open) setVisited(true); }, [open]);
  const attach = useCallback((node: HTMLDivElement | null) => {
    if (node && host) node.appendChild(host);
  }, [host]);
  return {
    body: <div ref={attach} />,
    portal: host && (open || (visited && !destroyOnClose)) ? createPortal(children, host) : null,
  };
}
