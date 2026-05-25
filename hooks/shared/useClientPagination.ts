import { useMemo, useState } from 'react';

interface UseClientPaginationOptions<T> {
  readonly items: T[];
  readonly pageSize: number;
}

interface UseClientPaginationResult<T> {
  readonly currentPage: number;
  readonly setCurrentPage: (page: number) => void;
  readonly totalPages: number;
  readonly paginatedItems: T[];
}

export function useClientPagination<T>({ items, pageSize }: UseClientPaginationOptions<T>): UseClientPaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const updateCurrentPage = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
  };

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, safeCurrentPage, pageSize]);

  return {
    currentPage: safeCurrentPage,
    setCurrentPage: updateCurrentPage,
    totalPages,
    paginatedItems,
  };
}