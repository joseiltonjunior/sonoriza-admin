export interface PaginationMetaProps {
  currentPage: number
  lastPage: number
  totalItems: number
}

interface PaginationMetaResponseProps {
  currentPage?: number
  page?: number
  lastPage?: number
  totalItems?: number
  total?: number
}

export interface PaginatedResponseProps<T> {
  data: T[]
  meta?: PaginationMetaResponseProps
}

export const EMPTY_PAGINATION_META: PaginationMetaProps = {
  currentPage: 0,
  lastPage: 0,
  totalItems: 0,
}

export function normalizePaginationMeta(
  meta?: PaginationMetaResponseProps,
  fallbackItemCount = 0,
): PaginationMetaProps {
  return {
    currentPage:
      meta?.currentPage ?? meta?.page ?? (fallbackItemCount > 0 ? 1 : 0),
    lastPage: meta?.lastPage ?? (fallbackItemCount > 0 ? 1 : 0),
    totalItems: meta?.totalItems ?? meta?.total ?? fallbackItemCount,
  }
}
