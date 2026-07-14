import { useAsync } from '@/hooks/useAsync';
import { getTraffic } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageState } from '@/components/ui/StateView';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { DonutChartCard } from '@/components/charts/DonutChartCard';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';

export function TrafficPage() {
  const { data, loading, error, reload } = useAsync(getTraffic, []);

  return (
    <PageState loading={loading} error={error} onRetry={reload}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Traffic Sources" subtitle="Share of total visitors">
              <DonutChartCard
                data={data.sources.map((s) => ({ name: s.source, value: s.visitors }))}
                centerValue={formatNumber(data.sources[0]?.visitors ?? 0)}
                centerLabel="Top source"
              />
              <ul className="mt-4 space-y-2">
                {data.sources.map((s) => (
                  <li key={s.source} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{s.source}</span>
                    <span className="text-slate-400">
                      {formatNumber(s.visitors)} · {formatPercent(s.percentage)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Conversion by Channel" subtitle="Conversion rate %">
              <BarChartCard data={data.conversionChart} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Visitor Trends" subtitle="Hourly visitors">
              <BarChartCard data={data.chartData} />
            </Card>

            <Card title="Top Countries" subtitle="By visitors">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-3 py-2">Country</th>
                      <th className="px-3 py-2 text-right">Visitors</th>
                      <th className="px-3 py-2 text-right">Revenue</th>
                      <th className="px-3 py-2 text-right">Conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.geo.map((g) => (
                      <tr key={g.countryCode} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                        <td className="px-3 py-2">
                          <span className="mr-2 text-slate-500">{g.countryCode}</span>
                          <span className="text-slate-200">{g.country}</span>
                        </td>
                        <td className="px-3 py-2 text-right text-slate-300">{formatNumber(g.visitors)}</td>
                        <td className="px-3 py-2 text-right text-slate-200">{formatCurrency(g.revenue, true)}</td>
                        <td className="px-3 py-2 text-right text-slate-400">{formatPercent(g.conversionRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageState>
  );
}
