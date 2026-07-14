import { ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Pagination, SortDirection } from '@/types';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  pagination?: Pagination;
  sortField?: string;
  sortDirection?: SortDirection;
  onSortChange?: (field: string) => void;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  pagination,
  sortField,
  sortDirection,
  onSortChange,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              {columns.map((col) => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    {col.sortable && onSortChange ? (
                      <button
                        type="button"
                        onClick={() => onSortChange(col.key)}
                        className="inline-flex items-center gap-1 hover:text-slate-200"
                      >
                        {col.header}
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  No records found
                </td>
              </tr>
            )}
            {!loading &&
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-slate-800/60 transition hover:bg-slate-800/40"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-slate-300',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        col.className,
                      )}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-sm">
          <span className="text-slate-400">
            Page <span className="text-slate-200">{pagination.page}</span> of {pagination.totalPages}
            <span className="ml-2 text-slate-500">({pagination.total.toLocaleString()} total)</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="btn-ghost px-2 py-1 disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="btn-ghost px-2 py-1 disabled:opacity-40"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
