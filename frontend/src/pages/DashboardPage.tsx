import { useAsync } from '@/hooks/useAsync';
import { getDashboard } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { PageState } from '@/components/ui/StateView';
import { AreaChartCard } from '@/components/charts/AreaChartCard';
import { DonutChartCard } from '@/components/charts/DonutChartCard';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';

export function DashboardPage() {
  const { data, loading, error, reload } = useAsync(getDashboard, []);

  return (
    <PageState loading={loading} error={error} onRetry={reload}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((m) => (
              <MetricCard key={m.id} metric={m} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card title="Revenue" subtitle="Last 30 days" className="lg:col-span-2">
              <AreaChartCard data={data.revenueChart} valueFormatter={(v) => formatCurrency(v, true)} />
            </Card>
            <Card title="Traffic" subtitle="Hourly visitors">
              <AreaChartCard data={data.trafficChart} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card title="Top Products" subtitle="By revenue" className="lg:col-span-1">
              <ul className="space-y-3">
                {data.topProducts.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-800 text-xs font-semibold text-slate-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-200">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-100">{formatCurrency(p.revenue, true)}</p>
                      <p className={`text-xs ${p.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {p.growth >= 0 ? '+' : ''}
                        {p.growth.toFixed(1)}%
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Traffic Sources" subtitle="Share of visitors" className="lg:col-span-1">
              <DonutChartCard
                data={data.trafficSources.map((s) => ({
                  name: s.source,
                  value: s.visitors,
                }))}
                centerValue={formatNumber(data.trafficSources[0]?.visitors ?? 0)}
                centerLabel="Top source"
              />
            </Card>

            <Card title="Recent Activity" className="lg:col-span-1">
              <ActivityFeed items={data.recentActivity} />
            </Card>
          </div>

          <Card title="Conversion by Channel" subtitle="Conversion rate %">
            <AreaChartCard data={data.conversionChart} valueFormatter={(v) => formatPercent(v)} />
          </Card>
        </div>
      )}
    </PageState>
  );
}
