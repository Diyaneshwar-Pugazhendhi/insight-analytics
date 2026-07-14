import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getSales } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageState } from '@/components/ui/StateView';
import { AreaChartCard } from '@/components/charts/AreaChartCard';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { cn } from '@/lib/cn';

const PERIODS = ['7d', '30d', '90d', '1y'] as const;
type Period = (typeof PERIODS)[number];

export function SalesPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const { data, loading, error, reload } = useAsync(() => getSales(period), [period]);

  return (
    <PageState loading={loading} error={error} onRetry={reload}>
      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900/60 p-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition',
                    period === p
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-slate-200',
                  )}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard label="Total Revenue" value={formatCurrency(data.summary.totalRevenue)} />
            <SummaryCard label="Total Orders" value={formatNumber(data.summary.totalOrders)} />
            <SummaryCard label="Customers" value={formatNumber(data.summary.totalCustomers)} />
            <SummaryCard label="Avg Order Value" value={formatCurrency(data.summary.avgOrderValue)} />
          </div>

          <Card title="Revenue & Orders" subtitle={`Period: ${data.period}`}>
            <AreaChartCard data={data.chartData} valueFormatter={(v) => formatCurrency(v, true)} />
          </Card>

          <Card title="Daily Breakdown" subtitle="Revenue, orders and customers per day">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2 text-right">Revenue</th>
                    <th className="px-3 py-2 text-right">Orders</th>
                    <th className="px-3 py-2 text-right">Customers</th>
                    <th className="px-3 py-2 text-right">AOV</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dailyData.map((d) => (
                    <tr key={d.date} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="px-3 py-2 text-slate-300">
                        {new Date(d.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-200">{formatCurrency(d.revenue)}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{d.orders}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{d.customers}</td>
                      <td className="px-3 py-2 text-right text-slate-400">{formatCurrency(d.avgOrderValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </PageState>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}
