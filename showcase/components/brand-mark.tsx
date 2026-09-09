import type { CSSProperties } from "react";

export function BrandMark({
  src,
  className = "size-6",
}: {
  src: string;
  className?: string;
}) {
  const style: CSSProperties = {
    WebkitMask: `url("${src}") center / contain no-repeat`,
    mask: `url("${src}") center / contain no-repeat`,
  };

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={style}
    />
  );
}
