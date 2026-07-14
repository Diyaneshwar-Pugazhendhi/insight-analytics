import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutDatum {
  name: string;
  value: number;
  color?: string;
}

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function DonutChartCard({
  data,
  height = 260,
  centerLabel,
  centerValue,
}: {
  data: DonutDatum[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div style={{ height }} className="relative w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={d.color ?? PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
              name,
            ]}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#cbd5e1' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-slate-50">{centerValue}</span>
          {centerLabel && <span className="text-xs text-slate-400">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
