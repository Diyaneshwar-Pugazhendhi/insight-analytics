import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartData } from '@/types';
import { toRechartsRows, formatCompact } from '@/lib/format';

function firstColor(c?: string | string[]): string {
  if (Array.isArray(c)) return c[0] ?? '#60a5fa';
  return c ?? '#60a5fa';
}

export function AreaChartCard({
  data,
  height = 280,
  valueFormatter,
}: {
  data: ChartData;
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  const rows = toRechartsRows(data);
  const fmt = valueFormatter ?? ((v: number) => formatCompact(v));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {data.datasets.map((ds, i) => {
              const color = firstColor(ds.borderColor);
              return (
                <linearGradient key={i} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmt} width={56} />
          <Tooltip
            formatter={(value: number, name: string) => [fmt(value), name]}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          {data.datasets.map((ds, i) => (
            <Area
              key={ds.label}
              type="monotone"
              dataKey={ds.label}
              stroke={firstColor(ds.borderColor)}
              strokeWidth={2}
              fill={`url(#area-${i})`}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
