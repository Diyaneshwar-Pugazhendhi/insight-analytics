import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getUsers } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageState } from '@/components/ui/StateView';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { UserStatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { formatDate, timeAgo } from '@/lib/format';
import type { SortDirection, UserRow } from '@/types';

const ROLE_TONE: Record<UserRow['role'], 'sky' | 'violet' | 'amber' | 'slate'> = {
  admin: 'sky',
  moderator: 'violet',
  viewer: 'slate',
  user: 'amber',
};

const COLUMNS: Column<UserRow>[] = [
  { key: 'name', header: 'Name', sortable: true, render: (r) => <span className="font-medium text-slate-100">{r.name}</span> },
  { key: 'email', header: 'Email', sortable: true, render: (r) => <span className="text-slate-400">{r.email}</span> },
  { key: 'role', header: 'Role', sortable: true, render: (r) => <Badge tone={ROLE_TONE[r.role]}>{r.role}</Badge> },
  { key: 'status', header: 'Status', sortable: true, render: (r) => <UserStatusBadge status={r.status} /> },
  { key: 'lastLogin', header: 'Last Login', sortable: true, align: 'right', render: (r) => timeAgo(r.lastLogin) },
  { key: 'createdAt', header: 'Joined', sortable: true, align: 'right', render: (r) => formatDate(r.createdAt) },
];

export function UsersPage() {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);

  const { data, loading, error, reload } = useAsync(
    () => getUsers({ page, pageSize: 10, sortField, sortDirection }),
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
        <Card title="Users" subtitle={`${data.pagination.total.toLocaleString()} total users`} padded={false}>
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
