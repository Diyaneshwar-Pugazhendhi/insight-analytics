import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getOrders } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageState } from '@/components/ui/StateView';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { OrderStatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/format';
import type { OrderRow, SortDirection } from '@/types';

const COLUMNS: Column<OrderRow>[] = [
  { key: 'id', header: 'Order', sortable: true },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'product', header: 'Product', sortable: true },
  { key: 'quantity', header: 'Qty', sortable: true, align: 'right' },
  { key: 'total', header: 'Total', sortable: true, align: 'right', render: (r) => formatCurrency(r.total) },
  { key: 'status', header: 'Status', sortable: true, render: (r) => <OrderStatusBadge status={r.status} /> },
  { key: 'date', header: 'Date', sortable: true, align: 'right', render: (r) => formatDate(r.date) },
];

export function OrdersPage() {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);

  const { data, loading, error, reload } = useAsync(
    () => getOrders({ page, pageSize: 10, sortField, sortDirection }),
    [page, sortField, sortDirection],
  );

  const onSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setPage(1);
  };

  return (
    <PageState loading={loading} error={error} onRetry={reload}>
      {data && (
        <Card title="Orders" subtitle={`${data.pagination.total.toLocaleString()} total orders`} padded={false}>
          <DataTable
            columns={COLUMNS}
            data={data.data}
            rowKey={(r) => r.id}
            loading={loading}
            pagination={data.pagination}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            onPageChange={setPage}
          />
        </Card>
      )}
    </PageState>
  );
}
