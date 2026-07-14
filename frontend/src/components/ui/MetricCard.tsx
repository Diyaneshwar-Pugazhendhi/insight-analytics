import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, Users, TrendingUp, CreditCard, Activity } from 'lucide-react';
import type { ComponentType } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';
import type { MetricCard as MetricCardType } from '@/types';
import { cn } from '@/lib/cn';
import { formatMetricValue } from '@/lib/format';

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  users: Users,
  conversion: TrendingUp,
  avgOrder: CreditCard,
  bounceRate: Activity,
};

const ACCENTS: Record<string, string> = {
  revenue: 'text-emerald-400 bg-emerald-400/10',
  orders: 'text-sky-400 bg-sky-400/10',
  users: 'text-violet-400 bg-violet-400/10',
  conversion: 'text-amber-400 bg-amber-400/10',
  avgOrder: 'text-rose-400 bg-rose-400/10',
  bounceRate: 'text-teal-400 bg-teal-400/10',
};

const SPARK_COLORS: Record<string, string> = {
  revenue: '#34d399',
  orders: '#38bdf8',
  users: '#a78bfa',
  conversion: '#fbbf24',
  avgOrder: '#fb7185',
  bounceRate: '#2dd4bf',
};

export function MetricCard({ metric }: { metric: MetricCardType }) {
  const Icon = ICONS[metric.id] ?? Activity;
  const accent = ACCENTS[metric.id] ?? 'text-slate-300 bg-slate-700/30';
  const sparkColor = SPARK_COLORS[metric.id] ?? '#60a5fa';
  const isUp = metric.changeType === 'increase';
  const trendUp = metric.trend[metric.trend.length - 1] >= metric.trend[0];

  const sparkData = metric.trend.map((value, i) => ({ i, value }));

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className={cn('grid h-10 w-10 place-items-center rounded-lg', accent)}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
            isUp ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400',
          )}
        >
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(metric.change).toFixed(1)}%
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">{metric.title}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
        {formatMetricValue(metric.value, metric.format)}
      </p>

      <div className="-mb-2 mt-3 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={sparkColor}
              strokeWidth={2}
              fill={`url(#spark-${metric.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        {trendUp ? 'Trending up' : 'Trending down'} this period
      </p>
    </div>
  );
}
