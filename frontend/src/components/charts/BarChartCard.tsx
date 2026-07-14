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
import type { ChartData } from '@/types';
import { toRechartsRows, formatPercent } from '@/lib/format';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export function BarChartCard({ data, height = 280 }: { data: ChartData; height?: number }) {
  const rows = toRechartsRows(data);
  const colors = Array.isArray(data.datasets[0]?.backgroundColor)
    ? (data.datasets[0].backgroundColor as string[])
    : PALETTE;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatPercent(v)}
            width={56}
          />
          <Tooltip
            cursor={{ fill: 'rgba(148,163,184,0.08)' }}
            formatter={(value: number, name: string) => [formatPercent(value), name]}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Bar dataKey={data.datasets[0]?.label} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {rows.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
