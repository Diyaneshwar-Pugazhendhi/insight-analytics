import { useAsync } from '@/hooks/useAsync';
import { getProducts } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageState } from '@/components/ui/StateView';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/format';

const CAT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#ef4444'];

export function ProductsPage() {
  const { data, loading, error, reload } = useAsync(getProducts, []);

  return (
    <PageState loading={loading} error={error} onRetry={reload}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card title="Revenue by Category" subtitle="Top categories" className="lg:col-span-1">
              <div style={{ height: 320 }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.byCategory}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatCurrency(v, true)} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={92} />
                    <Tooltip
                      cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                    />
                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                      {data.byCategory.map((_, i) => (
                        <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Top Products" subtitle="Ranked by revenue" className="lg:col-span-2">
              <ol className="space-y-3">
                {data.topProducts.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-800 text-xs font-semibold text-slate-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-200">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </div>
                    <div className="w-32">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{
                            width: `${Math.max(
                              6,
                              (p.revenue / data.topProducts[0].revenue) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-sm font-medium text-slate-100">{formatCurrency(p.revenue, true)}</p>
                      <p className="text-xs text-slate-500">{formatNumber(p.unitsSold)} sold</p>
                    </div>
                    <span
                      className={`w-14 text-right text-xs font-medium ${
                        p.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {p.growth >= 0 ? '+' : ''}
                      {p.growth.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <Card title="All Products" subtitle={`${data.allProducts.length} products`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2 text-right">Revenue</th>
                    <th className="px-3 py-2 text-right">Units Sold</th>
                    <th className="px-3 py-2 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {data.allProducts.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="px-3 py-2 text-slate-200">{p.name}</td>
                      <td className="px-3 py-2 text-slate-400">{p.category}</td>
                      <td className="px-3 py-2 text-right text-slate-200">{formatCurrency(p.revenue)}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{p.unitsSold}</td>
                      <td
                        className={`px-3 py-2 text-right ${
                          p.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {p.growth >= 0 ? '+' : ''}
                        {p.growth.toFixed(1)}%
                      </td>
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
