import { useState } from "react";
import { Button } from "./button";

export interface PaginationProps {
  page?: number;
  defaultPage?: number;
  total: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function Pagination({ page, defaultPage = 1, total, pageSize = 10, onChange, disabled, ariaLabel = "Pagination" }: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const currentPage = page ?? internalPage;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const update = (next: number) => {
    const bounded = Math.min(pages, Math.max(1, next));
    if (page === undefined) setInternalPage(bounded);
    onChange?.(bounded, pageSize);
  };
  return <nav aria-label={ariaLabel} className="flex items-center gap-1"><Button size="sm" variant="outline" disabled={disabled || currentPage <= 1} onClick={() => update(currentPage - 1)}>Previous</Button><span className="px-2 text-sm" aria-live="polite">{currentPage} / {pages}</span><Button size="sm" variant="outline" disabled={disabled || currentPage >= pages} onClick={() => update(currentPage + 1)}>Next</Button></nav>;
}
